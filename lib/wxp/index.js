import { httpRequest } from '../request';
import nav from '../nav';
var noPromiseMethods = [
    'stopRecord',
    'pauseVoice',
    'stopVoice',
    'pauseBackgroundAudio',
    'stopBackgroundAudio',
    'showNavigationBarLoading',
    'hideNavigationBarLoading',
    'createAnimation',
    'createContext',
    'hideKeyboard',
    'stopPullDownRefresh'
];
Promise.prototype.finally = function (finaliser) {
    return this.then(function (result) {
        finaliser();
        return result;
    }, function (reason) {
        finaliser();
        throw new Error(reason);
    });
};
var wxp = {};
var _loop_1 = function (key) {
    if (Object.prototype.hasOwnProperty.call(wx, key)) {
        var noPromise = noPromiseMethods.includes(key) ||
            key.startsWith('on') ||
            /\w+Sync$/.test(key) ||
            typeof wx[key] !== 'function';
        if (!noPromise) {
            wxp[key] = function (obj) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var params = obj || {};
                return new Promise(function (resolve, reject) {
                    params.success = resolve;
                    params.fail = reject;
                    wx[key].apply(wx, [params].concat(args));
                });
            };
        }
        else if (typeof wx[key] === 'function') {
            wxp[key] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return wx[key].apply(wx, args);
            };
        }
        else {
            wxp[key] = wx[key];
        }
    }
};
for (var key in wx) {
    _loop_1(key);
}
Object.defineProperties(wxp, {
    httpRequest: {
        configurable: false,
        enumerable: true,
        get: function () {
            return httpRequest;
        }
    },
    nav: {
        configurable: false,
        enumerable: true,
        get: function () {
            return nav;
        }
    }
});
Object.defineProperties(wx, {
    httpRequest: {
        configurable: false,
        enumerable: true,
        get: function () {
            return httpRequest;
        }
    },
    nav: {
        configurable: false,
        enumerable: true,
        get: function () {
            return nav;
        }
    }
});
export default wxp;
