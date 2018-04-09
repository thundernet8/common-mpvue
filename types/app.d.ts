import * as internal from './internal';

interface AppMethods {
    /**
     * 获取系统信息，包含设备信息 网络类型状态 SDK版本等
     */
    getSystemInfo(): Promise<any>;

    /**
     * 获取当前页面
     */
    getPage(): internal.Page;

    /**
     * 获取当前页面路径
     */
    getPageRoute(): string;

    /**
     * 获取当前页面路径包含query参数
     */
    getPageLink(): string;

    /**
     * 获取本地缓存的openid
     */
    getOpenId(): string;

    /**
     * 设置并缓存openId
     * @param openId
     */
    setOpenId(openId: string): void;

    /**
     * 获取本地缓存的unionid
     */
    getUnionId(): string;

    /**
     * 设置并缓存unionId
     * @param unionId
     */
    setUnionId(unionId: string): void;

    /**
     * 获取本地缓存的token
     */
    getToken(): string;

    /**
     *
     * @param token 设置并缓存token
     */
    setToken(token: string): void;

    /**
     * 获取本地缓存的微信用户信息
     */
    getWxUserInfo(): any;

    /**
     * 设置并缓存微信用户信息
     * @param info
     */
    setWxUserInfo(info): void;

    /**
     * 登出，清理token，storage数据以及重置vue store状态
     */
    logout(): void;

    [key: string]: any;
}

interface App extends AppMethods {
    /**
     * mpvue实例化小程序提供的globalData
     */
    globalData: internal.GlobalData;

    env: string;

    name: string;

    dev: boolean;

    debug: boolean;

    version: string;

    utils: internal.Utils;

    logger: internal.Logger;

    emitter: internal.Emitter;

    nav: internal.Navigator;

    /**
     * 全局的可持久化store，用于存放token openid等用户信息
     */
    store: internal.PersistStore<internal.GlobalStoreState>;
}

export default App;
