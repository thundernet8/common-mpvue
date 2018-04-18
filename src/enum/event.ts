// 系统保留事件

enum SystemEvent {
    // 登出
    LOGOUT = '_logout',
    // 登录中
    LOGINING = '_logining',
    // 登录结束
    LOGINEND = '_loginend',
    // 环境切换
    ENVCHANGE = '_env_change'
}

export default SystemEvent;
