import { httpRequest } from '../request';
import nav from '../nav';
import polyfill from '../web/polyfill';

const mp = polyfill();

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
            if (reason instanceof Error) {
                throw reason;
            } else if (typeof reason === 'string') {
                throw new Error(reason);
            } else if (reason && reason.errMsg) {
                throw new Error(reason.errMsg);
            }
            throw reason;
        }
    );
};

const _wx = mp.wx || wx;
const wxp: any = {};

for (const key in _wx) {
    if (Object.prototype.hasOwnProperty.call(_wx, key)) {
        const noPromise =
            noPromiseMethods.includes(key) ||
            key.startsWith('on') ||
            /\w+Sync$/.test(key) ||
            typeof _wx[key] !== 'function';

        if (!noPromise) {
            wxp[key] = function(obj, ...args) {
                const params = obj || {};
                return new Promise((resolve, reject) => {
                    params.success = resolve;
                    params.fail = reject;
                    wx[key](params, ...args);
                });
            };
        } else if (typeof _wx[key] === 'function') {
            wxp[key] = function(...args) {
                return _wx[key](...args);
            };
        } else {
            wxp[key] = _wx[key];
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

Object.defineProperties(_wx, {
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
