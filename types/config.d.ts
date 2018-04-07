export interface BaseConfig {
    name: string;
    version: string;
    pkgName: string;
    env?: 'production' | 'development';
}

export interface AppConfig extends BaseConfig {
    domain?: string;
    reportDomain?: string;
    webviewSchema?: string;
}

export interface RequestConfig extends BaseConfig {
    domain: string;
}

export interface NavConfig extends BaseConfig {
    pageLimit?: number;
    webviewSchema?: string;
    appId: string;
}
