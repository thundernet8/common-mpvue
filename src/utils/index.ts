import padL from 'left-pad';
import URL from 'url-parse';
import qs from 'querystring';

export function getFormatTime(format = 'yyyy/MM/dd HH:ii:ss') {
    const date = new Date();

    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let hours = date.getHours();

    format = format.replace('MM', padL(month.toString(), 2, '0'));

    if (format.indexOf('yyyy') > -1) {
        format = format.replace('yyyy', year.toString());
    } else if (format.indexOf('yy') > -1) {
        format = format.replace('yy', year.toString().substr(2, 2));
    }

    format = format.replace('dd', padL(date.getDate().toString(), 2, '0'));

    if (format.indexOf('t') > -1) {
        format = format.replace('t', hours > 11 ? 'pm' : 'am');
    }
    if (format.indexOf('HH') > -1) {
        format = format.replace('HH', padL(hours.toString(), 2, '0'));
    }
    if (format.indexOf('hh') > -1) {
        if (hours > 12) {
            hours -= 12;
        }
        if (hours === 0) {
            hours = 12;
        }
        format = format.replace('hh', padL(hours.toString(), 2, '0'));
    }
    if (format.indexOf('mm') > -1) {
        format = format.replace('mm', padL(date.getMinutes().toString(), 2, '0'));
    }
    if (format.indexOf('ss') > -1) {
        format = format.replace('ss', padL(date.getSeconds().toString(), 2, '0'));
    }
    return format;
}

/**
 * 给指定url添加query参数
 * @param {String} url
 * @param {Object} query 键值对
 */
export function addUrlQuery(url, query) {
    const urlObj = new URL(url);
    const existQuery = qs.parse(urlObj.query ? urlObj.query.slice(1) : '');
    const newQuery = Object.assign({}, existQuery, query);
    urlObj.set('query', newQuery);
    return /^https?:\/\//i.test(url) ? urlObj.href : urlObj.href.slice(urlObj.origin.length);
}

/**
 * 解析url的query
 * @param url
 */
export function parseUrlQuery(url) {
    const urlObj = new URL(url);
    return qs.parse(urlObj.query ? urlObj.query.slice(1) : '');
}

/**
 * 去除对象合并中的undefined项目
 * @param args
 */
export function pureAssign(...args) {
    const ret = {};
    const len = args.length;

    for (let i = 0; i < len; i++) {
        const obj = args[i];
        for (const key in obj) {
            if (obj[key] !== undefined) {
                ret[key] = obj[key];
            }
        }
    }
    return ret;
}

export default {
    getFormatTime,
    addUrlQuery
};
