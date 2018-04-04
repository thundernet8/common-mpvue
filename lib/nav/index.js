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
    /**
     * 跳转并控制页面栈数量
     * @param url
     */
    Navigator.prototype.navigateTo = function (url) {
        var pageLen = getCurrentPages().length;
        var maxLen = Math.min(10, this.config('pageLimit'));
        if (pageLen >= maxLen) {
            return wxp.redirectTo({
                url: url
            });
        }
        else {
            return wxp.navigateTo({
                url: url
            });
        }
    };
    return Navigator;
}(Configurable));
export default Navigator;
