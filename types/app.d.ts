import * as internal from './internal';

interface App {
    env: string;

    name: string;

    dev: boolean;

    debug: boolean;

    version: string;

    utils: internal.Utils;

    logger: internal.Logger;

    emitter: internal.Emitter;

    nav: internal.Navigator;

    store: internal.PersistStore<internal.GlobalStoreState>;
}

export default App;
