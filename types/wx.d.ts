import * as internal from './internal';

interface WXExts {
    /**
     * 全局的Request实例
     */
    httpRequest: internal.Request;
}

interface WX extends WXExts {
    /// 网络

    /**
     * 发起网络请求
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-request.html
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-network.html
     * @param obj {RequestParamObject}
     */
    request(obj: RequestParamObject): void;

    /**
     * 将本地资源上传到开发者服务器，客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data。
     * 如页面通过 wx.chooseImage 等接口获取到一个本地资源的临时文件路径后，可通过此接口将本地资源上传到指定服务器
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-file.html
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-network.html
     * @param obj {UploadFileParamObject}
     */
    uploadFile(obj: UploadFileParamObject): void;

    /**
     * 下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
     * 注：文件的临时路径，在小程序本次启动期间可以正常使用，如需持久保存，需在主动调用 wx.saveFile，才能在小程序下次启动时访问得到
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-file.html#wxdownloadfileobject
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-network.html
     * @param obj {DownloadFileParamObject}
     */
    downloadFile(obj: DownloadFileParamObject): void;

    /// 媒体

    /// - 图片

    /**
     * 从本地相册选择图片或使用相机拍照
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-picture.html#wxchooseimageobject
     * @param obj
     */
    chooseImage(obj: ChooseImageParamObject): void;

    /**
     * 预览图片
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-picture.html#wxpreviewimageobject
     * @param obj
     */
    previewImage(obj: PreviewImageParamObject): void;

    /**
     * 获取图片信息
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-picture.html#wxgetimageinfoobject
     * @param obj
     */
    getImageInfo(obj: GetImageInfoParamObject): void;

    /**
     * 保存图片到系统相册。需要用户授权 scope.writePhotosAlbum
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-picture.html#wxsaveimagetophotosalbumobject
     * @param obj
     */
    saveImageToPhotosAlbum(obj): void; // TODO

    /// - 录音

    /**
     * 开始录音。当主动调用wx.stopRecord，或者录音超过1分钟时自动结束录音，返回录音文件的临时文件路径。当用户离开小程序时，此接口无法调用。
     * 需要用户授权 scope.record
     * 注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 wx.getRecorderManager 接口
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-record.html#wxstartrecordobject
     * @param obj
     */
    startRecord(obj?: BaseParamObject): void; // TODO

    /**
     * 主动调用停止录音
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-record.html#wxstoprecord
     */
    stopRecord(): void; // TODO

    /// - 录音管理

    /**
     * 获取全局唯一的录音管理器 recorderManager，从1.6.0开始支持
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/getRecorderManager.html
     */
    getRecorderManager(): RecorderManager; // TODO

    /// - 音频播放控制

    /**
     * 开始播放语音，同时只允许一个语音文件正在播放，如果前一个语音文件还没播放完，将中断前一个语音播放
     * 注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 wx.createInnerAudioContext 接口
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-voice.html#wxplayvoiceobject
     * @param obj
     */
    playVoice(obj): void; // TODO

    /**
     * 暂停正在播放的语音。再次调用wx.playVoice播放同一个文件时，会从暂停处开始播放。如果想从头开始播放，需要先调用 wx.stopVoice
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-voice.html#wxpausevoice
     */
    pauseVoice(): void;

    /**
     * 结束播放语音
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-voice.html#wxstopvoice
     */
    stopVoice(): void;

    /// - 音乐播放控制

    /**
     * 获取后台音乐播放状态
     * 注意：1.2.0 版本开始，本接口不再维护。建议使用能力更强的 wx.getBackgroundAudioManager 接口
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-background-audio.html#wxgetbackgroundaudioplayerstateobject
     * @param obj
     */
    getBackgroundAudioPlayerState(obj?: BaseParamObject): void;

    /**
     * 使用后台播放器播放音乐，对于微信客户端来说，只能同时有一个后台音乐在播放。当用户离开小程序后，音乐将暂停播放；当用户点击“显示在聊天顶部”时，音乐不会暂停播放；当用户在其他小程序占用了音乐播放器，原有小程序内的音乐将停止播放
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-background-audio.html#wxplaybackgroundaudioobject
     * @param obj
     */
    playBackgroundAudio(obj): void;

    /**
     * 暂停播放音乐
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-background-audio.html#wxpausebackgroundaudio
     */
    pauseBackgroundAudio(): void;

    /**
     * 控制音乐播放进度
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-background-audio.html#wxseekbackgroundaudioobject
     * @param obj
     */
    seekBackgroundAudio(obj): void;

    /**
     * 停止播放音乐
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-background-audio.html#wxstopbackgroundaudio
     */
    stopBackgroundAudio(): void;

    /**
     * 监听音乐播放
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-background-audio.html#wxonbackgroundaudioplaycallback
     * @param callback
     */
    onBackgroundAudioPlay(callback): void;

    /**
     * 监听音乐暂停
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-background-audio.html#wxonbackgroundaudiopausecallback
     * @param callback
     */
    onBackgroundAudioPause(callback): void;

    /**
     * 监听音乐停止
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-background-audio.html#wxonbackgroundaudiostopcallback
     * @param callback
     */
    onBackgroundAudioStop(callback): void;

    /// - 背景音频播放管理

    /**
     * 获取全局唯一的背景音频管理器 backgroundAudioManager
     * 注: 1.2.0 开始支持
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/getBackgroundAudioManager.html
     */
    getBackgroundAudioManager(): BackgroundAudioManager;

    /// - 音频组件控制

    /**
     * 创建并返回 audio 上下文 audioContext 对象。在自定义组件下，第二个参数传入组件实例this，以操作组件内 <audio/> 组件
     * 注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 wx.createInnerAudioContext 接口
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/api-audio.html#wxcreateaudiocontextaudioid
     * @param audioId
     * @param self
     */
    createAudioContext(audioId, self);

    /**
     * 创建并返回内部 audio 上下文 innerAudioContext 对象。本接口是 wx.createAudioContext 升级版
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/createInnerAudioContext.html
     */
    createInnerAudioContext();

    /// - 视频

    /**
     * 拍摄视频或从手机相册中选视频，返回视频的临时文件路径
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-video.html#wxchoosevideoobject
     * @param obj
     */
    chooseVideo(obj): void; // TODO

    /**
     * 保存视频到系统相册。需要用户授权 scope.writePhotosAlbum，1.2.0开始支持
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-video.html#wxsavevideotophotosalbumobject
     * @param obj
     */
    saveVideoToPhotosAlbum(obj): void; // TODO

    /// - 视频组件控制

    /**
     * 创建并返回 video 上下文 videoContext 对象。在自定义组件下，第二个参数传入组件实例this，以操作组件内 <video/> 组件
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/api-video.html#wxcreatevideocontextvideoid
     * @param videoId
     * @param self
     */
    createVideoContext(videoId, self);

    /// - 相机组件控制

    /**
     * 创建并返回 camera 上下文 cameraContext 对象，cameraContext 与页面的 camera 组件绑定，一个页面只能有一个camera，通过它可以操作对应的 <camera/> 组件。 在自定义组件下，第一个参数传入组件实例this，以操作组件内 <camera/> 组件
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/api-camera.html
     * @param self
     */
    createCameraContext(self);

    /// - 实时音视频

    /**
     * 操作对应的 <live-player/> 组件。 创建并返回 live-player 上下文 LivePlayerContext 对象。在自定义组件下，第二个参数传入组件实例this，以操作组件内 <live-player/> 组件
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/api-live-player.html
     * @param domId
     * @param self
     */
    createLivePlayerContext(domId, self);

    /**
     * 创建并返回 live-pusher 上下文 LivePusherContext 对象，LivePusherContext 与页面的 <live-pusher /> 组件绑定，一个页面只能有一个 live-pusher，通过它可以操作对应的 <live-pusher/> 组件。 在自定义组件下，第一个参数传入组件实例this，以操作组件内 <live-pusher/> 组件
     * 注: 1.7.0开始支持
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/api-live-pusher.html
     */
    createLivePusherContext();

    /// 文件

    /**
     * 保存文件到本地
     * 注意：saveFile 会把临时文件移动，因此调用成功后传入的 tempFilePath 将不可用
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file.html#wxsavefileobject
     * @param obj
     */
    saveFile(obj): void;

    /**
     * 获取文件信息
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/getFileInfo.html
     * @param obj
     */
    getFileInfo(obj): void;

    /**
     * 获取本地已保存的文件列表
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file.html#wxgetsavedfilelistobject
     * @param obj
     */
    getSavedFileList(obj?: BaseParamObject): void;

    /**
     * 获取本地文件的文件信息。此接口只能用于获取已保存到本地的文件，若需要获取临时文件信息，请使用 wx.getFileInfo 接口
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file.html#wxgetsavedfileinfoobject
     * @param obj
     */
    getSavedFileInfo(obj): void;

    /**
     * 删除本地存储的文件
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file.html#wxremovesavedfileobject
     * @param obj
     */
    removeSavedFile(obj): void;

    /**
     * 新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file.html#wxopendocumentobject
     * @param obj
     */
    openDocument(obj): void;

    /// 数据缓存

    /**
     * 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxsetstorageobject
     * @param obj
     */
    setStorage(obj): void; // TODO

    /**
     * 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxsetstoragesynckeydata
     * @param key
     * @param data
     */
    setStorageSync(key: string, data);

    /**
     * 从本地缓存中异步获取指定 key 对应的内容
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxgetstorageobject
     * @param obj
     */
    getStorage(obj): void; // TODO

    /**
     * 从本地缓存中同步获取指定 key 对应的内容
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxgetstoragesynckey
     * @param key 本地缓存中的指定的 key
     */
    getStorageSync(key: string);

    /**
     * 异步获取当前storage的相关信息
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxgetstorageinfoobject
     * @param obj
     */
    getStorageInfo(obj: BaseParamObject): void; // TODO

    /**
     * 同步获取当前storage的相关信息
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxgetstorageinfosync
     */
    getStorageInfoSync();

    /**
     * 从本地缓存中异步移除指定 key
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxremovestorageobject
     * @param obj
     */
    removeStorage(obj): void;

    /**
     * 从本地缓存中同步移除指定 key
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxremovestoragesynckey
     * @param key
     */
    removeStorageSync(key: string);

    /**
     * 清理本地数据缓存
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxclearstorage
     */
    clearStorage(): void;

    /**
     * 同步清理本地数据缓存
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxclearstoragesync
     */
    clearStorageSync(): void;

    /// 位置

    /**
     * 获取当前的地理位置、速度。当用户离开小程序后，此接口无法调用；当用户点击“显示在聊天顶部”时，此接口可继续调用
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/location.html#wxgetlocationobject
     * @param obj
     */
    getLocation(obj): void;

    /**
     * 打开地图选择位置
     * 需要用户授权 scope.userLocation
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/location.html#wxchooselocationobject
     * @param obj
     */
    chooseLocation(obj): void;

    /**
     * 使用微信内置地图查看位置
     * 需要用户授权 scope.userLocation
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/location.html#wxopenlocationobject
     * @param obj
     */
    openLocation(obj): void;

    /**
     * 创建并返回 map 上下文 mapContext 对象。在自定义组件下，第二个参数传入组件实例this，以操作组件内 <map/> 组件
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/api-map.html#wxcreatemapcontextmapid
     * @param mapId
     * @param self
     */
    createMapContext(mapId, self);

    /// 设备

    /**
     * 获取系统信息
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/systeminfo.html#wxgetsysteminfoobject
     * @param obj
     */
    getSystemInfo(obj): void;

    /**
     * 获取系统信息同步接口
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/systeminfo.html#wxgetsysteminfosync
     */
    getSystemInfoSync();

    /**
     * 判断小程序的API，回调，参数，组件等是否在当前版本可用
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/api-caniuse.html
     * @param capability
     */
    canIUse(capability: string): boolean;

    /**
     * 获取网络类型
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device.html#wxgetnetworktypeobject
     * @param obj
     */
    getNetworkType(obj: BaseParamObject): void;

    /**
     * 监听网络状态变化
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device.html#wxonnetworkstatuschangecallback
     * @param callback
     */
    onNetworkStatusChange(callback): void;

    /**
     * 监听加速度数据，频率：5次/秒，接口调用后会自动开始监听，可使用 wx.stopAccelerometer 停止监听
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/accelerometer.html#wxonaccelerometerchangecallback
     * @param callback
     */
    onAccelerometerChange(callback): void;

    /**
     * 开始监听加速度数据
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/accelerometer.html#wxstartaccelerometerobject
     * @param obj
     */
    startAccelerometer(obj?: BaseParamObject): void;

    /**
     * 停止监听加速度数据
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/accelerometer.html#wxstopaccelerometerobject
     * @param obj
     */
    stopAccelerometer(obj?: BaseParamObject): void;

    /**
     * 监听罗盘数据，频率：5次/秒，接口调用后会自动开始监听，可使用wx.stopCompass停止监听
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/compass.html#wxoncompasschangecallback
     * @param obj
     */
    onCompassChange(obj): void;

    /**
     * 开始监听罗盘数据
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/compass.html#wxstartcompassobject
     * @param obj
     */
    startCompass(obj?: BaseParamObject): void;

    /**
     * 停止监听罗盘数据
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/compass.html#wxstopcompassobject
     * @param obj
     */
    stopCompass(obj?: BaseParamObject): void;

    /**
     * 拨打电话
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/phonecall.html#wxmakephonecallobject
     * @param obj
     */
    makePhoneCall(obj): void;

    /**
     * 调起客户端扫码界面，扫码成功后返回对应的结果
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/scancode.html#wxscancodeobject
     * @param obj
     */
    scanCode(obj): void;

    /**
     * 设置系统剪贴板的内容
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/clipboard.html#wxsetclipboarddataobject
     * @param obj
     */
    setClipboardData(obj): void;

    /**
     * 获取系统剪贴板内容
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/clipboard.html#wxgetclipboarddataobject
     * @param obj
     */
    getClipboardData(obj?: BaseParamObject): void;

    // TODO 蓝牙

    /**
     * 设置屏幕亮度
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device.html#wxsetscreenbrightnessobject
     * @param obj
     */
    setScreenBrightness(obj): void;

    /**
     * 获取屏幕亮度
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device.html#wxgetscreenbrightnessobject
     * @param obj
     */
    getScreenBrightness(obj?: BaseParamObject): void;

    /**
     * 设置是否保持常亮状态。仅在当前小程序生效，离开小程序后设置失效
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/setKeepScreenOn.html
     * @param obj
     */
    setKeepScreenOn(obj): void;

    /**
     * 监听用户主动截屏事件，用户使用系统截屏按键截屏时触发此事件
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/onUserCaptureScreen.html
     * @param callback
     */
    onUserCaptureScreen(callback): void;

    /**
     * 使手机发生较长时间的振动（400ms）
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device.html#wxvibratelongobject
     * @param obj
     */
    vibrateLong(obj?: BaseParamObject): void;

    /**
     * 使手机发生较短时间的振动（15ms）
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device.html#wxvibrateshortobject
     * @param obj
     */
    vibrateShort(obj?: BaseParamObject): void;

    /**
     * 调用后，用户可以选择将该表单以“新增联系人”或“添加到已有联系人”的方式，写入手机系统通讯录，完成手机通讯录联系人和联系方式的增加
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/phone-contact.html#wxaddphonecontactobject
     * @param obj
     */
    addPhoneContact(obj): void;

    // TODO NFC

    // TODO Wifi

    /// 界面

    // - 交互反馈

    /**
     * 显示消息提示框
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-react.html#wxshowtoastobject
     * @param obj
     */
    showToast(obj: ShowToastParamObject): void;

    /**
     * 显示 loading 提示框, 需主动调用 wx.hideLoading 才能关闭提示框
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-react.html#wxshowloadingobject
     * @param obj
     */
    showLoading(obj: ShowLoadingParamObject): void;

    /**
     * 隐藏消息提示框
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-react.html#wxhidetoast
     */
    hideToast(): void;

    /**
     * 隐藏 loading 提示框
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-react.html#wxhideloading
     */
    hideLoading(): void;

    /**
     * 显示模态弹窗
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-react.html#wxshowmodalobject
     * @param obj
     */
    showModal(obj: ShowModalParamObject): void;

    /**
     * 显示操作菜单
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-react.html#wxshowactionsheetobject
     * @param obj
     */
    showActionSheet(obj: ShowActionSheetParamObject): void;

    // - 设置导航条

    /**
     * 动态设置当前页面的标题
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui.html#wxsetnavigationbartitleobject
     * @param obj
     */
    setNavigationBarTitle(obj: SetNavigationBarTitleParamObject): void;

    /**
     * 在当前页面显示导航条加载动画
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui.html#wxshownavigationbarloading
     */
    showNavigationBarLoading(): void;

    /**
     * 隐藏导航条加载动画
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui.html#wxhidenavigationbarloading
     */
    hideNavigationBarLoading(): void;

    /**
     * 设置导航条颜色
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/setNavigationBarColor.html
     * @param obj
     */
    setNavigationBarColor(obj: SetNavigationBarColorParamObject): void;

    // - 设置tabBar

    /**
     * 为 tabBar 某一项的右上角添加文本
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-tabbar.html#wxsettabbarbadgeobject
     * @param obj
     */
    setTabBarBadge(obj: SetTabBarBadgeParamObject): void;

    /**
     * 移除 tabBar 某一项右上角的文本
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-tabbar.html#wxremovetabbarbadgeobject
     * @param obj
     */
    removeTabBarBadge(obj: RemoveTabBarBadgeParamObject): void;

    /**
     * 显示 tabBar 某一项的右上角的红点
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-tabbar.html#wxshowtabbarreddotobject
     * @param obj
     */
    showTabBarRedDot(obj: ShowTabBarRedDotParamObject): void;

    /**
     * 隐藏 tabBar 某一项的右上角的红点
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-tabbar.html#wxhidetabbarreddotobject
     * @param obj
     */
    hideTabBarRedDot(obj: HideTabBarRedDotParamObject): void;

    /**
     * 动态设置 tabBar 的整体样式
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-tabbar.html#wxsettabbarstyleobject
     * @param obj
     */
    setTabBarStyle(obj: SetTabBarStyleParamObject): void;

    /**
     * 动态设置 tabBar 某一项的内容
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-tabbar.html#wxsettabbaritemobject
     * @param obj
     */
    setTabBarItem(obj: SetTabBarItemParamObject): void;

    /**
     * 显示 tabBar
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-tabbar.html#wxshowtabbarobject
     * @param obj
     */
    showTabBar(obj: ShowTabBarParamObject): void;

    /**
     * 隐藏 tabBar
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-tabbar.html#wxhidetabbarobject
     * @param obj
     */
    hideTabBar(obj: HideTabBarParamObject): void;

    // - 设置置顶信息

    /**
     * 动态设置置顶栏文字内容，只有当前小程序被置顶时能生效，如果当前小程序没有被置顶，也能调用成功，但是不会立即生效，只有在用户将这个小程序置顶后才换上设置的文字内容
     * 注意：调用成功后，需间隔 5s 才能再次调用此接口，如果在 5s 内再次调用此接口，会回调 fail，errMsg："setTopBarText: fail invoke too frequently"
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui.html#wxsettopbartextobject
     * @param obj
     */
    setTopBarText(obj): void;

    // - 导航

    /**
     * 保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-navigate.html#wxnavigatetoobject
     * @param obj {NavParamObject}
     */
    navigateTo(obj: NavParamObject): void;

    /**
     * 关闭当前页面，跳转到应用内的某个页面
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-navigate.html#wxredirecttoobject
     * @param obj {NavParamObject}
     */
    redirectTo(obj: NavParamObject): void;

    /**
     * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-navigate.html#wxswitchtabobject
     * @param obj {NavParamObject}
     */
    switchTab(obj: NavParamObject): void;

    /**
     * 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages() 获取当前的页面栈，决定需要返回几层
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-navigate.html#wxnavigatebackobject
     * @param obj {NavigateBackParamObject}
     */
    navigateBack(obj: NavigateBackParamObject): void;

    /**
     * 关闭所有页面，打开到应用内的某个页面
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-navigate.html#wxrelaunchobject
     * @param obj {NavParamObject}
     */
    reLaunch(obj: NavParamObject): void;

    // - 动画

    /**
     * 创建一个动画实例animation。调用实例的方法来描述动画。最后通过动画实例的export方法导出动画数据传递给组件的animation属性
     * 注意: export 方法每次调用后会清掉之前的动画操作
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-animation.html#wxcreateanimationobject
     * @param obj
     */
    createAnimation(obj): void;

    // - 位置

    /**
     * 将页面滚动到目标位置
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/scroll.html
     * @param obj
     */
    pageScrollTo(obj): void;

    // - 绘图

    /**
     * 创建 canvas 绘图上下文（指定 canvasId）。在自定义组件下，第二个参数传入组件实例this，以操作组件内 <canvas/> 组件
     * Tip: 需要指定 canvasId，该绘图上下文只作用于对应的 <canvas/>
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/canvas/create-canvas-context.html
     * @param canvasId
     * @param component
     */
    createCanvasContext(canvasId: string, component);

    /**
     * 把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/canvas/temp-file.html
     * @param obj
     * @param component
     */
    canvasToTempFilePath(obj, component): void;

    /**
     * 返回一个数组，用来描述 canvas 区域隐含的像素数据
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/canvas/get-image-data.html
     * @param obj
     */
    canvasGetImageData(obj): void;

    /**
     * 将像素数据绘制到画布的方法
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/canvas/put-image-data.html
     * @param obj
     */
    canvasPutImageData(obj): void;

    // - 下拉刷新

    /**
     * 开始下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/pulldown.html#wxstartpulldownrefresh
     * @param obj
     */
    startPullDownRefresh(obj?: BaseParamObject): void;

    /**
     * 停止当前页面下拉刷新
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/pulldown.html#wxstoppulldownrefresh
     */
    stopPullDownRefresh(): void;

    /// 第三方平台

    /**
     * 获取第三方平台自定义的数据字段
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ext-api.html#wxgetextconfigobject
     * @param obj
     */
    getExtConfig(obj): void;

    /**
     * 获取第三方平台自定义的数据字段的同步接口
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ext-api.html#wxgetextconfigsync
     */
    getExtConfigSync(): AnyObject;

    /// 开放接口

    // - 登录

    /**
     * 调用接口wx.login() 获取临时登录凭证（code）
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html#wxloginobject
     * @param obj
     */
    login(obj): void;

    /**
     * 校验用户当前session_key是否有效
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/signature.html#wxchecksessionobject
     * @param obj
     */
    checkSession(obj?: BaseParamObject): void;

    // - 授权

    /**
     * 提前向用户发起授权请求。调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。如果用户之前已经同意授权，则不会出现弹窗，直接返回成功
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/authorize.html
     * @param obj
     */
    authorize(obj): void;

    // - 用户信息

    /**
     * 获取用户信息，withCredentials 为 true 时需要先调用 wx.login 接口
     * 需要用户授权 scope.userInfo
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/open.html#wxgetuserinfoobject
     * @param obj
     */
    getUserInfo(obj): void;

    // - 微信支付

    /**
     * 发起微信支付
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-pay.html#wxrequestpaymentobject
     * @param obj
     */
    requestPayment(obj): void;

    // - 转发

    /**
     * 显示当前页面的转发按钮
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/share.html#wxshowsharemenuobject
     * @param obj
     */
    showShareMenu(obj): void;

    /**
     * 隐藏转发按钮
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/share.html#wxhidesharemenuobject
     * @param obj
     */
    hideShareMenu(obj?: BaseParamObject): void;

    /**
     * 更新转发属性
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/share.html#wxupdatesharemenuobject
     * @param obj
     */
    updateShareMenu(obj): void;

    /**
     * 获取转发详细信息
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/share.html#wxgetshareinfoobject
     * @param obj
     */
    getShareInfo(obj): void;

    // - 收货地址

    /**
     * 调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址
     * 需要用户授权 scope.address
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/address.html#wxchooseaddressobject
     * @param obj
     */
    chooseAddress(obj?: BaseParamObject): void;

    // - 卡券

    /**
     * 批量添加卡券
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/card.html#wxaddcardobject
     * @param obj
     */
    addCard(obj): void;

    /**
     * 查看微信卡包中的卡券
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/card.html#wxopencardobject
     * @param obj
     */
    openCard(obj): void;

    // - 设置

    /**
     * 调起客户端小程序设置界面，返回用户设置的操作结果
     * 注：设置界面只会出现小程序已经向用户请求过的权限
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/setting.html#wxopensettingobject
     * @param obj
     */
    openSetting(obj?: BaseParamObject): void;

    /**
     * 获取用户的当前设置
     * 注：返回值中只会出现小程序已经向用户请求过的权限
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/setting.html#wxgetsettingobject
     * @param obj
     */
    getSetting(obj?: BaseParamObject): void;

    // - 微信运动

    /**
     * 获取用户过去三十天微信运动步数，需要先调用 wx.login 接口
     * 需要用户授权 scope.werun
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/we-run.html#wxgetwerundataobject
     * @param obj
     */
    getWeRunData(obj): void;

    // - 打开小程序

    /**
     * 打开同一公众号下关联的另一个小程序。（注：必须是同一公众号下，而非同个 open 账号下）
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/navigateToMiniProgram.html
     * @param obj
     */
    navigateToMiniProgram(obj): void;

    /**
     * 返回到上一个小程序，只有在当前小程序是被其他小程序打开时可以调用成功
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/navigateBackMiniProgram.html
     * @param obj
     */
    navigateBackMiniProgram(obj): void;

    // - 获取发票抬头

    /**
     * 选择用户的发票抬头
     * 需要用户授权 scope.invoiceTitle
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/chooseInvoiceTitle.html
     * @param obj
     */
    chooseInvoiceTitle(obj?: BaseParamObject): void;

    // - 生物认证

    /**
     * 获取本机支持的 SOTER 生物认证方式
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/checkIsSupportSoterAuthentication.html
     * @param obj
     */
    checkIsSupportSoterAuthentication(obj?: BaseParamObject): void;

    /**
     * 开始 SOTER 生物认证
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/startSoterAuthentication.html
     * @param obj
     */
    startSoterAuthentication(obj): void;

    /**
     * 获取设备内是否录入如指纹等生物信息的接口
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/checkIsSoterEnrolledInDevice.html
     * @param obj
     */
    checkIsSoterEnrolledInDevice(obj): void;

    /// 数据

    /**
     * 自定义分析数据上报接口。使用前，需要在小程序管理后台自定义分析中新建事件，配置好事件名与字段
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/analysis-report.html
     * @param eventName {String} 事件名
     * @param data {Object} 上报的自定义数据。key为配置中的字段名，value为上报的数据
     */
    reportAnalytics(eventName: string, data: AnyObject): void;

    /// 更新

    /**
     * 获取全局唯一的版本更新管理器，用于管理小程序更新
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/getUpdateManager.html
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/framework/operating-mechanism.html
     */
    getUpdateManager(): UpdateManager;

    /// 多线程

    /**
     * 创建一个 Worker 线程，并返回 Worker 实例，目前限制最多只能创建一个 Worker，创建下一个 Worker 前请调用 Worker.terminate
     * scriptPath 为 worker 的入口文件路径，需填写绝对路径
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/createWorker.html
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/framework/workers.html
     * @param scriptPath
     */
    createWorker(scriptPath: string): WxWorker;

    /// 调试接口

    /**
     * 设置是否打开调试开关，此开关对正式版也能生效
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/setEnableDebug.html
     * @param obj
     */
    setEnableDebug(obj): void;

    /// 其他
    [key: string]: any;
}

////// paramters & return values interface

/**
 * Any Object
 */
export interface AnyObject {
    [key: string]: any;
}

/**
 * Paramter Object
 */
interface BaseParamObject {
    success?: Function;
    fail?: Function;
    complete?: Function;
}

export interface RequestParamCommonObject {
    url: string;
    data?: Object | String | ArrayBuffer;
    header?: { [key: string]: any };
    method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
    dataType?: 'json' | 'text';
    responseType?: 'text' | 'arraybuffer';
}

interface RequestParamObject extends BaseParamObject, RequestParamCommonObject {}

export interface UploadFileParamCommonObject {
    /**
     * 开发者服务器 url
     */
    url: string;
    /**
     * 要上传文件资源的路径
     */
    filePath: string;
    /**
     * 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
     */
    name: string;
    /**
     * HTTP 请求 Header, header 中不能设置 Referer
     */
    header?: { [key: string]: any };
    /**
     * HTTP 请求中其他额外的 form data
     */
    formData?: { [key: string]: any };
}

interface UploadFileParamObject extends BaseParamObject, UploadFileParamCommonObject {
    /**
     * 接口调用成功的回调函数
     * @param data {String} 开发者服务器返回的数据
     * @param statusCode {Number} 开发者服务器返回的 HTTP 状态码
     */
    success?: (data: string, statusCode: number) => void;
}

export interface DownloadFileParamCommonObject {
    /**
     * 下载资源的 url
     */
    url: string;

    /**
     * HTTP 请求 Header, header 中不能设置 Referer
     */
    header?: { [key: string]: any };
}

interface DownloadFileParamObject extends BaseParamObject, DownloadFileParamCommonObject {
    /**
     * 下载成功后以 tempFilePath 的形式传给页面，res = {tempFilePath: '文件的临时路径'}
     * @param tempFilePath {String} 临时文件路径，下载后的文件会存储到一个临时文件
     * @param statusCode {Number} 开发者服务器返回的 HTTP 状态码
     */
    success?: (tempFilePath: string, statusCode: number) => void;
}

export interface ChooseImageParamCommonObject {
    /**
     * 最多可以选择的图片张数，默认9
     */
    count?: number;

    /**
     * original 原图，compressed 压缩图，默认二者都有
     */
    sizeType?: string[];

    /**
     * album 从相册选图，camera 使用相机，默认二者都有
     */
    sourceType?: string[];
}

interface ChooseImageParamObject extends BaseParamObject, ChooseImageParamCommonObject {
    /**
     * 成功则返回图片的本地文件路径列表 tempFilePaths
     * 注: 文件的临时路径，在小程序本次启动期间可以正常使用，如需持久保存，需在主动调用 wx.saveFile，在小程序下次启动时才能访问得到。
     * @param tempFilePaths 图片的本地文件路径列表
     * @param tempFiles 图片的本地文件列表，每一项是一个 File 对象
     */
    success: (tempFilePaths: string[], tempFiles: File[]) => void;
}

export interface PreviewImageParamCommonObject {
    /**
     * 当前显示图片的链接，不填则默认为 urls 的第一张
     */
    current?: string;

    /**
     * 需要预览的图片链接列表
     */
    urls: string[];
}

interface PreviewImageParamObject extends BaseParamObject, PreviewImageParamCommonObject {}

export interface GetImageInfoParamCommonObject {
    /**
     * 图片的路径，可以是相对路径，临时文件路径，存储文件路径，网络图片路径
     */
    src: string;
}

interface GetImageInfoParamObject extends BaseParamObject, GetImageInfoParamCommonObject {
    /**
     * 成功的回调
     * @param {Number} info.width 图片宽度，单位px
     * @param {Number} info.height 图片高度，单位px
     * @param {String} info.path 返回图片的本地路径
     * @param {String} info.orientation 返回图片的方向
     * @param {String} info.type 返回图片的格式
     */
    success?: (
        info: { width: number; height: number; path: string; orientation: string; type: string }
    ) => void;
}

export interface ShowToastParamCommonObject {
    /**
     * 提示的内容
     */
    title: string;

    /**
     * 图标，有效值 "success", "loading", "none"
     */
    icon?: 'success' | 'loading' | 'none';

    /**
     * 自定义图标的本地路径，image 的优先级高于 icon
     */
    image?: string;

    /**
     * 提示的延迟时间，单位毫秒，默认：1500
     */
    duration?: number;

    /**
     * 是否显示透明蒙层，防止触摸穿透，默认：false
     */
    mask?: boolean;
}

interface ShowToastParamObject extends BaseParamObject, ShowToastParamCommonObject {}

export interface ShowLoadingParamCommonObject {
    /**
     * 提示的内容
     */
    title: string;

    /**
     * 是否显示透明蒙层，防止触摸穿透，默认：false
     */
    mask?: boolean;
}

interface ShowLoadingParamObject extends BaseParamObject, ShowLoadingParamCommonObject {}

export interface ShowModalParamCommonObject {
    /**
     * 提示的标题
     */
    title: string;

    /**
     * 提示的内容
     */
    content: string;

    /**
     * 是否显示取消按钮，默认为 true
     */
    showCancel?: boolean;

    /**
     * 取消按钮的文字，默认为"取消"，最多 4 个字符
     */
    cancelText?: string;

    /**
     * 取消按钮的文字颜色，默认为"#000000"
     */
    cancelColor?: string;

    /**
     * 确定按钮的文字，默认为"确定"，最多 4 个字符
     */
    confirmText?: string;

    /**
     * 确定按钮的文字颜色，默认为"#3CC51F"
     */
    confirmColor?: string;
}

interface ShowModalParamObject extends BaseParamObject, ShowModalParamCommonObject {
    /**
     * 接口调用成功的回调函数
     * @param confirm 为 true 时，表示用户点击了确定按钮
     * @param cancel 为 true 时，表示用户点击了取消（用于 Android 系统区分点击蒙层关闭还是点击取消按钮关闭）
     */
    success?: (confirm: boolean, cancel: boolean) => void;
}

export interface ShowActionSheetParamCommonObject {
    /**
     * 按钮的文字数组，数组长度最大为6个
     */
    itemList: string[];

    /**
     * 按钮的文字颜色，默认为"#000000"
     */
    itemColor?: string;
}

interface ShowActionSheetParamObject extends BaseParamObject, ShowActionSheetParamCommonObject {
    /**
     * 接口调用成功的回调函数
     * @param tapIndex 用户点击的按钮，从上到下的顺序，从0开始
     */
    success?: (tapIndex: number) => void;
}

export interface SetNavigationBarTitleParamCommonObject {
    /**
     * 页面标题
     */
    title: string;
}

interface SetNavigationBarTitleParamObject
    extends BaseParamObject,
        SetNavigationBarTitleParamCommonObject {}

export interface SetNavigationBarColorParamCommonObject {
    /**
     * 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
     */
    frontColor: '#ffffff' | '#000000';

    /**
     * 背景颜色值，有效值为十六进制颜色
     */
    backgroundColor: string;

    /**
     * 动画效果
     * @param duration 动画变化时间，默认0，单位：毫秒
     * @param timingFunc 动画变化方式，默认 linear
     */
    animation?: { duration: number; timingFunc: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' };
}

interface SetNavigationBarColorParamObject
    extends BaseParamObject,
        SetNavigationBarColorParamCommonObject {
    /**
     * 接口调用成功的回调函数
     * @param errMsg 调用结果
     */
    success?: (errMsg: string) => void;
}

export interface SetTabBarBadgeParamCommonObject {
    /**
     * tabBar的哪一项，从左边算起
     */
    index: number;

    /**
     * 显示的文本，超过 3 个字符则显示成"…"
     */
    text: string;
}

interface SetTabBarBadgeParamObject extends BaseParamObject, SetTabBarBadgeParamCommonObject {}

export interface RemoveTabBarBadgeParamCommonObject {
    /**
     * tabBar的哪一项，从左边算起
     */
    index: number;
}

interface RemoveTabBarBadgeParamObject
    extends BaseParamObject,
        RemoveTabBarBadgeParamCommonObject {}

export interface ShowTabBarRedDotParamCommonObject {
    /**
     * tabBar的哪一项，从左边算起
     */
    index: number;
}

interface ShowTabBarRedDotParamObject extends BaseParamObject, ShowTabBarRedDotParamCommonObject {}

export interface HideTabBarRedDotParamCommonObject {
    /**
     * tabBar的哪一项，从左边算起
     */
    index: number;
}

interface HideTabBarRedDotParamObject extends BaseParamObject, HideTabBarRedDotParamCommonObject {}

export interface SetTabBarStyleParamCommonObject {
    /**
     * tab 上的文字默认颜色
     */
    color?: string;

    /**
     * tab 上的文字选中时的颜色
     */
    selectedColor?: string;

    /**
     * tab 的背景色
     */
    backgroundColor?: string;

    /**
     * tabbar上边框的颜色， 仅支持 black/white
     */
    borderStyle?: 'black' | 'white';
}

interface SetTabBarStyleParamObject extends BaseParamObject, SetTabBarStyleParamCommonObject {}

export interface SetTabBarItemParamCommonObject {
    /**
     * tabBar 的哪一项，从左边算起
     */
    index: number;

    /**
     * tab 上按钮文字
     */
    text?: string;

    /**
     * 图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效，不支持网络图片
     */
    iconPath?: string;

    /**
     * 选中时的图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px ，当 postion 为 top 时，此参数无效
     */
    selectedIconPath?: string;
}

interface SetTabBarItemParamObject extends BaseParamObject, SetTabBarItemParamCommonObject {}

export interface ShowTabBarParamCommonObject {
    /**
     * 是否需要动画效果，默认无
     */
    animation?: boolean;
}

interface ShowTabBarParamObject extends BaseParamObject, ShowTabBarParamCommonObject {}

export interface HideTabBarParamCommonObject {
    /**
     * 是否需要动画效果，默认无
     */
    animation?: boolean;
}

interface HideTabBarParamObject extends BaseParamObject, HideTabBarParamCommonObject {}

export interface NavParamCommonObject {
    url: string;
}

interface NavParamObject extends BaseParamObject, NavParamCommonObject {}

export interface NavigateBackParamCommonObject {
    /**
     * 返回的页面数，如果 delta 大于现有页面数，则返回到首页
     */
    delta: number;
}

interface NavigateBackParamObject extends NavigateBackParamCommonObject {}

///// Ohters

export interface UpdateManager {
    /**
     * 当向微信后台请求完新版本信息，会进行回调
     * @param callback
     */
    onCheckForUpdate(callback: (res: OnCheckForUpdateCallbackParams) => void): void;

    /**
     * 当新版本下载完成，会进行回调
     * @param callback
     */
    onUpdateReady(callback): void;

    /**
     * 当新版本下载失败，会进行回调
     * @param callback
     */
    onUpdateFailed(callback): void;

    /**
     * 当新版本下载完成，调用该方法会强制当前小程序应用上新版本并重启
     */
    applyUpdate(): void;
}

interface OnCheckForUpdateCallbackParams {
    hasUpdate: boolean;
}

export interface WxWorker {
    /**
     * 向 Worker 线程发送消息，message 参数为需要发送的消息，必须是一个可序列化的 JavaScript 对象
     * @param obj
     */
    postMessage(obj: AnyObject): void;

    /**
     * 监听 Worker 线程向当前线程发送的消息
     * @param message
     */
    onMessage(message: AnyObject): void;

    /**
     * 结束当前 Worker 线程，仅限在主线程 Worker 实例上调用
     */
    terminate(): void;
}

export interface RecorderManager {
    /**
     * 开始录音
     * @param options
     */
    start(options);

    /**
     * 暂停录音
     */
    pause();

    /**
     * 继续录音
     */
    resume();

    /**
     * 停止录音
     */
    stop();

    /**
     * 录音开始事件
     * @param callback
     */
    onStart(callback);

    /**
     * 录音暂停事件
     * @param callback
     */
    onPause(callback);

    /**
     * 录音停止事件，会回调文件地址
     * @param callback
     */
    onStop(callback);

    /**
     * 已录制完指定帧大小的文件，会回调录音分片结果数据。如果设置了 frameSize ，则会回调此事件
     * @param callback
     */
    onFrameRecorded(callback);

    /**
     * 录音错误事件, 会回调错误信息
     * @param callback
     */
    onError(callback);
}

export interface BackgroundAudioManager {
    /**
     * 当前音频的长度（单位：s），只有在当前有合法的 src 时返回
     */
    duration?: number;

    /**
     * 当前音频的播放位置（单位：s），只有在当前有合法的 src 时返回
     */
    currentTime?: number;

    /**
     * 当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放
     */
    paused: boolean;

    /**
     * 音频的数据源，默认为空字符串，当设置了新的 src 时，会自动开始播放 ，目前支持的格式有 m4a, aac, mp3, wav
     * 注: 此项可写
     */
    src: string;

    /**
     * 音频开始播放的位置（单位：s）
     * 注: 此项可写
     */
    startTime: number;

    /**
     * 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲
     */
    buffered: number;

    /**
     * 音频标题，用于做原生音频播放器音频标题。原生音频播放器中的分享功能，分享出去的卡片标题，也将使用该值
     * 注: 此项可写
     */
    title: string;

    /**
     * 专辑名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值
     * 注: 此项可写
     */
    epname: string;

    /**
     * 歌手名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值
     * 注: 此项可写
     */
    singer: string;

    /**
     * 封面图url，用于做原生音频播放器背景图。原生音频播放器中的分享功能，分享出去的卡片配图及背景也将使用该图
     * 注: 此项可写
     */
    coverImgUrl: string;

    /**
     * 页面链接，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值
     * 注: 此项可写
     */
    webUrl: string;

    /**
     * 播放
     */
    play(): void;

    /**
     * 暂停
     */
    pause(): void;

    /**
     * 停止
     */
    stop(): void;

    /**
     * 跳转到指定位置
     * @param position 音频位置，单位 s
     */
    seek(position: number): void;

    /**
     * 背景音频进入可以播放状态，但不保证后面可以流畅播放
     * @param callback
     */
    onCanplay(callback): void;

    /**
     * 背景音频播放事件
     * @param callback
     */
    onPlay(callback): void;

    /**
     * 背景音频暂停事件
     * @param callback
     */
    onPause(callback): void;

    /**
     * 背景音频停止事件
     * @param callback
     */
    onStop(callback): void;

    /**
     * 背景音频自然播放结束事件
     * @param callback
     */
    onEnded(callback): void;

    /**
     * 背景音频播放进度更新事件
     * @param callback
     */
    onTimeUpdate(callback): void;

    /**
     * 用户在系统音乐播放面板点击上一曲事件（iOS only）
     * @param callback
     */
    onPrev(callback): void;

    /**
     * 用户在系统音乐播放面板点击下一曲事件（iOS only）
     * @param callback
     */
    onNext(callback): void;

    /**
     * 背景音频播放错误事件
     * @param callback
     */
    onError(callback): void;

    /**
     * 音频加载中事件，当音频因为数据不足，需要停下来加载时会触发
     * @param callback
     */
    onWating(callback): void;
}

export default WX;
