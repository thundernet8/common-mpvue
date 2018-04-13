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

    /**
     * 工程环境，例如development/production
     */
    env: string;

    /**
     * 小程序的名称
     */
    name: string;

    /**
     * 是否开发模式
     */
    dev: boolean;

    /**
     * 是否调试模式，调试模式包含开发模式以及指定开启debug的生产模式
     */
    debug: boolean;

    /**
     * 小程序版本
     */
    version: string;

    /**
     * 一些实用工具方法
     */
    utils: internal.Utils;

    /**
     * 简单的日志记录，开发走console，生产可配置上报服务器
     */
    logger: internal.Logger;

    /**
     * 订阅/发布器，用于跨页面通信
     */
    emitter: internal.Emitter;

    /**
     * 小程序内导航优化方法等
     */
    nav: internal.Navigator;

    /**
     * 全局的可持久化store，用于存放token openid等用户信息
     */
    store: internal.PersistStore<internal.GlobalStoreState>;
}

export default App;
