import * as _utils from './utils';
import mp from './base/mp';
export var wx = mp.wx;
export var getApp = mp.getApp;
export var getCurrentPages = mp.getCurrentPages;
/**
 * 封装和扩展小程序app实例以及wx
 */
export { default as wrap, WrapPage } from './app';
/**
 * 请求类
 */
export { default as Request } from './request';
/**
 * Promise化的wx API
 */
export { default as wxp } from './wxp';
/**
 * 可持久化至小程序storage的vuex store
 */
export { default as PersistStore, VuexStore } from './store';
/**
 * 实用工具函数
 */
export var Utils = _utils;
/**
 * EventEmitter
 */
export { default as Emitter } from './emitter';
/**
 * Geo
 */
export { default as Geo } from './geo';
/**
 * Navigator
 */
export { default as Navigator } from './nav';
