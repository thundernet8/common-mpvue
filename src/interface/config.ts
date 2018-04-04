export interface BaseConfig {
    name: string;
    version: string;
    pkgName: string;
    env?: 'production' | 'development';
}

export interface AppConfig extends BaseConfig {
    domain?: string;
    lxDomain?: string;
    catDomain?: string;
    // 是否启用cat监控
    owl?: boolean;
}

export interface RequestConfig extends BaseConfig {
    domain: string;
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
