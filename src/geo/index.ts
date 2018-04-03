import Configurable from '../base/configurable';
import { GeoConfig } from '../interface/config';
import wxp from '../wxp';

// 编辑自@dp/sparrow
export default class GeoManager extends Configurable {
    static CACHE_CITY = ['city', 'loccity'];
    static CACHE_LOCATION = 'geo';

    _config: GeoConfig;

    _data: { [key: string]: any } = {};

    constructor(config?: GeoConfig) {
        super();
        if (config) {
            this.configAll(config);
        }
    }

    get _fullConfig() {
        const defaultConfig = {
            locateCityApi: '/wxmapi/city/locatecity',
            domain: 'https://m.dianping.com'
        };

        return Object.assign({}, defaultConfig, this._config);
    }

    getLocation() {
        return wxp
            .getLocation({
                type: 'wgs84'
            })
            .then(res => {
                if (!(res && res.latitude && res.longitude)) {
                    throw new Error('获取定位信息失败');
                }
                let location = {
                    latitude: res.latitude,
                    longitude: res.longitude
                };
                this.setLocation(location);
                return location;
            })
            .catch(err => {
                console.log('[Geo Fail]===>', err);
                throw {
                    code: 102,
                    msg: '定位失败'
                };
            });
    }

    getLocationSync() {
        return this._data.location;
    }

    getLocationInfoSync() {
        return this._data.locationInfo;
    }

    /**
     * 获取定位,失败不reject
     */
    getLocationNoReject() {
        return this.getLocation().catch(() => {
            return;
        });
    }

    /**
     * 强制获取定位,失败则开启授权定位弹窗
     */
    getLocationForce() {
        return this.getLocation().catch(() => {
            wxp
                .showModal({
                    content: '检测到你还没打开地理位置权限，是否去开启？'
                })
                .then(({ confirm }) => {
                    if (confirm) {
                        wxp.openSetting().then(
                            data => {
                                if (data.authSetting['scope.userLocation']) {
                                    return {
                                        code: 200,
                                        msg: `获取用户位置权限成功`
                                    };
                                } else {
                                    return {
                                        code: 103,
                                        msg: `用户仍然没有授权地理位置`
                                    };
                                }
                            },
                            () => {
                                throw {
                                    code: 103,
                                    msg: `打开授权页面失败`
                                };
                            }
                        );
                    } else {
                        return {
                            code: 103,
                            msg: '用户拒绝地理位置授权'
                        };
                    }
                });
        });
    }

    /**
     * 读取定位缓存
     */
    getLocationCache() {
        const app = getApp();
        const locationInfo = app.getLocationInfoCache();
        if (locationInfo && locationInfo.location) {
            this.setLocation(locationInfo.location, {
                noCache: true,
                lastModify: locationInfo.lastModify
            });
            return Promise.resolve(locationInfo.location);
        } else {
            return Promise.resolve();
        }
    }

    getLocationCacheSync() {
        const app = getApp();
        const locationInfo = app.getLocationInfoCache();
        if (locationInfo && locationInfo.location) {
            this.setLocation(locationInfo.location, {
                noCache: true,
                lastModify: locationInfo.lastModify
            });
            return locationInfo.location;
        } else {
            return;
        }
    }

    setLocation(location, opts: any = {}) {
        let locationInfo = {
            lastModify: opts.lastModify || new Date().getTime(),
            location
        };
        this._data.location = location;
        this._data.locationInfo = locationInfo;
        if (!opts.noCache) {
            getApp().setLocationInfoCache(locationInfo);
        }
    }

    getLocCity(location?) {
        if (location) {
            return this._fetchLocCity(location);
        } else {
            return this.getLocation()
                .then(loc => this._fetchLocCity(loc))
                .catch(() => this._fetchLocCity());
        }
    }

    getLocCitySync() {
        return this._data.locCity;
    }

    getLocCityInfoSync() {
        return this._data.locCityInfo;
    }

    setLocCity(locCity, opts: any = {}) {
        if (!locCity) {
            return;
        }
        let isCityValid = this._checkCity(locCity);
        if (isCityValid) {
            opts = opts || {};
            opts.isDefault = false;
            opts.isGeo = true;
            let locCityInfo = {
                lastModify: opts.lastModify || +new Date(),
                city: locCity
            };
            this._data.locCity = locCity;
            this._data.locCityInfo = locCityInfo;

            if (!opts.noCache) {
                this._setCityCache(locCityInfo, opts);
            }
        } else {
            console.log('setLocCity失败');
        }
    }

    getCity() {
        // 若有缓存的选择城市信息，直接返回缓存
        if (this._data.city && this._data.city.cityId) {
            return Promise.resolve(this._data.city);
        } else {
            return this.getLocCity()
                .then(locCity => {
                    if (locCity) {
                        this.setCity(locCity, { isDefault: true });
                        return locCity;
                    } else {
                        let city = this._getDefaultCity();
                        this.setCity(city);
                        return city;
                    }
                })
                .catch(() => {
                    let city = this._getDefaultCity();
                    this.setCity(city);
                    return city;
                });
        }
    }

    getCitySync() {
        return this._data.city;
    }

    getCityInfoSync() {
        return this._data.cityInfo;
    }

    setCity(city, opts: any = {}) {
        const app = getApp();

        if (!city) {
            return;
        }
        let isCityValid = this._checkCity(city);
        if (isCityValid) {
            try {
                if (!(this._data.city && city.cityId === this._data.city.cityId)) {
                    app.emitter.emit('cityChange', city);
                }
            } catch (e) {}

            opts = opts || {};
            opts.isGeo = false;

            this._data.city = city;

            let cityInfo = {
                lastModify: opts.lastModify || +new Date(),
                city: city
            };
            this._data.cityInfo = cityInfo;

            if (!opts.noCache) {
                this._setCityCache(cityInfo, opts);
            }
        } else {
            console.log('setCity失败');
        }
    }

    getCityCache() {
        return this._getCityCache(GeoManager.CACHE_CITY[0]);
    }
    getCityCacheSync() {
        return this._getCityCacheSync(GeoManager.CACHE_CITY[0]);
    }

    getLocCityCache() {
        return this._getCityCache(GeoManager.CACHE_CITY[1]);
    }

    getLocCityCacheSync() {
        return this._getCityCacheSync(GeoManager.CACHE_CITY[1]);
    }

    _getCityCache(key) {
        return Promise.resolve(this._getCityCacheSync(key));
    }

    _getCityCacheSync(key) {
        const app = getApp();
        if (!GeoManager.CACHE_CITY.includes(key)) {
            return;
        }

        let info;

        if (key === GeoManager.CACHE_CITY[0]) {
            info = app.getCityInfoCache();
            if (info && info.city) {
                this.setCity(info.city, {
                    noCache: true,
                    lastModify: info.lastModify
                });
            }
        } else {
            info = app.getLocCityInfoCache();
            if (info && info.city) {
                this.setLocCity(info.city, {
                    noCache: true,
                    lastModify: info.lastModify
                });
            }
        }

        return info && info.city;
    }

    _checkCity(cityInfo) {
        return cityInfo && cityInfo.cityId !== undefined && cityInfo.cityName !== undefined;
    }

    _setCityCache(info, opts) {
        const app = getApp();

        if (!info) {
            return;
        }
        opts = opts || {};

        if (opts.isDefault) {
            info.lastModify = 0;
        }

        let key = opts.isGeo ? GeoManager.CACHE_CITY[1] : GeoManager.CACHE_CITY[0];
        if (GeoManager.CACHE_CITY[0] === key) {
            app.setCityInfoCache(info);
        } else if (GeoManager.CACHE_CITY[1] === key) {
            app.setLocCityInfoCache(info);
        }
    }

    /**
     * 设置默认城市为北京
     */
    _getDefaultCity() {
        return {
            cityId: 2,
            cityName: '北京',
            isOverseaCity: false
        };
    }

    /**
     * 获取定位城市数据
     */
    _fetchLocCity(location?) {
        let params;
        if (location) {
            params = {
                lat: location.latitude,
                lng: location.longitude
            };
        } else {
            params = {};
        }
        return wxp.httpRequest
            .httpGet(`${this.config('domain')}${this.config('locateCityApi')}`, params)
            .then(res => {
                if (
                    res &&
                    res.statusCode === 200 &&
                    res.data.code === 200 &&
                    res.data.cityInfo &&
                    res.data.cityInfo.cityId
                ) {
                    this.setLocCity(res.data.cityInfo);
                    return res.data.cityInfo;
                } else {
                    if (this._data.locCity && this._data.locCity.cityId) {
                        return this._data.locCity;
                    } else {
                        throw {
                            code: 103,
                            msg: '定位城市服务出错',
                            err: res
                        };
                    }
                }
            })
            .catch(err => {
                throw {
                    code: 103,
                    msg: '定位城市出错',
                    err: err
                };
            });
    }
}
