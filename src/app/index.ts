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
import { AppConfig } from '../interface/config';
import { StoreOptions } from 'vuex/types/index';
import Navigator from '../nav';

const singleton: any = {};

/**
 * 封装和扩展小程序app实例以及wx
 * @param App 入口的Vue组件
 * @param config app配置
 * @param props 给app实例扩展更多的方法或属性
 */
export default function wrap(App, config: AppConfig, props?: { [key: string]: any }) {
    if (!config.name || !config.version || !config.pkgName) {
        throw new Error('必须提供name,version,pkgName配置项');
    }

    if (!config.env) {
        config.env = process.env.NODE_ENV || ('production' as any);
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
    const app = new Vue(App);
    app.$mount();

    const wxapp = getApp();
    if (!wxapp) {
        throw new Error('小程序App尚未实例化');
    }

    const isProduct = config.env && config.env.startsWith('pro');

    // 实例化一些工具
    singleton.logger = new Logger().configAll(config);
    singleton.emitter = new Emitter();
    singleton.geo = new GeoManager().configAll(config);
    const storeKey = `${md5(config.pkgName || config.name)}_global_state`;
    singleton.store = new PersistStore(storeKey, globalStoreOptions);
    singleton.nav = new Navigator();

    // vendor补充
    if (config.owl) {
        const owlConfig = {
            project: config.pkgName, // 申请project http://cat.dp/cat/s/frontend?op=projectAdd
            unionId: methods.getUnionId.call(wxapp) || methods.getOpenId.call(wxapp), // 用户的唯一标识，可选，可传 openId或unionId,如果不传，cat SDK 会自动生成一个，作为用户唯一标识，但是用户删除小程序后，会丢失
            env: isProduct ? 'pro' : 'dev', // 当前环境，默认为 pro，当 env 为 dev 时不上报任何信息
            wxAppVersion: config.version // 小程序发布版本
        };
        vendor.owl = new Owl(owlConfig);
        global.App = owlapp;
        global.Page = page;
        singleton.store.subscribe((mutation, state) => {
            if (mutation.type === 'updateOpenId' || mutation.type === 'updateUnionId') {
                const uuid = state.unionId || state.openId;
                owlConfig.unionId = uuid;
                vendor.owl = new Owl(owlConfig);
            }
        });
    }

    // 扩展app实例方法
    Object.defineProperties(wxapp, {
        __config: {
            configurable: false,
            enumerable: false,
            get: function() {
                return config;
            }
        },
        config: {
            configurable: false,
            enumerable: false,
            get: function() {
                return function(key, value) {
                    if (value === undefined) {
                        return this.__config[key];
                    } else {
                        this.__config[key] = value;
                    }
                };
            }
        },
        env: {
            configurable: false,
            enumerable: false,
            get: function() {
                return this.__config.env;
            }
        },
        name: {
            configurable: false,
            enumerable: false,
            get: function() {
                return this.__config.name;
            }
        },
        dev: {
            // TODO区分dev和debug
            configurable: false,
            enumerable: false,
            get: function() {
                return !isProduct;
            }
        },
        debug: {
            configurable: false,
            enumerable: false,
            get: function() {
                return !isProduct;
            }
        },
        version: {
            configurable: false,
            enumerable: false,
            get: function() {
                return this.__config.version;
            }
        },
        vendor: {
            configurable: false,
            enumerable: false,
            get: function() {
                return vendor;
            }
        },
        utils: {
            configurable: false,
            enumerable: false,
            get: function() {
                return utils;
            }
        },
        logger: {
            configurable: false,
            enumerable: false,
            get: function() {
                return singleton.logger;
            }
        },
        emitter: {
            configurable: false,
            enumerable: false,
            get: function() {
                return singleton.emitter;
            }
        },
        geo: {
            configurable: false,
            enumerable: false,
            get: function() {
                return singleton.geo;
            }
        },
        nav: {
            configurable: false,
            enumerable: false,
            get: function() {
                return singleton.nav;
            }
        },
        store: {
            configurable: false,
            enumerable: false,
            get: function() {
                return singleton.store;
            }
        }
    });

    const allProps = Object.assign({}, methods, props || {});

    Object.keys(allProps).forEach(key => {
        Object.defineProperty(wxapp, key, {
            configurable: false,
            enumerable: false,
            get: function() {
                if (typeof methods[key] === 'function') {
                    return methods[key].bind(wxapp);
                }
                return methods[key];
            }
        });
    });
}

/**
 * 扩展页面实例的属性和方法
 * @param Page page的Vue组件
 * @param storeOptions Vue Store选项
 */
let store: VuexStore<any>;

export function wrapPage<S>(Page, storeOptions?: StoreOptions<S>) {
    Page.mpType = 'page';
    const app = new Vue(Page);
    app.$mount();

    const name = app.$options.name;
    if (!name) {
        throw new Error('请为页面Vue组件配置独一无二的name');
    }
    if (!store) {
        store = new VuexStore<any>({
            state() {
                return {};
            }
        });
    }

    if (storeOptions) {
        store.registerModule(name, storeOptions);
        app.$store = store;
    }
}
