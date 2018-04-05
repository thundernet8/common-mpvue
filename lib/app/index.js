import Vue from 'mpvue';
import PersistStore from '../store';
import vendor from '../vendor';
import md5 from 'md5';
import { globalStoreOptions, VuexStore } from '../store';
import methods from './methods';
import Logger from '../logger';
import * as utils from '../utils';
import Emitter from '../emitter';
import GeoManager from '../geo';
import { httpRequest } from '../request';
import { app as owlapp, page, Owl } from '@hfe/mp-owl';
import Navigator from '../nav';
var singleton = {};
/**
 * 封装和扩展小程序app实例以及wx
 * @param App 入口的Vue组件
 * @param config app配置
 * @param props 给app实例扩展更多的方法或属性
 */
export default function wrap(App, config, props) {
    if (!config.name || !config.version || !config.pkgName) {
        throw new Error('必须提供name,version,pkgName配置项');
    }
    if (!config.env) {
        config.env = process.env.NODE_ENV || 'production';
    }
    if (!config.lxDomain) {
        config.lxDomain = 'https://report.meituan.com';
    }
    if (!config.catDomain) {
        config.catDomain = 'https://catfront.dianping.com/api/log?v=1';
    }
    httpRequest.configAll(config);
    // 启动小程序
    App.mpType = 'app';
    var app = new Vue(App);
    app.$mount();
    var wxapp = getApp();
    if (!wxapp) {
        throw new Error('小程序App尚未实例化');
    }
    var isProduct = config.env && config.env.startsWith('pro');
    // 实例化一些工具
    singleton.logger = new Logger().configAll(config);
    singleton.emitter = new Emitter();
    singleton.geo = new GeoManager().configAll(config);
    var storeKey = md5(config.pkgName || config.name) + "_global_state";
    singleton.store = new PersistStore(storeKey, globalStoreOptions);
    singleton.nav = new Navigator();
    // vendor补充
    if (config.owl) {
        var owlConfig_1 = {
            project: config.pkgName,
            unionId: methods.getUnionId.call(wxapp) || methods.getOpenId.call(wxapp),
            env: isProduct ? 'pro' : 'dev',
            wxAppVersion: config.version // 小程序发布版本
        };
        vendor.owl = new Owl(owlConfig_1);
        global.App = owlapp;
        global.Page = page;
        singleton.store.subscribe(function (mutation, state) {
            if (mutation.type === 'updateOpenId' || mutation.type === 'updateUnionId') {
                var uuid = state.unionId || state.openId;
                owlConfig_1.unionId = uuid;
                vendor.owl = new Owl(owlConfig_1);
            }
        });
    }
    // 扩展app实例方法
    Object.defineProperties(wxapp, {
        __config: {
            configurable: false,
            enumerable: false,
            get: function () {
                return config;
            }
        },
        config: {
            configurable: false,
            enumerable: false,
            get: function () {
                return function (key, value) {
                    if (value === undefined) {
                        return this.__config[key];
                    }
                    else {
                        this.__config[key] = value;
                    }
                };
            }
        },
        env: {
            configurable: false,
            enumerable: false,
            get: function () {
                return this.__config.env;
            }
        },
        name: {
            configurable: false,
            enumerable: false,
            get: function () {
                return this.__config.name;
            }
        },
        dev: {
            // TODO区分dev和debug
            configurable: false,
            enumerable: false,
            get: function () {
                return !isProduct;
            }
        },
        debug: {
            configurable: false,
            enumerable: false,
            get: function () {
                return !isProduct;
            }
        },
        version: {
            configurable: false,
            enumerable: false,
            get: function () {
                return this.__config.version;
            }
        },
        vendor: {
            configurable: false,
            enumerable: false,
            get: function () {
                return vendor;
            }
        },
        utils: {
            configurable: false,
            enumerable: false,
            get: function () {
                return utils;
            }
        },
        logger: {
            configurable: false,
            enumerable: false,
            get: function () {
                return singleton.logger;
            }
        },
        emitter: {
            configurable: false,
            enumerable: false,
            get: function () {
                return singleton.emitter;
            }
        },
        geo: {
            configurable: false,
            enumerable: false,
            get: function () {
                return singleton.geo;
            }
        },
        nav: {
            configurable: false,
            enumerable: false,
            get: function () {
                return singleton.nav;
            }
        },
        store: {
            configurable: false,
            enumerable: false,
            get: function () {
                return singleton.store;
            }
        }
    });
    var allProps = Object.assign({}, methods, props || {});
    Object.keys(allProps).forEach(function (key) {
        Object.defineProperty(wxapp, key, {
            configurable: false,
            enumerable: false,
            get: function () {
                if (typeof allProps[key] === 'function') {
                    return allProps[key].bind(wxapp);
                }
                return allProps[key];
            }
        });
    });
}
/**
 * 扩展页面实例的属性和方法
 * @param Page page的Vue组件
 * @param storeOptions Vue Store选项
 */
var WrapPage = /** @class */ (function () {
    function WrapPage(Page, storeOptions) {
        this.page = null;
        Page.mpType = 'page';
        this.page = new Vue(Page);
        this.page.$mount();
        var name = this.page.$options.name;
        if (!name) {
            throw new Error('请为页面Vue组件配置独一无二的name');
        }
        if (!WrapPage.store) {
            WrapPage.store = new VuexStore({
                state: function () {
                    return {};
                }
            });
        }
        if (storeOptions) {
            WrapPage.store.registerModule(name, storeOptions);
            this.page.$store = WrapPage.store;
        }
    }
    return WrapPage;
}());
export { WrapPage };
