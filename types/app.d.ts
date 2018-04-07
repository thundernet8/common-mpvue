import * as internal from './internal';

interface App {
    env: string;

    name: string;

    dev: boolean;

    debug: boolean;

    version: string;

    vendor: internal.Vendor;

    utils: internal.Utils;

    logger: internal.Logger;

    emitter: internal.Emitter;

    geo: internal.Geo;

    nav: internal.Navigator;

    store: internal.PersistStore<internal.GlobalStoreState>;
}

export default App;
