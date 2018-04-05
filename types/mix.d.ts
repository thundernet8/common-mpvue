// import { BaseKV } from './general';
// import _wx from './wx';
// import _app from './app';

declare var wx;

declare function getApp();

declare function getCurrentPages();

declare namespace NodeJS {
    interface Global {
        App;
        Page;
        getApp;
    }
}

interface Promise<T> {
    finally: (callback) => Promise<T>;
}
