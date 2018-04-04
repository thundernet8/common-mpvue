export as namespace WXAPPCommon;

export = WXAPPCommon;

declare namespace WXAPPCommon {
    /**
     * 封装和扩展小程序app实例以及wx
     */
    export interface wrap {}

    export interface wrapPage {}

    /**
     * 请求类
     */
    export interface Request {}

    /**
     * Promise化的wx API
     */
    export interface wxp {}

    /**
     * 可持久化至小程序storage的vuex store
     */
    export interface PersistStore {}

    export interface VuexStore {}

    /**
     * 实用工具函数
     */
    export interface Utils {}

    /**
     * EventEmitter
     */
    export interface Emitter {}

    /**
     * Geo
     */
    export interface Geo {}

    /**
     * Navigator
     */
    export interface Navigator {}
}
