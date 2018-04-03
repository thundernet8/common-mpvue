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
                _complete && _complete();
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
                            console.log('Warn: 登陆态失效，正在进行登出');
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
export default class Request extends Configurable {
    constructor(config) {
        super();
        this.httpRequest = new Request();
        if (config) {
            this.configAll(config);
            this._requestManagerInstance = new RequestManager(config);
        }
    }
    get _requestManager() {
        if (!this._requestManagerInstance) {
            this._requestManagerInstance = new RequestManager(this._config);
        }
        return this._requestManagerInstance;
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
}
