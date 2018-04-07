export default class EventEmitter {
    _events;

    constructor() {
        this._events = {};
    }

    emit(name: string, ...args) {
        if (!this._events[name]) {
            return false;
        }

        const handler = this._events[name];
        if (!handler) {
            return false;
        }

        if (typeof handler === 'function') {
            handler.call(this, ...args);
            return true;
        } else if (Array.isArray(handler)) {
            for (let i = 0, l = handler.length; i < l; i++) {
                handler[i].call(this, ...args);
            }
            return true;
        }

        return false;
    }

    on(name: string, listener) {
        if (typeof listener !== 'function') {
            throw new Error('监听必须是方法');
        }

        if (!this._events[name]) {
            this._events[name] = listener;
        } else if (Array.isArray(this._events[name])) {
            this._events[name].push(listener);
        } else {
            this._events[name] = [this._events[name], listener];
        }

        return this;
    }

    once(name: string, listener) {
        const self = this;
        self.on(name, function l(...args) {
            self.off(name, l);
            listener.apply(self, args);
        });
    }

    off(name: string, listener) {
        if (typeof listener !== 'function') {
            throw new Error('监听必须是方法');
        }

        if (!this._events || !this._events[name]) {
            return this;
        }

        const list = this._events[name];

        if (Array.isArray(list)) {
            const index = list.indexOf(listener);
            if (index > -1) {
                list.splice(index, 1);
                if (list.length === 0) {
                    this._events[name] = undefined;
                }
            }
        } else if (this._events[name] === listener) {
            this._events[name] = undefined;
        }

        return this;
    }

    offAll(name: string) {
        if (name && this._events && this._events[name]) {
            this._events[name] = null;
        }
        return this;
    }
}
