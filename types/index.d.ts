import { StoreOptions, Store } from 'vuex/types/index';
import { BaseKV } from './general';
import { NavConfig, RequestConfig, AppConfig } from './config';
import { NavBarStyleOptions, RequestOptions } from './option';
import WX from './wx';
import APP from './app';
import WXP from './wxp';
import * as internal from './internal';

export as namespace WXAPPCommon;

export = WXAPPCommon;

declare namespace WXAPPCommon {
    /**
     * 全局的wx对象
     */
    export var wx: WX;

    /**
     * 获取当前小程序实例
     */
    export function getApp(): APP;

    /**
     * 获取当前页面栈
     */
    export function getCurrentPages(): internal.Page[];

    /**
     * 封装和扩展小程序app实例以及wx
     */
    export function wrap(App, config: AppConfig, props?: BaseKV);

    export class WrapPage<S> {
        constructor(Page, storeOptions?: StoreOptions<S>);
    }

    /**
     * 请求类
     */
    export class Request extends internal.Request {}

    /**
     * Promise化的wx API
     */
    export var wxp: WXP;

    /**
     * 可持久化至小程序storage的vuex store
     */
    export class PersistStore<S> extends VuexStore<S> implements internal.PersistStore<S> {
        /**
         * @param name Store实例的名称，同时也作为持久化至小程序storage的key，请确保唯一
         * @param options Vue Store实例化选项
         */
        constructor(name: string, options: StoreOptions<S>);
    }

    export class VuexStore<S> extends Store<S> implements internal.VuexStore<S> {
        reset(): void;
    }

    /**
     * 实用工具函数
     */
    export interface Utils extends internal.Utils {}

    /**
     * EventEmitter
     */
    export class Emitter extends internal.Emitter {}

    /**
     * Navigator
     */
    export class Navigator extends internal.Navigator {}
}
