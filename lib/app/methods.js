export default {
    getSystemInfo: function () {
        var sysInfo = wx.getSystemInfoSync() || {};
        if (sysInfo.model) {
            if (sysInfo.model.indexOf('iPhone X') !== -1) {
                sysInfo.isIpx = true;
            }
        }
        return wx
            .getNetworkType()
            .then(function (res) {
            sysInfo.networkType = res.networkType;
            return sysInfo;
        })
            .catch(function () {
            return sysInfo;
        });
        // TODO cache
    },
    getPage: function () {
        var pages = getCurrentPages();
        if (!pages || pages.length < 1) {
            return null;
        }
        return pages[pages.length - 1];
    },
    getOpenId: function () {
        return this.store.state.openId || '';
    },
    setOpenId: function (openId) {
        this.store.commit('updateOpenId', openId);
    },
    getUnionId: function () {
        return this.store.state.unionId || '';
    },
    setUnionId: function (unionId) {
        this.store.commit('updateUnionId', unionId);
    },
    getToken: function () {
        return this.store.state.token || '';
    },
    setToken: function (token) {
        this.store.commit('updateToken', token);
    },
    getWxUserInfo: function () {
        return this.store.state.wxUserInfo || '';
    },
    setWxUserInfo: function (info) {
        this.store.commit('updateWxUserInfo', info);
    },
    getLocationInfoCache: function () {
        return this.store.state.locationInfo;
    },
    setLocationInfoCache: function (info) {
        this.store.commit('updateLocationInfo', info);
    },
    getCityInfoCache: function () {
        return this.store.state.cityInfo;
    },
    setCityInfoCache: function (info) {
        this.store.commit('updateCityInfo', info);
    },
    getLocCityInfoCache: function () {
        return this.store.state.locCityInfo;
    },
    setLocCityInfoCache: function (info) {
        this.store.commit('updateLocCityInfo', info);
    },
    logout: function () {
        this.store.reset();
        this.setToken('');
        return new Promise(function (resolve, reject) {
            try {
                wx.clearStorageSync();
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    }
};
