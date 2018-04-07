var Configurable = /** @class */ (function () {
    function Configurable() {
        this._config = {};
    }
    Configurable.prototype.config = function (key, value) {
        if (value === undefined) {
            return this._config[key];
        }
        else {
            this._config[key] = value;
            return this;
        }
    };
    Configurable.prototype.configAll = function (config) {
        this._config = Object.assign(Object.create(null), config);
        return this;
    };
    return Configurable;
}());
export default Configurable;
