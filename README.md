## MPVue 开发小程序的通用能力封装

### Promisify 的 wx API

```js
import { wxp } from 'common-mpvue';

wxp.request({ ...config }).then(resp => {
    // do something
});
```

### 可持久化至小程序 storage 的 VueStore

```js
import { PersistStore } from 'common-mpvue';

const store = new PersistStore({
    ...storeOptions
});
```

### Emitter

方便不同页面间通信，为保证同一个 emitter 实例，请通过`getApp().emitter`获取这个绑定在 app 下的 emitter 实例

```js
const app = getApp();

// 添加监听
app.emitter.on('event1', function() {});

// 添加一次性监听
app.emitter.once('event1', function() {});

// 移除监听
app.emitter.off('event1', listener);

// 移除全部监听
app.emitter.offAll('event1');
```

### Navigator

解决了页面栈过大时无法跳转的问题，自动使用`redirectTo`替代`navigateTo`

```js
const app = new App();

app.nav.navigateTo('/pages/index/index', { param1: '1' });

app.nav.navigateToH5('https://example.com');
```

### Utilities

提供少量的实用方法

```js
const app = getApp();

// 给url添加query参数
app.utils.addUrlQuery('/pages/index/index', { param1: '1' });

// 解析url的query为对象
app.utils.parseUrlQuery('/pages/index/index?param1=1');
```

### Request

提供了封装的 Request 对象，适度的请求队列管理，建议使用`wx.httpRequest`或`wxp.httpRequest`

```js
wx.httpRequest.httpGet('https://example.com', { param1: '1' });

// json形式post
wx.httpRequest.httpJsonPost('https://example.com', { data1: '1' }, { ...requestOptions });

// form表单形式post
wx.httpRequest.httpFormPost('https://example.com', { data1: '1' }, { ...requestOptions });

// httpPost等同httpFormPost
wx.httpRequest.httpPost('https://example.com', { data1: '1' }, { ...requestOptions });
```

为了减少重复填写配置，可以重新实例化一个有固定配置的请求实例

```js
// 配置请求携带token并以cookie形式传递
const httpRequest = wx.httpRequest
    .auth()
    .cookieToken()
    .form();

httpRequest.GET('https://example.com');

httpRequest.POST('https://example.com', { data1: '1' });
```

目前支持如下配置链

*   auth - 携带 token 用于鉴权，auth(true)
*   tokenKey - 携带 token 的 key，tokenKey('key')
*   cookieToken - 通过 cookie 携带 token
*   qsToken - 通过 url query 携带 token
*   form - 通过 form 表单形式 post
*   custom - 携带自定义 header 头，包含设备信息等

## 说明

为了将这些能力引入到 app,wx,wxp 等对象上，需要按如下操作：

### 入口 main.js

```js
import { wrap } from 'common-mpvue';
import App from './index.vue';

wrap(App);
```

### 页面 main.js

```js
import { WrapPage } from 'common-mpvue';
import Page from './index.vue';

new WrapPage(Page);

// 或者为页面添加vuex store
new WrapPage(Page, {
    state() {
        name: '';
    },
    mutations: {
        updateName(state, name) {
            state.name = name;
        }
    }
});
```

在页面的 vue 单文件组件内，可以通过`this.$app`访问小程序 app 实例，可以通过`this.$store`访问共享的业务 vuex store，可以通过`this.$state`访问该页面的状态模块
