export default {
    getSystemInfo() {
        const sysInfo = wx.getSystemInfoSync() || {};
        if (sysInfo.model) {
            if (sysInfo.model.indexOf('iPhone X') !== -1) {
                sysInfo.isIpx = true;
            }
        }

        // TODO networkType
        // TODO cache
        return Promise.resolve(sysInfo);
    },

    getPage() {
        const pages = getCurrentPages();
        if (!pages || pages.length < 1) {
            return null;
        }
        return pages[pages.length - 1];
    },

    getOpenId() {
        return this.store.state.openId || '';
    },

    setOpenId(openId) {
        this.store.commit('updateOpenId', openId);
    },

    getUnionId() {
        return this.store.state.unionId || '';
    },

    setUnionId(unionId) {
        this.store.commit('updateUnionId', unionId);
    },

    getToken() {
        return this.store.state.token || '';
    },

    setToken(token) {
        this.store.commit('updateToken', token);
    },

    getWxUserInfo() {
        return this.store.state.wxUserInfo || '';
    },

    setWxUserInfo(info) {
        this.store.commit('updateWxUserInfo', info);
    },

    logout() {
        this.setToken('');
        // TODO clear storage and vuex store
    }
};
