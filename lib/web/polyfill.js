import wx from './wx';
export default function polyfill() {
    // 判断当前容器环境
    var isUnderBrowser = typeof window === 'object' && Object.prototype.toString.call(window) === '[object Window]';
    if (isUnderBrowser) {
        console.warn('auto polyfill wx/getApp/getCurrentPages for mp');
        // polyfill wx
        window.wx = wx;
        // polyfill getApp
        var getApp_1 = function () {
            return window.__mpapp__;
        };
        window.getApp = getApp_1;
        // polyfill getCurrentPages
        var getCurrentPages_1 = function () {
            return [];
        };
        window.getCurrentPages = getCurrentPages_1;
        return {
            wx: wx,
            getApp: getApp_1,
            getCurrentPages: getCurrentPages_1
        };
    }
    else {
        return {};
    }
}
