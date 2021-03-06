import Vue from 'mpvue';
import Vuex from 'vuex';
import { StoreOptions, Module, ModuleOptions } from 'vuex/types/index';
import { syncStateToStoragePlugin } from './plugin';

Vue.use(Vuex);

export class VuexStore<S> extends Vuex.Store<S> {
    _options: any = {};

    _registeredModules: { path: string | string[]; module; options?: ModuleOptions }[] = [];

    constructor(options: StoreOptions<S>) {
        super(options);
        this._options = options;
    }

    registerModule<T>(path: string | string[], module: Module<T, S>, options?: ModuleOptions) {
        this._registeredModules.push({
            path,
            module,
            options
        });
        super.registerModule(path as any, module, options);
    }

    reset() {
        let { state } = this._options;
        if (typeof state === 'function') {
            state = state();
        }
        this.replaceState({ ...(state || {}) });
        this._registeredModules.forEach(({ path, module, options }) => {
            this.registerModule(path, module, options);
        });
    }
}

export default class PersistStore<S> extends VuexStore<S> {
    static names: string[] = [];

    name: string;

    constructor(name, options: StoreOptions<S>) {
        if (PersistStore.names.includes(name)) {
            throw new Error(`请不要重复创建相同名称的store - [${name}]`);
        }

        const { state, plugins, ...rest } = options;

        // 从storage中恢复状态
        const localState = JSON.parse(wx.getStorageSync(name) || '{}');

        let initialState: S = {} as any;
        if (typeof state === 'function') {
            const func: Function = state as any;
            initialState = func();
        } else {
            initialState = state!;
        }

        const newState = Object.assign(Object.create(null), initialState, localState);
        const newPlugins = new Array(0).concat(plugins || [], [syncStateToStoragePlugin(name)]);

        const newOptions = Object.assign(
            {
                strict: process.env.NODE_ENV !== 'production',
                state: newState,
                plugins: newPlugins
            },
            rest
        );

        super(newOptions);

        this.name = name;
    }
}

// TODO https://vuex.vuejs.org/zh-cn/modules.html#%E6%A8%A1%E5%9D%97%E5%8A%A8%E6%80%81%E6%B3%A8%E5%86%8C
export const globalStoreOptions = {
    state() {
        return {
            token: '',
            openId: '',
            unionId: '',
            wxUserInfo: null
        };
    },
    mutations: {
        // Token
        updateToken(state, token) {
            state.token = token;
        },
        // openid
        updateOpenId(state, openId) {
            state.openId = openId;
        },
        // unionId
        updateUnionId(state, unionId) {
            state.unionId = unionId;
        },
        // 保存微信用户信息 头像 昵称等
        updateWxUserInfo(state, wxUserInfo) {
            state.wxUserInfo = wxUserInfo;
        }
    }
};
