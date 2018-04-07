export interface BaseConfig {
    name: string;
    version: string;
    pkgName: string;
    env?: 'production' | 'development';
}

export interface AppConfig extends BaseConfig {
    domain?: string;
    mapiDomain?: string;
    lxDomain?: string;
    category?: string;
    catDomain?: string;
    // 是否启用cat监控
    owl?: boolean;
    webviewSchema?: string;
}

export interface RequestConfig extends BaseConfig {
    domain: string;
    mapiDomain: string;
}

export interface GeoConfig extends BaseConfig {
    domain?: string;
    locateCityApi?: string;
}

export interface NavConfig extends BaseConfig {
    pageLimit?: number;
    webviewSchema?: string;
    appId: string;
}

export interface LXConfig {
    // app 名称
    appnm: string;
    // 分类
    category: string;
}