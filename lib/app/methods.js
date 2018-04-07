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
    getPageRoute: function () {
        return this.getPage().route;
    },
    getPageLink: function () {
        var _a = this.getPage(), options = _a.options, route = _a.route;
        return route + "?" + Object.keys(options)
            .map(function (key) { return key + "=" + options[key]; })
            .join('&');
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
