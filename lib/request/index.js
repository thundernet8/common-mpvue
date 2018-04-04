import qs from 'querystring';
import Configurable from '../base/configurable';
import { pureAssign, addUrlQuery } from '../utils';
import wxp from '../wxp';
class RequestManager {
    constructor(config) {
        // 并发请求数量上限
        this._LIMIT = 10;
        // 当前请求数量
        this._requestCount = 0;
        // 请求队列
        this._queue = [];
        // 默认配置
        this._config = {
            level: 1,
            checkToken: true,
            tokenKey: 'token'
        };
        this._reqConfig = config;
    }
    reset() {
        this._requestCount = 0;
    }
    push(obj, promise, opts) {
        let index = -1;
        for (let i = 0; i < this._queue.length; i++) {
            const anRequest = this._queue[i];
            if (anRequest !== undefined && (anRequest.opts.level || 1) > opts.level) {
                index = i;
                break;
            }
        }
        const newRequest = {
            req: obj,
            promise,
            opts
        };
        if (index === -1) {
            this._queue.push(newRequest);
        }
        else {
            this._queue.splice(index, 0, newRequest);
        }
        this.run();
    }
    run() {
        const doRequest = (anRequest) => {
            this._requestCount++;
            const req = anRequest.req;
            const promise = anRequest.promise;
            const opts = anRequest.opts;
            const data = req.data || {};
            const token = getApp().getToken();
            if (typeof data === 'object') {
                data.appversion = this._reqConfig.version;
                data.appname = this._reqConfig.name;
            }
            else {
                console.error('Request data must be object!');
            }
            if (token) {
                data.token = token;
            }
            req.data = opts.formPost ? qs.stringify(data) : data;
            const done = () => {
                this._requestCount = Math.max(this._requestCount - 1, 0);
                this.run();
            };
            const _complete = req.complete;
            req.complete = function () {
                done();
                if (typeof _complete === 'function') {
                    _complete();
                }
            };
            return this.wrapRequest(req, promise, opts);
        };
        if (this._requestCount < this._LIMIT && this._queue.length) {
            const anRequest = this._queue.shift();
            if (anRequest) {
                doRequest(anRequest);
            }
        }
    }
    wrapRequest(req, promise, opts = {}) {
        const app = getApp();
        if (app.debug) {
            console.log('request', req);
        }
        return wxp
            .request(req)
            .then(res => {
            if (res && Number(res.statusCode) === 200) {
                const loginCode = res.data.loginCode;
                if (loginCode !== null &&
                    loginCode !== undefined &&
                    Number(loginCode) !== 200 &&
                    req.data &&
                    req.data.token) {
                    if (opts.checkToken) {
                        // 登录失效
                        if (app.debug) {
                            console.warn('Warn: 登陆态失效，正在进行登出');
                        }
                        app.setToken('');
                    }
                }
            }
            promise.resolve(res.data);
        })
            .catch(error => {
            promise.reject(error || new Error('网络请求失败'));
        });
    }
}
class ChainableRequest extends Configurable {
    constructor() {
        super(...arguments);
        this._reqOpts = {};
    }
    _setReqOptions(key, value) {
        const opts = this._reqOpts;
        opts[key] = value;
        this._reqOpts = opts;
    }
    get _requestManager() {
        if (!this._requestManagerInstance) {
            this._requestManagerInstance = new RequestManager(this._config);
        }
        return this._requestManagerInstance;
    }
    _getFullUrl(url) {
        return /https?:\/\//i.test(url)
            ? url
            : `${this.config('domain')}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    mapiRequest(req) {
        const app = getApp();
        return app.getSystemInfo().then(systemInfo => {
            const _header = {
                dpid: app.getOpenId(),
                token: app.getToken(),
                appVersion: this.config('version'),
                appName: this.config('name'),
                isMicroMessenger: 'true',
                microMsgVersion: systemInfo.version,
                'network-type': systemInfo.networkType,
                'phone-brand': systemInfo.brand,
                'phone-model': systemInfo.model,
                platform: systemInfo.platform.indexOf('ios') > -1 ? 'iPhone' : 'Android',
                platformVersion: systemInfo.system.split(' ')[1] || ''
            };
            req.header = pureAssign(req.header || {}, _header);
            return wxp.request(req).then(res => {
                if (res && Number(res.statusCode) === 200) {
                    return res.data;
                }
                else {
                    throw new Error(res.errMsg);
                }
            });
        });
    }
    request(obj, opts) {
        const app = getApp();
        obj.url = this._getFullUrl(obj.url);
        if (!/https?:\/\//i.test(obj.url)) {
            return Promise.reject(new Error('请添加request实例的domain配置或者使用绝对http地址请求'));
        }
        if (opts && opts.cookieToken) {
            obj.header = Object.assign({}, obj.header, {
                Cookie: `${opts.tokenKey || 'token'}=${app.getToken() || ''}`
            });
        }
        if (opts && opts.formPost) {
            obj.header = Object.assign({}, obj.header, {
                'Content-Type': 'application/x-www-form-urlencoded'
            });
        }
        if (opts && opts.qsToken) {
            obj.url = addUrlQuery(obj.url, {
                [opts.tokenKey || 'token']: getApp().getToken()
            });
        }
        if (opts && opts.isMapiRequest) {
            if (opts.formPost) {
                obj.data = qs.stringify(obj.data);
            }
            return this.mapiRequest(obj);
        }
        return new Promise((resolve, reject) => {
            const newOptions = pureAssign(this._config, opts);
            try {
                this._requestManager.push(obj, {
                    resolve,
                    reject
                }, newOptions);
            }
            catch (e) {
                if (app.debug) {
                    console.log('[Request] Fail:', e);
                }
                // 发送错误时，重置防止阻塞,同时启用正常的API调用
                this._requestManager.reset();
                return this._requestManager.wrapRequest(obj, {
                    resolve,
                    reject
                }, newOptions);
            }
        });
    }
    // 链式配置
    mapi() {
        if (this instanceof Request) {
            const shadow = new ShadowRequest(this._requestManager, this._config);
            return shadow.mapi();
        }
        this._setReqOptions('isMapiRequest', true);
        return this;
    }
    cookieToken() {
        if (this instanceof Request) {
            const shadow = new ShadowRequest(this._requestManager, this._config);
            return shadow.cookieToken();
        }
        this._setReqOptions('cookieToken', true);
        return this;
    }
    qsToken() {
        if (this instanceof Request) {
            const shadow = new ShadowRequest(this._requestManager, this._config);
            return shadow.qsToken();
        }
        this._setReqOptions('qsToken', true);
        return this;
    }
    form() {
        if (this instanceof Request) {
            const shadow = new ShadowRequest(this._requestManager, this._config);
            return shadow.form();
        }
        this._setReqOptions('formPost', true);
        return this;
    }
}
class ShadowRequest extends ChainableRequest {
    constructor(reqManager, config) {
        super();
        if (config) {
            this.configAll(config);
            this._requestManagerInstance = reqManager;
        }
    }
    GET(url, params) {
        return this.request({
            url: addUrlQuery(this._getFullUrl(url), pureAssign({}, params))
        }, this._reqOpts);
    }
    POST(url, data) {
        return this.request({
            url: this._getFullUrl(url),
            data,
            method: 'POST'
        }, this._reqOpts);
    }
}
export default class Request extends ChainableRequest {
    constructor(config) {
        super();
        if (config) {
            this.configAll(config);
            this._requestManagerInstance = new RequestManager(config);
        }
    }
    httpGet(url, params = {}, opts = {}) {
        return this.request({
            url: addUrlQuery(this._getFullUrl(url), pureAssign({}, params))
        }, opts);
    }
    httpJsonPost(url, data = {}, opts = {}) {
        return this.request({
            url: this._getFullUrl(url),
            data,
            method: 'POST'
        }, Object.assign({}, opts, {
            formPost: false
        }));
    }
    httpFormPost(url, data = {}, opts = {}) {
        return this.request({
            url: addUrlQuery(this._getFullUrl(url), {}),
            data,
            method: 'POST'
        }, Object.assign({}, opts, {
            formPost: true
        }));
    }
    /**
     * 默认post请求，使用form post
     * @param url
     * @param data
     * @param opts
     */
    httpPost(url, data = {}, opts = {}) {
        return this.httpFormPost(url, data, opts);
    }
}
export const httpRequest = new Request();
