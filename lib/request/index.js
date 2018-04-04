var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import qs from 'querystring';
import Configurable from '../base/configurable';
import { pureAssign, addUrlQuery } from '../utils';
import wxp from '../wxp';
var RequestManager = /** @class */ (function () {
    function RequestManager(config) {
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
    RequestManager.prototype.reset = function () {
        this._requestCount = 0;
    };
    RequestManager.prototype.push = function (obj, promise, opts) {
        var index = -1;
        for (var i = 0; i < this._queue.length; i++) {
            var anRequest = this._queue[i];
            if (anRequest !== undefined && (anRequest.opts.level || 1) > opts.level) {
                index = i;
                break;
            }
        }
        var newRequest = {
            req: obj,
            promise: promise,
            opts: opts
        };
        if (index === -1) {
            this._queue.push(newRequest);
        }
        else {
            this._queue.splice(index, 0, newRequest);
        }
        this.run();
    };
    RequestManager.prototype.run = function () {
        var _this = this;
        var doRequest = function (anRequest) {
            _this._requestCount++;
            var req = anRequest.req;
            var promise = anRequest.promise;
            var opts = anRequest.opts;
            var data = req.data || {};
            var token = getApp().getToken();
            if (typeof data === 'object') {
                data.appversion = _this._reqConfig.version;
                data.appname = _this._reqConfig.name;
            }
            else {
                console.error('Request data must be object!');
            }
            if (token) {
                data.token = token;
            }
            req.data = opts.formPost ? qs.stringify(data) : data;
            var done = function () {
                _this._requestCount = Math.max(_this._requestCount - 1, 0);
                _this.run();
            };
            var _complete = req.complete;
            req.complete = function () {
                done();
                if (typeof _complete === 'function') {
                    _complete();
                }
            };
            return _this.wrapRequest(req, promise, opts);
        };
        if (this._requestCount < this._LIMIT && this._queue.length) {
            var anRequest = this._queue.shift();
            if (anRequest) {
                doRequest(anRequest);
            }
        }
    };
    RequestManager.prototype.wrapRequest = function (req, promise, opts) {
        if (opts === void 0) { opts = {}; }
        var app = getApp();
        if (app.debug) {
            console.log('request', req);
        }
        return wxp
            .request(req)
            .then(function (res) {
            if (res && Number(res.statusCode) === 200) {
                var loginCode = res.data.loginCode;
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
            .catch(function (error) {
            promise.reject(error || new Error('网络请求失败'));
        });
    };
    return RequestManager;
}());
var ChainableRequest = /** @class */ (function (_super) {
    __extends(ChainableRequest, _super);
    function ChainableRequest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._reqOpts = {};
        return _this;
    }
    ChainableRequest.prototype._setReqOptions = function (key, value) {
        var opts = this._reqOpts;
        opts[key] = value;
        this._reqOpts = opts;
    };
    Object.defineProperty(ChainableRequest.prototype, "_requestManager", {
        get: function () {
            if (!this._requestManagerInstance) {
                this._requestManagerInstance = new RequestManager(this._config);
            }
            return this._requestManagerInstance;
        },
        enumerable: true,
        configurable: true
    });
    ChainableRequest.prototype._getFullUrl = function (url) {
        return /https?:\/\//i.test(url)
            ? url
            : "" + this.config('domain') + (url.startsWith('/') ? '' : '/') + url;
    };
    ChainableRequest.prototype.mapiRequest = function (req) {
        var _this = this;
        var app = getApp();
        return app.getSystemInfo().then(function (systemInfo) {
            var _header = {
                dpid: app.getOpenId(),
                token: app.getToken(),
                appVersion: _this.config('version'),
                appName: _this.config('name'),
                isMicroMessenger: 'true',
                microMsgVersion: systemInfo.version,
                'network-type': systemInfo.networkType,
                'phone-brand': systemInfo.brand,
                'phone-model': systemInfo.model,
                platform: systemInfo.platform.indexOf('ios') > -1 ? 'iPhone' : 'Android',
                platformVersion: systemInfo.system.split(' ')[1] || ''
            };
            req.header = pureAssign(req.header || {}, _header);
            return wxp.request(req).then(function (res) {
                if (res && Number(res.statusCode) === 200) {
                    return res.data;
                }
                else {
                    throw new Error(res.errMsg);
                }
            });
        });
    };
    ChainableRequest.prototype.request = function (obj, opts) {
        var _this = this;
        var app = getApp();
        obj.url = this._getFullUrl(obj.url);
        if (!/https?:\/\//i.test(obj.url)) {
            return Promise.reject(new Error('请添加request实例的domain配置或者使用绝对http地址请求'));
        }
        if (opts && opts.cookieToken) {
            obj.header = Object.assign({}, obj.header, {
                Cookie: (opts.tokenKey || 'token') + "=" + (app.getToken() || '')
            });
        }
        if (opts && opts.formPost) {
            obj.header = Object.assign({}, obj.header, {
                'Content-Type': 'application/x-www-form-urlencoded'
            });
        }
        if (opts && opts.qsToken) {
            obj.url = addUrlQuery(obj.url, (_a = {},
                _a[opts.tokenKey || 'token'] = getApp().getToken(),
                _a));
        }
        if (opts && opts.isMapiRequest) {
            if (opts.formPost) {
                obj.data = qs.stringify(obj.data);
            }
            return this.mapiRequest(obj);
        }
        return new Promise(function (resolve, reject) {
            var newOptions = pureAssign(_this._config, opts);
            try {
                _this._requestManager.push(obj, {
                    resolve: resolve,
                    reject: reject
                }, newOptions);
            }
            catch (e) {
                if (app.debug) {
                    console.log('[Request] Fail:', e);
                }
                // 发送错误时，重置防止阻塞,同时启用正常的API调用
                _this._requestManager.reset();
                return _this._requestManager.wrapRequest(obj, {
                    resolve: resolve,
                    reject: reject
                }, newOptions);
            }
        });
        var _a;
    };
    // 链式配置
    ChainableRequest.prototype.mapi = function () {
        if (this instanceof Request) {
            var shadow = new ShadowRequest(this._requestManager, this._config);
            return shadow.mapi();
        }
        this._setReqOptions('isMapiRequest', true);
        return this;
    };
    ChainableRequest.prototype.cookieToken = function () {
        if (this instanceof Request) {
            var shadow = new ShadowRequest(this._requestManager, this._config);
            return shadow.cookieToken();
        }
        this._setReqOptions('cookieToken', true);
        return this;
    };
    ChainableRequest.prototype.qsToken = function () {
        if (this instanceof Request) {
            var shadow = new ShadowRequest(this._requestManager, this._config);
            return shadow.qsToken();
        }
        this._setReqOptions('qsToken', true);
        return this;
    };
    ChainableRequest.prototype.form = function () {
        if (this instanceof Request) {
            var shadow = new ShadowRequest(this._requestManager, this._config);
            return shadow.form();
        }
        this._setReqOptions('formPost', true);
        return this;
    };
    return ChainableRequest;
}(Configurable));
var ShadowRequest = /** @class */ (function (_super) {
    __extends(ShadowRequest, _super);
    function ShadowRequest(reqManager, config) {
        var _this = _super.call(this) || this;
        if (config) {
            _this.configAll(config);
            _this._requestManagerInstance = reqManager;
        }
        return _this;
    }
    ShadowRequest.prototype.GET = function (url, params) {
        return this.request({
            url: addUrlQuery(this._getFullUrl(url), pureAssign({}, params))
        }, this._reqOpts);
    };
    ShadowRequest.prototype.POST = function (url, data) {
        return this.request({
            url: this._getFullUrl(url),
            data: data,
            method: 'POST'
        }, this._reqOpts);
    };
    return ShadowRequest;
}(ChainableRequest));
var Request = /** @class */ (function (_super) {
    __extends(Request, _super);
    function Request(config) {
        var _this = _super.call(this) || this;
        if (config) {
            _this.configAll(config);
            _this._requestManagerInstance = new RequestManager(config);
        }
        return _this;
    }
    Request.prototype.httpGet = function (url, params, opts) {
        if (params === void 0) { params = {}; }
        if (opts === void 0) { opts = {}; }
        return this.request({
            url: addUrlQuery(this._getFullUrl(url), pureAssign({}, params))
        }, opts);
    };
    Request.prototype.httpJsonPost = function (url, data, opts) {
        if (data === void 0) { data = {}; }
        if (opts === void 0) { opts = {}; }
        return this.request({
            url: this._getFullUrl(url),
            data: data,
            method: 'POST'
        }, Object.assign({}, opts, {
            formPost: false
        }));
    };
    Request.prototype.httpFormPost = function (url, data, opts) {
        if (data === void 0) { data = {}; }
        if (opts === void 0) { opts = {}; }
        return this.request({
            url: addUrlQuery(this._getFullUrl(url), {}),
            data: data,
            method: 'POST'
        }, Object.assign({}, opts, {
            formPost: true
        }));
    };
    /**
     * 默认post请求，使用form post
     * @param url
     * @param data
     * @param opts
     */
    Request.prototype.httpPost = function (url, data, opts) {
        if (data === void 0) { data = {}; }
        if (opts === void 0) { opts = {}; }
        return this.httpFormPost(url, data, opts);
    };
    return Request;
}(ChainableRequest));
export default Request;
export var httpRequest = new Request();
