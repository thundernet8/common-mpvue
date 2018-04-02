export default class PersistStore {
}
import Vue from 'vue';
import Vuex from 'vuex';
import { syncStateToStoragePlugin } from './plugin';
Vue.use(Vuex);
const storageName = '_global_state';
// 从storage中恢复状态
const state = JSON.parse(wx.getStorageSync(storageName) || '{}');
export const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: Object.assign(Object.create(null), {
        wxUserInfo: null
    }, state),
    mutations: {
        // B端账号登录Token
        updateToken(state, token) {
            state.token = token;
        },
        // 加密后的openid
        updateOpenId(state, eoid) {
            state.eoid = eoid;
        },
        // 加密后的unionId
        updateUnionId(state, euid) {
            state.euid = euid;
        },
        // 保存微信用户信息 头像 昵称等
        updateWxUserInfo(state, wxUserInfo) {
            state.wxUserInfo = wxUserInfo;
        }
    },
    plugins: [syncStateToStoragePlugin(storageName)]
});
