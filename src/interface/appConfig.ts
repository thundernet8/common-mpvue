export default interface AppConfig {
    name: string;
    version: string;
    pkgName?: string;
    env?: 'production' | 'development';
    domain?: string;
    lxDomain?: string;
    catDomain?: string;
    // 是否启用cat监控
    owl?: boolean;
}
