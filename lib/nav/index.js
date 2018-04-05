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
import { addUrlQuery } from '../utils';
import wxp from '../wxp';
var Navigator = /** @class */ (function (_super) {
    __extends(Navigator, _super);
    function Navigator(config) {
        var _this = _super.call(this) || this;
        if (config) {
            _this.configAll(config);
        }
        return _this;
    }
    Object.defineProperty(Navigator.prototype, "_WEBVIEW_PAGE", {
        get: function () {
            return this.config('webviewSchema') || '/pages/webview/webview';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 跳转并控制页面栈数量
     * @param url
     * @param query
     */
    Navigator.prototype.navigateTo = function (url, query) {
        if (query === void 0) { query = {}; }
        var fullUrl = addUrlQuery(url, query);
        if (/^https?/i.test(fullUrl)) {
            // 跳webview
            fullUrl = addUrlQuery(this._WEBVIEW_PAGE, {
                url: fullUrl
            });
        }
        var pageLen = getCurrentPages().length;
        var maxLen = Math.min(10, this.config('pageLimit'));
        if (pageLen >= maxLen) {
            return wxp.redirectTo({
                url: fullUrl
            });
        }
        else {
            return wxp.navigateTo({
                url: fullUrl
            });
        }
    };
    Navigator.prototype.navigateToH5 = function (url, query, navBarOptions) {
        if (query === void 0) { query = {}; }
        if (!/^https?/i.test(url)) {
            throw new Error("\u4E0D\u5408\u6CD5\u7684H5\u5730\u5740:" + url);
        }
        var title = navBarOptions.title, frontColor = navBarOptions.frontColor, backgroundColor = navBarOptions.backgroundColor;
        if (title) {
            query.wx_title = title;
        }
        if (frontColor) {
            query.wx_front_color = frontColor;
        }
        if (backgroundColor) {
            query.wx_bg_color = backgroundColor;
        }
        return this.navigateTo(url, query);
    };
    return Navigator;
}(Configurable));
export default Navigator;
