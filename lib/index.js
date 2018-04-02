import _Request from './request';
import _PersistStore from './store';
import _wxp from './wxp';
/**
 * 封装和扩展小程序app实例以及wx
 * @param app 入口的Vue实例
 */
export function wrap(app) {
    console.log(app);
}
/**
 * 请求类
 */
export const Request = _Request;
/**
 * Promise化的wx API
 */
export const wxp = _wxp;
/**
 * 可持久化至小程序storage的vuex store
 */
export const PersistStore = _PersistStore;
