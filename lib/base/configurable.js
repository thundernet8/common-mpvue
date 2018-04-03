export default class Configurable {
    constructor() {
        this._config = {};
    }
    config(key, value) {
        if (value === undefined) {
            return this._config[key];
        }
        else {
            this._config[key] = value;
            return this;
        }
    }
    configAll(config) {
        this._config = Object.assign(Object.create(null), config);
        return this;
    }
}
