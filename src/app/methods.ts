export default {
    getSystemInfo() {
        const sysInfo = wx.getSystemInfoSync() || {};
        if (sysInfo.model) {
            if (sysInfo.model.indexOf('iPhone X') !== -1) {
                sysInfo.isIpx = true;
            }
        }

        return wx
            .getNetworkType()
            .then(res => {
                sysInfo.networkType = res.networkType;
                return sysInfo;
            })
            .catch(() => {
                return sysInfo;
            });

        // TODO cache
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

    getLocationInfoCache() {
        return this.store.state.locationInfo;
    },

    setLocationInfoCache(info) {
        this.store.commit('updateLocationInfo', info);
    },

    getCityInfoCache() {
        return this.store.state.cityInfo;
    },

    setCityInfoCache(info) {
        this.store.commit('updateCityInfo', info);
    },

    getLocCityInfoCache() {
        return this.store.state.locCityInfo;
    },

    setLocCityInfoCache(info) {
        this.store.commit('updateLocCityInfo', info);
    },

    logout() {
        this.store.reset();
        this.setToken('');
        return wx.clearStorage();
    }
};
