// 系统保留事件
var SystemEvent;
(function (SystemEvent) {
    // 登出
    SystemEvent["LOGOUT"] = "_logout";
    // 登录中
    SystemEvent["LOGINING"] = "_logining";
    // 登录结束
    SystemEvent["LOGINEND"] = "_loginend";
    // 环境切换
    SystemEvent["ENVCHANGE"] = "_env_change";
})(SystemEvent || (SystemEvent = {}));
export default SystemEvent;
