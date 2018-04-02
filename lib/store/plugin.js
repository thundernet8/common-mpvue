export function syncStateToStoragePlugin(storeName) {
    function persistState(state) {
        wx.setStorage({
            key: storeName,
            data: JSON.stringify(state)
        });
    }
    return store => {
        store.subscribe((_mutation, state) => {
            persistState(state);
        });
        store.subscribeAction((_action, state) => {
            persistState(state);
        });
    };
}
