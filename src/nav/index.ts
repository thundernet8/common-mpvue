import Configurable from '../base/configurable';
import { NavConfig } from '../../types/config';
import { NavBarStyleOptions } from '../../types/option';
import { BaseKV } from '../../types/general';
import { addUrlQuery } from '../utils';
import wxp from '../wxp';

export default class Navigator extends Configurable {
    protected _config: NavConfig;

    private get _WEBVIEW_PAGE() {
        return this.config('webviewSchema') || '/pages/webview/webview';
    }

    constructor(config?: NavConfig) {
        super();
        if (config) {
            this.configAll(config);
        }
    }

    /**
     * 跳转并控制页面栈数量
     * @param url
     * @param query
     */
    navigateTo(url, query: BaseKV = {}) {
        let fullUrl = url;
        if (/^https?/i.test(fullUrl)) {
            // 跳webview
            fullUrl = addUrlQuery(this._WEBVIEW_PAGE, {
                url: encodeURIComponent(fullUrl),
                ...query
            });
        } else {
            fullUrl = addUrlQuery(url, query);
        }
        const pageLen = getCurrentPages().length;
        const maxLen = Math.min(10, this.config('pageLimit'));
        if (pageLen >= maxLen) {
            return wxp.redirectTo({
                url: fullUrl
            });
        } else {
            return wxp.navigateTo({
                url: fullUrl
            });
        }
    }

    navigateToH5(url, query: BaseKV = {}, navBarOptions: NavBarStyleOptions = {}) {
        if (!/^https?/i.test(url)) {
            throw new Error(`不合法的H5地址:${url}`);
        }
        const { title, frontColor, backgroundColor } = navBarOptions;
        if (title) {
            query.wx_title = title;
        }
        if (frontColor) {
            query.wx_front_color = frontColor;
        }
        if (backgroundColor) {
            query.wx_bg_color = backgroundColor;
        }
        return this.navigateTo(url, query);
    }
}
