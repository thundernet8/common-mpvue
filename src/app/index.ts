import Vue from 'mpvue';
import PersistStore from '../store';
import md5 from 'md5';
import { globalStoreOptions, VuexStore } from '../store';
import methods from './methods';
import Logger from '../logger';
import * as utils from '../utils';
import Emitter from '../emitter';
import { httpRequest } from '../request';
import { AppConfig } from '../../types/config';
import { StoreOptions } from 'vuex/types/index';
import Navigator from '../nav';
import { BaseKV } from '../../types/general';

const singleton: any = {};

/**
 * 封装和扩展小程序app实例以及wx
 * @param App 入口的Vue组件
 * @param config app配置
 * @param props 给app实例扩展更多的方法或属性
 */
export default function wrap(App, config: AppConfig, props?: BaseKV) {
    if (!config.name || !config.version || !config.pkgName) {
        throw new Error('必须提供name,version,pkgName配置项');
    }

    if (!config.env) {
        config.env = process.env.NODE_ENV || ('production' as any);
    }

    if (!config.reportDomain) {
        console.warn('未设置信息上报域名，app.logger将不会上报任何信息');
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
    const storeKey = `${md5(config.pkgName || config.name)}_global_state`;
    singleton.store = new PersistStore(storeKey, globalStoreOptions);
    singleton.nav = new Navigator().configAll(config);

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
            enumerable: true,
            get: function() {
                if (typeof allProps[key] === 'function') {
                    return allProps[key].bind(wxapp);
                }
                return allProps[key];
            }
        });
    });

    // 添加$app引用至vue实例
    Object.defineProperty(app, '$app', {
        configurable: false,
        enumerable: true,
        get() {
            return wxapp;
        }
    });

    // 添加一个onLaunched生命周期调用，此时getApp已可以使用
    const { onLaunched } = app.$options;
    if (typeof onLaunched === 'function') {
        onLaunched();
    }
}

/**
 * 扩展页面实例的属性和方法
 * @param Page page的Vue组件
 * @param storeOptions Vue Store选项
 */

export class WrapPage<S> {
    static store: VuexStore<any>;

    page: Vue = null;

    constructor(Page, storeOptions?: StoreOptions<S>) {
        Page.mpType = 'page';
        this.page = new Vue(Page);
        this.page!.$mount();

        const name = this.page!.$options.name;
        if (!name) {
            throw new Error('请为页面Vue组件配置独一无二的name');
        }
        if (!WrapPage.store) {
            WrapPage.store = new VuexStore<any>({
                state() {
                    return {};
                }
            });
        }

        if (storeOptions) {
            WrapPage.store.registerModule(name, storeOptions);
            this.page!.$store = WrapPage.store;
        }

        // 添加$app引用至vue实例
        Object.defineProperty(this.page, '$app', {
            configurable: false,
            enumerable: true,
            get() {
                return getApp();
            }
        });
    }
}
