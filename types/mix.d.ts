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
