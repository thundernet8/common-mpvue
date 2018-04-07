import { Store, StoreOptions } from 'vuex/types/index';
import { BaseKV } from './general';
import { NavConfig, RequestConfig, AppConfig, LXConfig } from './config';
import { NavBarStyleOptions, RequestOptions } from './option';

export interface Request extends ChainableRequest {
    new (config?: RequestConfig): Request;

    /**
     * 发起GET请求
     * @param url
     * @param params
     * @param opts
     */
    httpGet(url: string, params?: BaseKV, opts?: RequestOptions): Promise<any>;

    /**
     * 发起JSON形式的POST请求
     * @param url
     * @param data
     * @param opts
     */
    httpJsonPost(url: string, data?: BaseKV, opts?: RequestOptions): Promise<any>;

    /**
     * 发起FORM表单形式的POST请求
     * @param url
     * @param data
     * @param opts
     */
    httpFormPost(url: string, data?: BaseKV, opts?: RequestOptions): Promise<any>;

    /**
     * 发起POST请求，默认是FORM表单形式
     * @param url
     * @param data
     * @param opts
     */
    httpPost(url: string, data?: BaseKV, opts?: RequestOptions): Promise<any>;
}

interface ShadowRequest extends ChainableRequest {
    /**
     * 发起GET请求
     * @param url
     * @param params
     */
    GET(url: string, params?: BaseKV): Promise<any>;

    /**
     * 发起POST请求
     * @param url
     * @param data
     */
    POST(url: string, data?: BaseKV): Promise<any>;
}

interface ChainableRequest {
    /**
     * 发起http请求
     * @param req
     * @param opts
     */
    request(req: BaseKV, opts?: RequestOptions): Promise<any>;

    /**
     * 配置请求为mapi
     */
    mapi(): ShadowRequest;

    /**
     * 配置请求为custom api
     */
    custom(): ShadowRequest;

    /**
     * 配置请求为携带凭据，默认true
     * @param auth
     */
    auth(auth?: boolean): ShadowRequest;

    /**
     * 配置请求凭据的键值
     * @param key
     */
    tokenKey(key: string): ShadowRequest;

    /**
     * 配置请求通过cookie携带凭据
     */
    cookieToken(): ShadowRequest;

    /**
     * 配置请求为通过url参数携带凭据
     */
    qsToken(): ShadowRequest;

    /**
     * 配置请求如果POST则形式为application/x-www-form-urlencoded
     */
    form(): ShadowRequest;
}

export interface GlobalStoreState {
    token: string;
    openId: string;
    unionId: string;
    wxUserInfo: any;
    [key: string]: any;
}

export interface PersistStore<S> extends VuexStore<S> {
    /**
     * Store实例的名称，同时也作为持久化至小程序storage的key，请确保唯一
     */
    new (name, options: StoreOptions<S>): PersistStore<S>;
}

export interface VuexStore<S> extends Store<S> {
    /**
     * 重置Store的状态至初始传入的状态
     */
    reset(): void;
}

export interface Utils {
    /**
     * 简单的格式化日期函数
     * @param format
     * @param date
     */
    getFormatTime(format: string, date?: Date): string;

    /**
     * 给指定的url添加query参数
     * @param url
     * @param query
     */
    addUrlQuery(url: string, query: BaseKV): string;

    /**
     * 解析url中的query为对象
     * @param url
     */
    parseUrlQuery(url: string): BaseKV;

    /**
     * 合并对象并去除值为undefined的项目
     * @param args
     */
    pureAssign(...args: BaseKV[]): BaseKV;
}

export interface Emitter {
    new (): Emitter;

    /**
     * 触发事件
     * @param name
     * @param args
     */
    emit(name: string, ...args: BaseKV[]): boolean;

    /**
     * 添加事件监听
     * @param name
     * @param listener
     */
    on(name: string, listener: Function): Emitter;

    /**
     * 添加一次性事件监听
     * @param name
     * @param listener
     */
    once(name: string, listener: Function): Emitter;

    /**
     * 移除事件监听
     * @param name
     * @param listener
     */
    off(name: string, listener: Function): Emitter;

    /**
     * 移除指定事件的全部监听
     * @param name
     */
    offAll(name: string): Emitter;
}

export interface Geo {}

export interface Navigator {
    new (config?: NavConfig): Navigator;

    /**
     * 跳转并控制页面栈数量，支持http链接
     * @param url
     * @param query
     */
    navigateTo(url, query?: BaseKV): void;

    /**
     * 跳转至H5页面，并设置webview导航条的样式
     * @param url
     * @param query
     * @param navBarOptions
     */
    navigateToH5(url, query?: BaseKV, navBarOptions?: NavBarStyleOptions);
}

/**
 * 灵犀打点
 */
export interface LX {
    start(): void;

    quit(): void;

    init(domain: string, config: LXConfig): void;

    set(key: string, value: any): void;

    moduleClick(moduleId: string): void;

    pageView(pageId: string): void;
}

/**
 * Cat监控
 */
export interface OWL {}

export interface Vendor {
    /**
     * 灵犀打点
     */
    lx: LX;

    /**
     * Cat监控
     */
    owl: OWL;
}

export interface Logger {
    log(...args): void;

    error(...args): void;

    warn(...args): void;

    info(...args): void;
}

interface Page {
    route: string;
    options: BaseKV;
}
