## lx init

```js
{
        onShow() {
        // app 启动
        lx.start();
    },
    onHide() {
        // app 离开
        lx.quit();
    },

    onLaunched() {
        // onLaunch生命周期内，getApp仍不可用，不能使用app的实例方法
        lx.init(config.LXDOMAIN, {
            appnm: config.APP_NAME,
            category: config.CATEGORY
        });
        //全局取一次cityId
        // getApp().getCityId();
        getApp().init();
    }
}
```
