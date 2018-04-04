var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import Vuex from 'vuex';
import { syncStateToStoragePlugin } from './plugin';
export class VuexStore extends Vuex.Store {
    constructor(options) {
        super(options);
        this._options = {};
        this._options = options;
    }
    reset() {
        const { state } = this._options;
        this.replaceState(Object.assign({}, (state || {})));
    }
}
export default class PersistStore extends VuexStore {
    constructor(name, options) {
        if (PersistStore.names.includes(name)) {
            throw new Error(`请不要重复创建相同名称的store - [${name}]`);
        }
        const { state, plugins } = options, rest = __rest(options, ["state", "plugins"]);
        // 从storage中恢复状态
        const localState = JSON.parse(wx.getStorageSync(name) || '{}');
        const newState = Object.assign(Object.create(null), localState, state || {});
        const newPlugins = new Array(0).concat(plugins || [], [syncStateToStoragePlugin(name)]);
        const newOptions = Object.assign({
            strict: process.env.NODE_ENV !== 'production',
            state: newState,
            plugins: newPlugins
        }, rest);
        super(newOptions);
    }
}
PersistStore.names = [];
// TODO https://vuex.vuejs.org/zh-cn/modules.html#%E6%A8%A1%E5%9D%97%E5%8A%A8%E6%80%81%E6%B3%A8%E5%86%8C
export const globalStoreOptions = {
    state() {
        return {
            token: '',
            openId: '',
            unionId: '',
            wxUserInfo: null,
            locationInfo: null,
            cityInfo: null,
            locCityInfo: null
        };
    },
    mutations: {
        // Token
        updateToken(state, token) {
            state.token = token;
        },
        // openid
        updateOpenId(state, openId) {
            state.openId = openId;
        },
        // unionId
        updateUnionId(state, unionId) {
            state.unionId = unionId;
        },
        // 保存微信用户信息 头像 昵称等
        updateWxUserInfo(state, wxUserInfo) {
            state.wxUserInfo = wxUserInfo;
        },
        // 保存定位信息
        updateLocationInfo(state, locationInfo) {
            state.locationInfo = locationInfo;
        },
        // 保存城市信息
        updateCityInfo(state, cityInfo) {
            state.cityInfo = cityInfo;
        },
        // 保存定位城市信息
        updateLocCityInfo(state, locCityInfo) {
            state.locCityInfo = locCityInfo;
        }
    }
};
