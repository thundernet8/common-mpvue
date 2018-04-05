import qs from 'querystring';
import Configurable from '../base/configurable';
import { RequestConfig } from '../interface/config';
import { RequestOptions } from '../interface/option';
import { BaseKV } from '../interface';
import { pureAssign, addUrlQuery } from '../utils';
import wxp from '../wxp';

interface RequestQueueItem {
    promise: { resolve; reject };
    req;
    opts: RequestOptions;
}

class RequestManager {
    // 并发请求数量上限
    _LIMIT = 10;

    // 当前请求数量
    _requestCount = 0;

    // 请求队列
    _queue: RequestQueueItem[] = [];

    // 默认配置
    // _config: RequestOptions = {
    //     level: 1,
    //     checkToken: true,
    //     tokenKey: 'token'
    // };

    // 请求配置
    _reqConfig: RequestConfig;

    constructor(config: RequestConfig) {
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
        } else {
            this._queue.splice(index, 0, newRequest);
        }
        this.run();
    }

    run() {
        const doRequest = (anRequest: RequestQueueItem) => {
            this._requestCount++;

            const req = anRequest.req;
            const promise = anRequest.promise;
            const opts = anRequest.opts;
            const data = req.data || {};
            // const token = getApp().getToken();

            // if (typeof data === 'object') {
            //     data.appversion = this._reqConfig.version;
            //     data.appname = this._reqConfig.name;
            // } else {
            //     console.error('Request data must be object!');
            // }
            if (typeof data !== 'object') {
                console.error('Request data must be object!');
            }

            // if (token) {
            //     data.token = token;
            // }

            req.data = opts.formPost ? qs.stringify(data) : data;

            const done = () => {
                this._requestCount = Math.max(this._requestCount - 1, 0);
                this.run();
            };

            const _complete = req.complete;
            req.complete = function() {
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

    wrapRequest(req, promise: { resolve; reject }, opts: RequestOptions = {}) {
        const app = getApp();
        if (app.debug) {
            console.log('request', req);
        }
        return wxp
            .request(req)
            .then(res => {
                if (res && Number(res.statusCode) === 200) {
                    const loginCode = res.data.loginCode;
                    if (
                        loginCode !== null &&
                        loginCode !== undefined &&
                        Number(loginCode) !== 200 &&
                        opts.auth
                    ) {
                        if (opts.checkToken) {
                            // 登录失效
                            if (app.debug) {
                                console.warn('Warn: 登陆态失效，正在进行登出');
                            }

                            app.setToken('');
                        }
                    }
                    promise.resolve(res.data);
                } else {
                    throw new Error(res.errMsg);
                }
            })
            .catch(error => {
                promise.reject(error || new Error('网络请求失败'));
            });
    }
}

class ChainableRequest extends Configurable {
    protected _requestManagerInstance: RequestManager;

    /**
     * 基本配置，例如base url
     */
    protected _config: RequestConfig;

    /**
     * 请求选项
     */
    protected _reqOpts: RequestOptions = {
        auth: true,
        level: 1,
        checkToken: true,
        qsToken: true
    };

    private _setReqOptions(key, value) {
        const opts = this._reqOpts;
        opts[key] = value;
        this._reqOpts = opts;
    }

    protected get _requestManager() {
        if (!this._requestManagerInstance) {
            this._requestManagerInstance = new RequestManager(this._config);
        }

        return this._requestManagerInstance;
    }

    protected _getFullUrl(url) {
        return /https?:\/\//i.test(url)
            ? url
            : `${this.config('domain')}${url.startsWith('/') ? '' : '/'}${url}`;
    }

    protected _getMapiHeader() {
        const app = getApp();
        return app.getSystemInfo().then(systemInfo => {
            return {
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
        });
    }

    protected _getCustomApiHeader() {
        // TODO
        return Promise.resolve({});
    }

    protected _getBaseHeader() {
        return Promise.resolve({
            appVersion: this.config('version'),
            appName: this.config('name'),
            isMicroMessenger: 'true'
        });
    }

    request(obj, opts: RequestOptions = {}) {
        const newOptions: RequestOptions = pureAssign(this._reqOpts, opts || {});
        const app = getApp();
        obj.url = this._getFullUrl(obj.url);
        if (!/https?:\/\//i.test(obj.url)) {
            return Promise.reject(
                new Error('请添加request实例的domain配置或者使用绝对http地址请求')
            );
        }

        if (newOptions.auth && newOptions.cookieToken) {
            obj.header = Object.assign({}, obj.header, {
                Cookie: `${newOptions.tokenKey || 'token'}=${app.getToken() || ''}`
            });
        }
        if (newOptions.formPost) {
            obj.header = Object.assign({}, obj.header, {
                'Content-Type': 'application/x-www-form-urlencoded'
            });
        }
        if (newOptions.auth && newOptions.qsToken) {
            obj.url = addUrlQuery(obj.url, {
                [newOptions.tokenKey || 'token']: getApp().getToken()
            });
        }

        let promise;

        if (newOptions.isMapiRequest) {
            promise = this._getMapiHeader();
        } else if (newOptions.isCustomRequest) {
            promise = this._getCustomApiHeader();
        } else {
            promise = this._getBaseHeader();
        }

        return promise.then(
            header =>
                new Promise((resolve, reject) => {
                    try {
                        obj.header = pureAssign({}, obj.header, header);
                        this._requestManager.push(
                            obj,
                            {
                                resolve,
                                reject
                            },
                            newOptions
                        );
                    } catch (e) {
                        if (app.debug) {
                            console.log('[Request] Fail:', e);
                        }
                        // 发送错误时，重置防止阻塞,同时启用正常的API调用
                        this._requestManager.reset();
                        return this._requestManager.wrapRequest(
                            obj,
                            {
                                resolve,
                                reject
                            },
                            newOptions
                        );
                    }
                })
        );
    }

    // 链式配置
    mapi(): ShadowRequest {
        if (this instanceof Request) {
            const shadow = new ShadowRequest(this._requestManager, this._config);
            return shadow.mapi();
        }
        this._setReqOptions('isMapiRequest', true);
        return this as any;
    }

    custom(): ShadowRequest {
        if (this instanceof Request) {
            const shadow = new ShadowRequest(this._requestManager, this._config);
            return shadow.custom();
        }
        this._setReqOptions('isCustomRequest', true);
        return this as any;
    }

    auth(): ShadowRequest {
        if (this instanceof Request) {
            const shadow = new ShadowRequest(this._requestManager, this._config);
            return shadow.auth();
        }
        this._setReqOptions('auth', true);
        return this as any;
    }

    tokenKey(key: string): ShadowRequest {
        if (this instanceof Request) {
            const shadow = new ShadowRequest(this._requestManager, this._config);
            return shadow.tokenKey(key);
        }
        this._setReqOptions('tokenKey', key);
        return this as any;
    }

    cookieToken(): ShadowRequest {
        if (this instanceof Request) {
            const shadow = new ShadowRequest(this._requestManager, this._config);
            return shadow.cookieToken();
        }
        this._setReqOptions('cookieToken', true);
        return this as any;
    }

    qsToken(): ShadowRequest {
        if (this instanceof Request) {
            const shadow = new ShadowRequest(this._requestManager, this._config);
            return shadow.qsToken();
        }
        this._setReqOptions('qsToken', true);
        return this as any;
    }

    form(): ShadowRequest {
        if (this instanceof Request) {
            const shadow = new ShadowRequest(this._requestManager, this._config);
            return shadow.form();
        }
        this._setReqOptions('formPost', true);
        return this as any;
    }
}

class ShadowRequest extends ChainableRequest {
    constructor(reqManager: RequestManager, config?: RequestConfig) {
        super();
        if (config) {
            this.configAll(config);
            this._requestManagerInstance = reqManager;
        }
    }

    GET(url: string, params?: BaseKV) {
        return this.request(
            {
                url: addUrlQuery(this._getFullUrl(url), pureAssign({}, params))
            },
            this._reqOpts
        );
    }

    POST(url: string, data?: BaseKV) {
        return this.request(
            {
                url: this._getFullUrl(url),
                data,
                method: 'POST'
            },
            this._reqOpts
        );
    }
}

export default class Request extends ChainableRequest {
    constructor(config?: RequestConfig) {
        super();
        if (config) {
            this.configAll(config);
            this._requestManagerInstance = new RequestManager(config);
        }
    }

    httpGet(url, params = {}, opts: RequestOptions = {}) {
        return this.request(
            {
                url: addUrlQuery(this._getFullUrl(url), pureAssign({}, params))
            },
            opts
        );
    }

    httpJsonPost(url: string, data: BaseKV = {}, opts: RequestOptions = {}) {
        return this.request(
            {
                url: this._getFullUrl(url),
                data,
                method: 'POST'
            },
            Object.assign({}, opts, {
                formPost: false
            })
        );
    }

    httpFormPost(url: string, data: BaseKV = {}, opts: RequestOptions = {}) {
        return this.request(
            {
                url: addUrlQuery(this._getFullUrl(url), {}),
                data,
                method: 'POST'
            },
            Object.assign({}, opts, {
                formPost: true
            })
        );
    }

    /**
     * 默认post请求，使用form post
     * @param url
     * @param data
     * @param opts
     */
    httpPost(url: string, data: BaseKV = {}, opts: RequestOptions = {}) {
        return this.httpFormPost(url, data, opts);
    }
}

export const httpRequest = new Request();
