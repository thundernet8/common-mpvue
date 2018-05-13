import wx from './wx';
export default function polyfill() {
    // 判断当前容器环境
    var isUnderBrowser = typeof window === 'object' && Object.prototype.toString.call(window) === '[object Window]';
    if (isUnderBrowser) {
        console.warn('auto polyfill wx/getApp/getCurrentPages for mp');
        // polyfill wx
        window.wx = wx;
        // polyfill getApp
        window.getApp = function () {
            return window.__mpapp__;
        };
        // polyfill getCurrentPages
        window.getCurrentPages = function () {
            return [];
        };
    }
}
