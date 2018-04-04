import Configurable from '../base/configurable';
import { NavConfig } from '../interface/config';
import wxp from '../wxp';

export default class Navigator extends Configurable {
    protected _config: NavConfig;

    constructor(config?: NavConfig) {
        super();
        if (config) {
            this.configAll(config);
        }
    }

    /**
     * 跳转并控制页面栈数量
     * @param url
     */
    navigateTo(url) {
        const pageLen = getCurrentPages().length;
        const maxLen = Math.min(10, this.config('pageLimit'));
        if (pageLen >= maxLen) {
            return wxp.redirectTo({
                url
            });
        } else {
            return wxp.navigateTo({
                url
            });
        }
    }
}
