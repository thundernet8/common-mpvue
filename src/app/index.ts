import PersistStore from '../store';
import vendor from '../vendor';
import md5 from 'md5';
import { globalStoreOptions } from '../store';
import methods from './methods';
import Logger from '../logger';
import * as utils from '../utils';
import Emitter from '../emitter';
import GeoManager from '../geo';
import { httpRequest } from '../request';
import { app, page, Owl } from '@hfe/mp-owl';
import AppConfig from '../interface/appConfig';

const singleton: any = {};

/**
 * 封装和扩展小程序app实例以及wx
 * @param _app 入口的Vue实例
 * @param config app配置
 */
export default function wrap(_app, config: AppConfig) {
    const wxapp = getApp();
    if (!wxapp) {
        throw new Error('小程序App尚未实例化');
    }

    if (!config.name || !config.version) {
        throw new Error('必须提供name和version配置项');
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

    const isProduct = config.env && config.env.startsWith('pro');

    // 实例化一些工具
    singleton.logger = new Logger().configAll(config);
    singleton.emitter = new Emitter();
    singleton.geo = new GeoManager().configAll(config);
    const storeKey = md5(`${config.pkgName || config.name}_global_state`);
    singleton.store = new PersistStore(storeKey, globalStoreOptions);

    // vendor补充
    if (config.owl) {
        const owlConfig = {
            project: config.pkgName, // 申请project http://cat.dp/cat/s/frontend?op=projectAdd
            unionId: methods.getUnionId.call(wxapp) || methods.getOpenId.call(wxapp), // 用户的唯一标识，可选，可传 openId或unionId,如果不传，cat SDK 会自动生成一个，作为用户唯一标识，但是用户删除小程序后，会丢失
            env: isProduct ? 'pro' : 'dev', // 当前环境，默认为 pro，当 env 为 dev 时不上报任何信息
            wxAppVersion: config.version // 小程序发布版本
        };
        vendor.owl = new Owl(owlConfig);
        global.App = app;
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
        store: {
            configurable: false,
            enumerable: false,
            get: function() {
                return singleton.store;
            }
        }
    });

    Object.keys(methods).forEach(key => {
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

    httpRequest.configAll(config);
}
