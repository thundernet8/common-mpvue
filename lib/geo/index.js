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
import Configurable from '../base/configurable';
import wxp from '../wxp';
// 编辑自@dp/sparrow
var GeoManager = /** @class */ (function (_super) {
    __extends(GeoManager, _super);
    function GeoManager(config) {
        var _this = _super.call(this) || this;
        _this._data = {};
        if (config) {
            _this.configAll(config);
        }
        return _this;
    }
    Object.defineProperty(GeoManager.prototype, "_fullConfig", {
        get: function () {
            var defaultConfig = {
                locateCityApi: '/wxmapi/city/locatecity',
                domain: 'https://m.dianping.com'
            };
            return Object.assign({}, defaultConfig, this._config);
        },
        enumerable: true,
        configurable: true
    });
    GeoManager.prototype.getLocation = function () {
        var _this = this;
        return wxp
            .getLocation({
            type: 'wgs84'
        })
            .then(function (res) {
            if (!(res && res.latitude && res.longitude)) {
                throw new Error('获取定位信息失败');
            }
            var location = {
                latitude: res.latitude,
                longitude: res.longitude
            };
            _this.setLocation(location);
            return location;
        })
            .catch(function (err) {
            console.log('[Geo Fail]===>', err);
            throw {
                code: 102,
                msg: '定位失败'
            };
        });
    };
    GeoManager.prototype.getLocationSync = function () {
        return this._data.location;
    };
    GeoManager.prototype.getLocationInfoSync = function () {
        return this._data.locationInfo;
    };
    /**
     * 获取定位,失败不reject
     */
    GeoManager.prototype.getLocationNoReject = function () {
        return this.getLocation().catch(function () {
            return;
        });
    };
    /**
     * 强制获取定位,失败则开启授权定位弹窗
     */
    GeoManager.prototype.getLocationForce = function () {
        return this.getLocation().catch(function () {
            wxp
                .showModal({
                content: '检测到你还没打开地理位置权限，是否去开启？'
            })
                .then(function (_a) {
                var confirm = _a.confirm;
                if (confirm) {
                    wxp.openSetting().then(function (data) {
                        if (data.authSetting['scope.userLocation']) {
                            return {
                                code: 200,
                                msg: "\u83B7\u53D6\u7528\u6237\u4F4D\u7F6E\u6743\u9650\u6210\u529F"
                            };
                        }
                        else {
                            return {
                                code: 103,
                                msg: "\u7528\u6237\u4ECD\u7136\u6CA1\u6709\u6388\u6743\u5730\u7406\u4F4D\u7F6E"
                            };
                        }
                    }, function () {
                        throw {
                            code: 103,
                            msg: "\u6253\u5F00\u6388\u6743\u9875\u9762\u5931\u8D25"
                        };
                    });
                }
                else {
                    return {
                        code: 103,
                        msg: '用户拒绝地理位置授权'
                    };
                }
            });
        });
    };
    /**
     * 读取定位缓存
     */
    GeoManager.prototype.getLocationCache = function () {
        var app = getApp();
        var locationInfo = app.getLocationInfoCache();
        if (locationInfo && locationInfo.location) {
            this.setLocation(locationInfo.location, {
                noCache: true,
                lastModify: locationInfo.lastModify
            });
            return Promise.resolve(locationInfo.location);
        }
        else {
            return Promise.resolve();
        }
    };
    GeoManager.prototype.getLocationCacheSync = function () {
        var app = getApp();
        var locationInfo = app.getLocationInfoCache();
        if (locationInfo && locationInfo.location) {
            this.setLocation(locationInfo.location, {
                noCache: true,
                lastModify: locationInfo.lastModify
            });
            return locationInfo.location;
        }
        else {
            return;
        }
    };
    GeoManager.prototype.setLocation = function (location, opts) {
        if (opts === void 0) { opts = {}; }
        var locationInfo = {
            lastModify: opts.lastModify || new Date().getTime(),
            location: location
        };
        this._data.location = location;
        this._data.locationInfo = locationInfo;
        if (!opts.noCache) {
            getApp().setLocationInfoCache(locationInfo);
        }
    };
    GeoManager.prototype.getLocCity = function (location) {
        var _this = this;
        if (location) {
            return this._fetchLocCity(location);
        }
        else {
            return this.getLocation()
                .then(function (loc) { return _this._fetchLocCity(loc); })
                .catch(function () { return _this._fetchLocCity(); });
        }
    };
    GeoManager.prototype.getLocCitySync = function () {
        return this._data.locCity;
    };
    GeoManager.prototype.getLocCityInfoSync = function () {
        return this._data.locCityInfo;
    };
    GeoManager.prototype.setLocCity = function (locCity, opts) {
        if (opts === void 0) { opts = {}; }
        if (!locCity) {
            return;
        }
        var isCityValid = this._checkCity(locCity);
        if (isCityValid) {
            opts = opts || {};
            opts.isDefault = false;
            opts.isGeo = true;
            var locCityInfo = {
                lastModify: opts.lastModify || +new Date(),
                city: locCity
            };
            this._data.locCity = locCity;
            this._data.locCityInfo = locCityInfo;
            if (!opts.noCache) {
                this._setCityCache(locCityInfo, opts);
            }
        }
        else {
            console.log('setLocCity失败');
        }
    };
    GeoManager.prototype.getCity = function () {
        var _this = this;
        // 若有缓存的选择城市信息，直接返回缓存
        if (this._data.city && this._data.city.cityId) {
            return Promise.resolve(this._data.city);
        }
        else {
            return this.getLocCity()
                .then(function (locCity) {
                if (locCity) {
                    _this.setCity(locCity, { isDefault: true });
                    return locCity;
                }
                else {
                    var city = _this._getDefaultCity();
                    _this.setCity(city);
                    return city;
                }
            })
                .catch(function () {
                var city = _this._getDefaultCity();
                _this.setCity(city);
                return city;
            });
        }
    };
    GeoManager.prototype.getCitySync = function () {
        return this._data.city;
    };
    GeoManager.prototype.getCityInfoSync = function () {
        return this._data.cityInfo;
    };
    GeoManager.prototype.setCity = function (city, opts) {
        if (opts === void 0) { opts = {}; }
        var app = getApp();
        if (!city) {
            return;
        }
        var isCityValid = this._checkCity(city);
        if (isCityValid) {
            try {
                if (!(this._data.city && city.cityId === this._data.city.cityId)) {
                    app.emitter.emit('cityChange', city);
                }
            }
            catch (e) { }
            opts = opts || {};
            opts.isGeo = false;
            this._data.city = city;
            var cityInfo = {
                lastModify: opts.lastModify || +new Date(),
                city: city
            };
            this._data.cityInfo = cityInfo;
            if (!opts.noCache) {
                this._setCityCache(cityInfo, opts);
            }
        }
        else {
            console.log('setCity失败');
        }
    };
    GeoManager.prototype.getCityCache = function () {
        return this._getCityCache(GeoManager.CACHE_CITY[0]);
    };
    GeoManager.prototype.getCityCacheSync = function () {
        return this._getCityCacheSync(GeoManager.CACHE_CITY[0]);
    };
    GeoManager.prototype.getLocCityCache = function () {
        return this._getCityCache(GeoManager.CACHE_CITY[1]);
    };
    GeoManager.prototype.getLocCityCacheSync = function () {
        return this._getCityCacheSync(GeoManager.CACHE_CITY[1]);
    };
    GeoManager.prototype._getCityCache = function (key) {
        return Promise.resolve(this._getCityCacheSync(key));
    };
    GeoManager.prototype._getCityCacheSync = function (key) {
        var app = getApp();
        if (!GeoManager.CACHE_CITY.includes(key)) {
            return;
        }
        var info;
        if (key === GeoManager.CACHE_CITY[0]) {
            info = app.getCityInfoCache();
            if (info && info.city) {
                this.setCity(info.city, {
                    noCache: true,
                    lastModify: info.lastModify
                });
            }
        }
        else {
            info = app.getLocCityInfoCache();
            if (info && info.city) {
                this.setLocCity(info.city, {
                    noCache: true,
                    lastModify: info.lastModify
                });
            }
        }
        return info && info.city;
    };
    GeoManager.prototype._checkCity = function (cityInfo) {
        return cityInfo && cityInfo.cityId !== undefined && cityInfo.cityName !== undefined;
    };
    GeoManager.prototype._setCityCache = function (info, opts) {
        var app = getApp();
        if (!info) {
            return;
        }
        opts = opts || {};
        if (opts.isDefault) {
            info.lastModify = 0;
        }
        var key = opts.isGeo ? GeoManager.CACHE_CITY[1] : GeoManager.CACHE_CITY[0];
        if (GeoManager.CACHE_CITY[0] === key) {
            app.setCityInfoCache(info);
        }
        else if (GeoManager.CACHE_CITY[1] === key) {
            app.setLocCityInfoCache(info);
        }
    };
    /**
     * 设置默认城市为北京
     */
    GeoManager.prototype._getDefaultCity = function () {
        return {
            cityId: 2,
            cityName: '北京',
            isOverseaCity: false
        };
    };
    /**
     * 获取定位城市数据
     */
    GeoManager.prototype._fetchLocCity = function (location) {
        var _this = this;
        var params;
        if (location) {
            params = {
                lat: location.latitude,
                lng: location.longitude
            };
        }
        else {
            params = {};
        }
        return wxp.httpRequest
            .httpGet("" + this.config('domain') + this.config('locateCityApi'), params)
            .then(function (res) {
            if (res &&
                res.statusCode === 200 &&
                res.data.code === 200 &&
                res.data.cityInfo &&
                res.data.cityInfo.cityId) {
                _this.setLocCity(res.data.cityInfo);
                return res.data.cityInfo;
            }
            else {
                if (_this._data.locCity && _this._data.locCity.cityId) {
                    return _this._data.locCity;
                }
                else {
                    throw {
                        code: 103,
                        msg: '定位城市服务出错',
                        err: res
                    };
                }
            }
        })
            .catch(function (err) {
            throw {
                code: 103,
                msg: '定位城市出错',
                err: err
            };
        });
    };
    GeoManager.CACHE_CITY = ['city', 'loccity'];
    GeoManager.CACHE_LOCATION = 'geo';
    return GeoManager;
}(Configurable));
export default GeoManager;
