import Vuex from 'vuex';
import { syncStateToStoragePlugin } from './plugin';

export default class PersistStore extends Vuex.Store<any> {
    static names: string[] = [];

    constructor(name, options) {
        if (PersistStore.names.includes(name)) {
            throw new Error(`请不要重复创建相同名称的store - [${name}]`);
        }

        const { state, plugins, ...rest } = options;

        // 从storage中恢复状态
        const localState = JSON.parse(wx.getStorageSync(name) || '{}');

        const newState = Object.assign(Object.create(null), localState, state || {});
        const newPlugins = [].concat(plugins || [], [syncStateToStoragePlugin(name)] as any);

        const newOptions = Object.assign(
            {
                strict: process.env.NODE_ENV !== 'production',
                state: newState,
                plugins: newPlugins
            },
            rest
        );

        super(newOptions);
    }
}
