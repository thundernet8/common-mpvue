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
        if (!this.config('url')) {
            console.warn('Cat Logger上报url未设置, 请使用app.logger.config("url", "地址")设置');
            return;
        }
        wx.request({
            method: 'POST',
            url: this.config('url'),
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: "c=" + encodeURIComponent(JSON.stringify(this._cache))
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
    return Logger;
}(Configurable));
export default Logger;
