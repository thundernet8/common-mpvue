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
import Configurable from '../base/configurable';
import { getFormatTime } from '../utils';
import wxp from '../wxp';
var Logger = /** @class */ (function (_super) {
    __extends(Logger, _super);
    function Logger() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._cache = [];
        return _this;
    }
    Logger.prototype.push = function (msg) {
        this._cache.push(msg);
        this.report();
    };
    Logger.prototype.report = function () {
        var _this = this;
        if (!this.config('reportDomain')) {
            console.warn('Logger上报url未设置, 请使用app.logger.config("url", "地址")设置');
            return;
        }
        var cache = this._cache;
        this._cache = [];
        wxp
            .request({
            method: 'POST',
            url: this.config('reportDomain'),
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: "c=" + encodeURIComponent(JSON.stringify(cache))
        })
            .catch(function () {
            // 上报失败，归还消息
            _this._cache = new Array(0).concat(_this._cache, cache);
        });
    };
    Logger.prototype._log = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var sysInfo = getApp().getSystemInfo();
        if (sysInfo.platform === 'devtools') {
            console.log.apply(console, ["[" + getFormatTime() + " " + String.prototype.toUpperCase.call(type) + "]"].concat(args));
        }
        else {
            if (args.length < 1) {
                return;
            }
            var msg = args
                .filter(function (arg) { return arg !== undefined; })
                .reduce(function (previous, current) {
                return previous.concat(typeof current === 'string' ? [current] : [JSON.stringify(current)]);
            }, [])
                .join(' ');
            if (msg.length > 2048) {
                console.warn('Log不建议传输多于2048字节的信息');
            }
            var app = getApp();
            this.push({
                project: app.pkgName || app.name,
                pageUrl: (app.pkgName || app.name) + ":" + (app.getPage().route || 'app'),
                category: 'jsError',
                timestamp: +new Date(),
                level: type,
                content: msg
            });
        }
    };
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this._log.apply(this, ['log'].concat(args));
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this._log.apply(this, ['error'].concat(args));
    };
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this._log.apply(this, ['warn'].concat(args));
    };
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this._log.apply(this, ['info'].concat(args));
    };
    return Logger;
}(Configurable));
export default Logger;
