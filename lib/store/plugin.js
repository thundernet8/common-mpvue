export function syncStateToStoragePlugin(storeName) {
    function persistState(state) {
        wx.setStorage({
            key: storeName,
            data: JSON.stringify(state)
        });
    }
    return function (store) {
        store.subscribe(function (_mutation, state) {
            persistState(state);
        });
        store.subscribeAction(function (_action, state) {
            persistState(state);
        });
    };
}
