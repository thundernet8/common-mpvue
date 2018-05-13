import wx from './wx';

declare var window;

export default function polyfill() {
    let _wx;

    // 判断当前容器环境
    const isUnderBrowser =
        typeof window === 'object' && Object.prototype.toString.call(window) === '[object Window]';

    return (function() {
        if (_wx) {
            return _wx;
        }
        if (isUnderBrowser) {
            console.warn('auto polyfill wx/getApp/getCurrentPages for mp');
            // polyfill wx
            window.wx = wx;
            // polyfill getApp
            const getApp = function() {
                return window.__mpapp__;
            };
            window.getApp = getApp;
            // polyfill getCurrentPages
            const getCurrentPages = function() {
                return [];
            };
            window.getCurrentPages = getCurrentPages;

            _wx = {
                wx,
                getApp,
                getCurrentPages
            };
        } else {
            _wx = {};
        }

        return _wx;
    })();
}
