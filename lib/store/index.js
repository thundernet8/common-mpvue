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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import Vue from 'mpvue';
import Vuex from 'vuex';
import { syncStateToStoragePlugin } from './plugin';
Vue.use(Vuex);
var VuexStore = /** @class */ (function (_super) {
    __extends(VuexStore, _super);
    function VuexStore(options) {
        var _this = _super.call(this, options) || this;
        _this._options = {};
        _this._registeredModules = [];
        _this._options = options;
        return _this;
    }
    VuexStore.prototype.registerModule = function (path, module, options) {
        this._registeredModules.push({
            path: path,
            module: module,
            options: options
        });
        _super.prototype.registerModule.call(this, path, module, options);
    };
    VuexStore.prototype.reset = function () {
        var _this = this;
        var state = this._options.state;
        if (typeof state === 'function') {
            state = state();
        }
        this.replaceState(__assign({}, (state || {})));
        this._registeredModules.forEach(function (_a) {
            var path = _a.path, module = _a.module, options = _a.options;
            _this.registerModule(path, module, options);
        });
    };
    return VuexStore;
}(Vuex.Store));
export { VuexStore };
var PersistStore = /** @class */ (function (_super) {
    __extends(PersistStore, _super);
    function PersistStore(name, options) {
        var _this = this;
        if (PersistStore.names.includes(name)) {
            throw new Error("\u8BF7\u4E0D\u8981\u91CD\u590D\u521B\u5EFA\u76F8\u540C\u540D\u79F0\u7684store - [" + name + "]");
        }
        var state = options.state, plugins = options.plugins, rest = __rest(options, ["state", "plugins"]);
        // 从storage中恢复状态
        var localState = JSON.parse(wx.getStorageSync(name) || '{}');
        var initialState = {};
        if (typeof state === 'function') {
            var func = state;
            initialState = func();
        }
        else {
            initialState = state;
        }
        var newState = Object.assign(Object.create(null), initialState, localState);
        var newPlugins = new Array(0).concat(plugins || [], [syncStateToStoragePlugin(name)]);
        var newOptions = Object.assign({
            strict: process.env.NODE_ENV !== 'production',
            state: newState,
            plugins: newPlugins
        }, rest);
        _this = _super.call(this, newOptions) || this;
        _this.name = name;
        return _this;
    }
    PersistStore.names = [];
    return PersistStore;
}(VuexStore));
export default PersistStore;
// TODO https://vuex.vuejs.org/zh-cn/modules.html#%E6%A8%A1%E5%9D%97%E5%8A%A8%E6%80%81%E6%B3%A8%E5%86%8C
export var globalStoreOptions = {
    state: function () {
        return {
            token: '',
            openId: '',
            unionId: '',
            wxUserInfo: null
        };
    },
    mutations: {
        // Token
        updateToken: function (state, token) {
            state.token = token;
        },
        // openid
        updateOpenId: function (state, openId) {
            state.openId = openId;
        },
        // unionId
        updateUnionId: function (state, unionId) {
            state.unionId = unionId;
        },
        // 保存微信用户信息 头像 昵称等
        updateWxUserInfo: function (state, wxUserInfo) {
            state.wxUserInfo = wxUserInfo;
        }
    }
};
