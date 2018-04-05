import { StoreOptions } from 'vuex/types/index';
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

    export interface WrapPage<S> {
        new (Page, storeOptions?: StoreOptions<S>): WrapPage<S>;
    }

    /**
     * 请求类
     */
    export interface Request extends internal.Request {}

    /**
     * Promise化的wx API
     */
    export var wxp: WXP;

    /**
     * 可持久化至小程序storage的vuex store
     */
    export interface PersistStore<S> extends internal.PersistStore<S> {}

    export interface VuexStore<S> extends internal.VuexStore<S> {}

    /**
     * 实用工具函数
     */
    export interface Utils extends internal.Utils {}

    /**
     * EventEmitter
     */
    export interface Emitter extends internal.Emitter {}

    /**
     * Geo
     */
    export interface Geo extends internal.Geo {}

    /**
     * Navigator
     */
    export interface Navigator extends internal.Navigator {}
}
