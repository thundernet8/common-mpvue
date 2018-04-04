import Configurable from '../base/configurable';
import { getFormatTime } from '../utils';

export default class Logger extends Configurable {
    _cache: any[] = [];

    push(msg) {
        this._cache.push(msg);
        this.report();
    }

    report() {
        if (!this.config('url')) {
            console.warn('Cat Logger上报url未设置, 请使用app.logger.config("url", "地址")设置');
            return;
        }
        wx.request({
            method: 'POST',
            url: this.config('url'),
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: `c=${encodeURIComponent(JSON.stringify(this._cache))}`
        });
    }

    _log(type, ...args) {
        const sysInfo = getApp().getSystemInfo();
        if (sysInfo.platform === 'devtools') {
            console.log(`[${getFormatTime()} ${String.prototype.toUpperCase.call(type)}]`, ...args);
        } else {
            if (args.length < 1) {
                return;
            }
            const msg = args
                .filter(arg => arg !== undefined)
                .reduce((previous, current) => {
                    return previous.concat(
                        typeof current === 'string' ? [current] : [JSON.stringify(current)]
                    );
                }, [])
                .join(' ');
            if (msg.length > 2048) {
                console.warn('Log不建议传输多于2048字节的信息');
            }

            const app = getApp();

            this.push({
                project: app.pkgName || app.name,
                pageUrl: `${app.pkgName || app.name}:${app.getPage().route || 'app'}`,
                category: 'jsError',
                timestamp: +new Date(),
                level: type,
                content: msg
            });
        }
    }
}
