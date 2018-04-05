import { httpRequest } from '../request';
import nav from '../nav';

const noPromiseMethods = [
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

Promise.prototype.finally = function(finaliser) {
    return this.then(
        result => {
            finaliser();
            return result;
        },
        reason => {
            finaliser();
            throw new Error(reason);
        }
    );
};

const wxp: any = {};

for (const key in wx) {
    if (Object.prototype.hasOwnProperty.call(wx, key)) {
        const noPromise =
            noPromiseMethods.includes(key) ||
            key.startsWith('on') ||
            /\w+Sync$/.test(key) ||
            typeof wx[key] !== 'function';

        if (!noPromise) {
            wxp[key] = function(obj, ...args) {
                const params = obj || {};
                return new Promise((resolve, reject) => {
                    params.success = resolve;
                    params.fail = reject;
                    wx[key](params, ...args);
                });
            };
        } else if (typeof wx[key] === 'function') {
            wxp[key] = function(...args) {
                return wx[key](...args);
            };
        } else {
            wxp[key] = wx[key];
        }
    }
}

Object.defineProperties(wxp, {
    httpRequest: {
        configurable: false,
        enumerable: true,
        get: function() {
            return httpRequest;
        }
    },
    nav: {
        configurable: false,
        enumerable: true,
        get: function() {
            return nav;
        }
    }
});

Object.defineProperties(wx, {
    httpRequest: {
        configurable: false,
        enumerable: true,
        get: function() {
            return httpRequest;
        }
    },
    nav: {
        configurable: false,
        enumerable: true,
        get: function() {
            return nav;
        }
    }
});

export default wxp;
