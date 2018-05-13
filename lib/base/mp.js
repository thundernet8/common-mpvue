import polyfill from '../web/polyfill';
var mp = polyfill();
export default {
    wx: mp.wx || wx,
    getApp: mp.getApp || getApp,
    getCurrentPages: mp.getCurrentPages || getCurrentPages
};
