import * as params from './wx';
import * as internal from './internal';

interface WXPExts {
    /**
     * 全局的Request实例
     */
    httpRequest: internal.Request;
}

interface WXP extends WXPExts {
    /// 网络

    /**
     * 发起网络请求
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-request.html
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-network.html
     * @param obj {RequestParamObject}
     */
    request(obj: params.RequestParamCommonObject): Promise<any>;

    /**
     * 将本地资源上传到开发者服务器，客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data。
     * 如页面通过 wx.chooseImage 等接口获取到一个本地资源的临时文件路径后，可通过此接口将本地资源上传到指定服务器
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-file.html
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-network.html
     * @param obj {UploadFileParamObject}
     */
    uploadFile(obj: params.UploadFileParamCommonObject): Promise<any>;

    /**
     * 下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
     * 注：文件的临时路径，在小程序本次启动期间可以正常使用，如需持久保存，需在主动调用 wx.saveFile，才能在小程序下次启动时访问得到
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-file.html#wxdownloadfileobject
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-network.html
     * @param obj {DownloadFileParamObject}
     */
    downloadFile(obj: params.DownloadFileParamCommonObject): Promise<any>;

    /// 媒体

    /// - 图片

    /**
     * 从本地相册选择图片或使用相机拍照
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-picture.html#wxchooseimageobject
     * @param obj
     */
    chooseImage(obj: params.ChooseImageParamCommonObject): Promise<any>;

    /**
     * 预览图片
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-picture.html#wxpreviewimageobject
     * @param obj
     */
    previewImage(obj: params.PreviewImageParamCommonObject): Promise<any>;

    /**
     * 获取图片信息
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-picture.html#wxgetimageinfoobject
     * @param obj
     */
    getImageInfo(obj: params.GetImageInfoParamCommonObject): Promise<any>;

    /**
     * 保存图片到系统相册。需要用户授权 scope.writePhotosAlbum
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-picture.html#wxsaveimagetophotosalbumobject
     * @param obj
     */
    saveImageToPhotosAlbum(obj): Promise<any>; // TODO

    /// - 录音

    /**
     * 开始录音。当主动调用wx.stopRecord，或者录音超过1分钟时自动结束录音，返回录音文件的临时文件路径。当用户离开小程序时，此接口无法调用。
     * 需要用户授权 scope.record
     * 注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 wx.getRecorderManager 接口
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-record.html#wxstartrecordobject
     * @param obj
     */
    startRecord(): void; // TODO

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
    getRecorderManager(): params.RecorderManager; // TODO

    /// - 音频播放控制

    /**
     * 开始播放语音，同时只允许一个语音文件正在播放，如果前一个语音文件还没播放完，将中断前一个语音播放
     * 注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 wx.createInnerAudioContext 接口
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-voice.html#wxplayvoiceobject
     * @param obj
     */
    playVoice(obj): Promise<any>; // TODO

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
    getBackgroundAudioPlayerState(): Promise<any>;

    /**
     * 使用后台播放器播放音乐，对于微信客户端来说，只能同时有一个后台音乐在播放。当用户离开小程序后，音乐将暂停播放；当用户点击“显示在聊天顶部”时，音乐不会暂停播放；当用户在其他小程序占用了音乐播放器，原有小程序内的音乐将停止播放
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-background-audio.html#wxplaybackgroundaudioobject
     * @param obj
     */
    playBackgroundAudio(obj): Promise<any>;

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
    seekBackgroundAudio(obj): Promise<any>;

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
    getBackgroundAudioManager(): params.BackgroundAudioManager;

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
    chooseVideo(obj?): Promise<any>; // TODO

    /**
     * 保存视频到系统相册。需要用户授权 scope.writePhotosAlbum，1.2.0开始支持
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media-video.html#wxsavevideotophotosalbumobject
     * @param obj
     */
    saveVideoToPhotosAlbum(obj): Promise<any>; // TODO

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
    saveFile(obj): Promise<any>;

    /**
     * 获取文件信息
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/getFileInfo.html
     * @param obj
     */
    getFileInfo(obj): Promise<any>;

    /**
     * 获取本地已保存的文件列表
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file.html#wxgetsavedfilelistobject
     * @param obj
     */
    getSavedFileList(): Promise<any>;

    /**
     * 获取本地文件的文件信息。此接口只能用于获取已保存到本地的文件，若需要获取临时文件信息，请使用 wx.getFileInfo 接口
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file.html#wxgetsavedfileinfoobject
     * @param obj
     */
    getSavedFileInfo(obj): Promise<any>;

    /**
     * 删除本地存储的文件
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file.html#wxremovesavedfileobject
     * @param obj
     */
    removeSavedFile(obj): Promise<any>;

    /**
     * 新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file.html#wxopendocumentobject
     * @param obj
     */
    openDocument(obj): Promise<any>;

    /// 数据缓存

    /**
     * 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxsetstorageobject
     * @param obj
     */
    setStorage(obj): Promise<any>; // TODO

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
    getStorage(obj): Promise<any>; // TODO

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
    getStorageInfo(): Promise<any>; // TODO

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
    removeStorage(obj): Promise<any>;

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
    getLocation(obj): Promise<any>;

    /**
     * 打开地图选择位置
     * 需要用户授权 scope.userLocation
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/location.html#wxchooselocationobject
     * @param obj
     */
    chooseLocation(): Promise<any>;

    /**
     * 使用微信内置地图查看位置
     * 需要用户授权 scope.userLocation
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/location.html#wxopenlocationobject
     * @param obj
     */
    openLocation(obj): Promise<any>;

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
    getSystemInfo(obj): Promise<any>;

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
    getNetworkType(): Promise<any>;

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
    startAccelerometer(): Promise<any>;

    /**
     * 停止监听加速度数据
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/accelerometer.html#wxstopaccelerometerobject
     * @param obj
     */
    stopAccelerometer(): Promise<any>;

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
    startCompass(): Promise<any>;

    /**
     * 停止监听罗盘数据
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/compass.html#wxstopcompassobject
     * @param obj
     */
    stopCompass(): Promise<any>;

    /**
     * 拨打电话
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/phonecall.html#wxmakephonecallobject
     * @param obj
     */
    makePhoneCall(obj): Promise<any>;

    /**
     * 调起客户端扫码界面，扫码成功后返回对应的结果
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/scancode.html#wxscancodeobject
     * @param obj
     */
    scanCode(obj): Promise<any>;

    /**
     * 设置系统剪贴板的内容
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/clipboard.html#wxsetclipboarddataobject
     * @param obj
     */
    setClipboardData(obj): Promise<any>;

    /**
     * 获取系统剪贴板内容
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/clipboard.html#wxgetclipboarddataobject
     * @param obj
     */
    getClipboardData(): Promise<any>;

    // TODO 蓝牙

    /**
     * 设置屏幕亮度
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device.html#wxsetscreenbrightnessobject
     * @param obj
     */
    setScreenBrightness(obj): Promise<any>;

    /**
     * 获取屏幕亮度
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device.html#wxgetscreenbrightnessobject
     * @param obj
     */
    getScreenBrightness(): Promise<any>;

    /**
     * 设置是否保持常亮状态。仅在当前小程序生效，离开小程序后设置失效
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/setKeepScreenOn.html
     * @param obj
     */
    setKeepScreenOn(obj): Promise<any>;

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
    vibrateLong(): Promise<any>;

    /**
     * 使手机发生较短时间的振动（15ms）
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device.html#wxvibrateshortobject
     * @param obj
     */
    vibrateShort(): Promise<any>;

    /**
     * 调用后，用户可以选择将该表单以“新增联系人”或“添加到已有联系人”的方式，写入手机系统通讯录，完成手机通讯录联系人和联系方式的增加
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/phone-contact.html#wxaddphonecontactobject
     * @param obj
     */
    addPhoneContact(obj): Promise<any>;

    // TODO NFC

    // TODO Wifi

    /// 界面

    // - 交互反馈

    /**
     * 显示消息提示框
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-react.html#wxshowtoastobject
     * @param obj
     */
    showToast(obj: params.ShowToastParamCommonObject): Promise<any>;

    /**
     * 显示 loading 提示框, 需主动调用 wx.hideLoading 才能关闭提示框
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-react.html#wxshowloadingobject
     * @param obj
     */
    showLoading(obj: params.ShowLoadingParamCommonObject): Promise<any>;

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
    showModal(obj: params.ShowModalParamCommonObject): Promise<any>;

    /**
     * 显示操作菜单
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-react.html#wxshowactionsheetobject
     * @param obj
     */
    showActionSheet(obj: params.ShowActionSheetParamCommonObject): Promise<any>;

    // - 设置导航条

    /**
     * 动态设置当前页面的标题
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui.html#wxsetnavigationbartitleobject
     * @param obj
     */
    setNavigationBarTitle(obj: params.SetNavigationBarTitleParamCommonObject): Promise<any>;

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
    setNavigationBarColor(obj: params.SetNavigationBarColorParamCommonObject): Promise<any>;

    // - 设置tabBar

    /**
     * 为 tabBar 某一项的右上角添加文本
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-tabbar.html#wxsettabbarbadgeobject
     * @param obj
     */
    setTabBarBadge(obj: params.SetTabBarBadgeParamCommonObject): Promise<any>;

    /**
     * 移除 tabBar 某一项右上角的文本
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-tabbar.html#wxremovetabbarbadgeobject
     * @param obj
     */
    removeTabBarBadge(obj: params.RemoveTabBarBadgeParamCommonObject): Promise<any>;

    /**
     * 显示 tabBar 某一项的右上角的红点
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-tabbar.html#wxshowtabbarreddotobject
     * @param obj
     */
    showTabBarRedDot(obj: params.ShowTabBarRedDotParamCommonObject): Promise<any>;

    /**
     * 隐藏 tabBar 某一项的右上角的红点
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-tabbar.html#wxhidetabbarreddotobject
     * @param obj
     */
    hideTabBarRedDot(obj: params.HideTabBarRedDotParamCommonObject): Promise<any>;

    /**
     * 动态设置 tabBar 的整体样式
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-tabbar.html#wxsettabbarstyleobject
     * @param obj
     */
    setTabBarStyle(obj: params.SetTabBarStyleParamCommonObject): Promise<any>;

    /**
     * 动态设置 tabBar 某一项的内容
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-tabbar.html#wxsettabbaritemobject
     * @param obj
     */
    setTabBarItem(obj: params.SetTabBarItemParamCommonObject): Promise<any>;

    /**
     * 显示 tabBar
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-tabbar.html#wxshowtabbarobject
     * @param obj
     */
    showTabBar(obj: params.ShowTabBarParamCommonObject): Promise<any>;

    /**
     * 隐藏 tabBar
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-tabbar.html#wxhidetabbarobject
     * @param obj
     */
    hideTabBar(obj: params.HideTabBarParamCommonObject): Promise<any>;

    // - 设置置顶信息

    /**
     * 动态设置置顶栏文字内容，只有当前小程序被置顶时能生效，如果当前小程序没有被置顶，也能调用成功，但是不会立即生效，只有在用户将这个小程序置顶后才换上设置的文字内容
     * 注意：调用成功后，需间隔 5s 才能再次调用此接口，如果在 5s 内再次调用此接口，会回调 fail，errMsg："setTopBarText: fail invoke too frequently"
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui.html#wxsettopbartextobject
     * @param obj
     */
    setTopBarText(obj): Promise<any>;

    // - 导航

    /**
     * 保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-navigate.html#wxnavigatetoobject
     * @param obj {NavParamObject}
     */
    navigateTo(obj: params.NavParamCommonObject): Promise<any>;

    /**
     * 关闭当前页面，跳转到应用内的某个页面
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-navigate.html#wxredirecttoobject
     * @param obj {NavParamObject}
     */
    redirectTo(obj: params.NavParamCommonObject): Promise<any>;

    /**
     * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-navigate.html#wxswitchtabobject
     * @param obj {NavParamObject}
     */
    switchTab(obj: params.NavParamCommonObject): Promise<any>;

    /**
     * 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages() 获取当前的页面栈，决定需要返回几层
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-navigate.html#wxnavigatebackobject
     * @param obj {NavigateBackParamObject}
     */
    navigateBack(obj: params.NavigateBackParamCommonObject): Promise<any>;

    /**
     * 关闭所有页面，打开到应用内的某个页面
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-navigate.html#wxrelaunchobject
     * @param obj {NavParamObject}
     */
    reLaunch(obj: params.NavParamCommonObject): Promise<any>;

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
    startPullDownRefresh(): Promise<any>;

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
    getExtConfigSync(): params.AnyObject;

    /// 开放接口

    // - 登录

    /**
     * 调用接口wx.login() 获取临时登录凭证（code）
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html#wxloginobject
     * @param obj
     */
    login(obj?): Promise<any>;

    /**
     * 校验用户当前session_key是否有效
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/signature.html#wxchecksessionobject
     * @param obj
     */
    checkSession(): Promise<any>;

    // - 授权

    /**
     * 提前向用户发起授权请求。调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。如果用户之前已经同意授权，则不会出现弹窗，直接返回成功
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/authorize.html
     * @param obj
     */
    authorize(obj): Promise<any>;

    // - 用户信息

    /**
     * 获取用户信息，withCredentials 为 true 时需要先调用 wx.login 接口
     * 需要用户授权 scope.userInfo
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/open.html#wxgetuserinfoobject
     * @param obj
     */
    getUserInfo(obj): Promise<any>;

    // - 微信支付

    /**
     * 发起微信支付
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-pay.html#wxrequestpaymentobject
     * @param obj
     */
    requestPayment(obj): Promise<any>;

    // - 转发

    /**
     * 显示当前页面的转发按钮
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/share.html#wxshowsharemenuobject
     * @param obj
     */
    showShareMenu(obj): Promise<any>;

    /**
     * 隐藏转发按钮
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/share.html#wxhidesharemenuobject
     * @param obj
     */
    hideShareMenu(): Promise<any>;

    /**
     * 更新转发属性
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/share.html#wxupdatesharemenuobject
     * @param obj
     */
    updateShareMenu(obj): Promise<any>;

    /**
     * 获取转发详细信息
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/share.html#wxgetshareinfoobject
     * @param obj
     */
    getShareInfo(obj): Promise<any>;

    // - 收货地址

    /**
     * 调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址
     * 需要用户授权 scope.address
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/address.html#wxchooseaddressobject
     * @param obj
     */
    chooseAddress(): Promise<any>;

    // - 卡券

    /**
     * 批量添加卡券
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/card.html#wxaddcardobject
     * @param obj
     */
    addCard(obj): Promise<any>;

    /**
     * 查看微信卡包中的卡券
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/card.html#wxopencardobject
     * @param obj
     */
    openCard(obj): Promise<any>;

    // - 设置

    /**
     * 调起客户端小程序设置界面，返回用户设置的操作结果
     * 注：设置界面只会出现小程序已经向用户请求过的权限
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/setting.html#wxopensettingobject
     * @param obj
     */
    openSetting(): Promise<any>;

    /**
     * 获取用户的当前设置
     * 注：返回值中只会出现小程序已经向用户请求过的权限
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/setting.html#wxgetsettingobject
     * @param obj
     */
    getSetting(): Promise<any>;

    // - 微信运动

    /**
     * 获取用户过去三十天微信运动步数，需要先调用 wx.login 接口
     * 需要用户授权 scope.werun
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/we-run.html#wxgetwerundataobject
     * @param obj
     */
    getWeRunData(obj): Promise<any>;

    // - 打开小程序

    /**
     * 打开同一公众号下关联的另一个小程序。（注：必须是同一公众号下，而非同个 open 账号下）
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/navigateToMiniProgram.html
     * @param obj
     */
    navigateToMiniProgram(obj): Promise<any>;

    /**
     * 返回到上一个小程序，只有在当前小程序是被其他小程序打开时可以调用成功
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/navigateBackMiniProgram.html
     * @param obj
     */
    navigateBackMiniProgram(obj): Promise<any>;

    // - 获取发票抬头

    /**
     * 选择用户的发票抬头
     * 需要用户授权 scope.invoiceTitle
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/chooseInvoiceTitle.html
     * @param obj
     */
    chooseInvoiceTitle(): Promise<any>;

    // - 生物认证

    /**
     * 获取本机支持的 SOTER 生物认证方式
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/checkIsSupportSoterAuthentication.html
     * @param obj
     */
    checkIsSupportSoterAuthentication(): Promise<any>;

    /**
     * 开始 SOTER 生物认证
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/startSoterAuthentication.html
     * @param obj
     */
    startSoterAuthentication(obj): Promise<any>;

    /**
     * 获取设备内是否录入如指纹等生物信息的接口
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/checkIsSoterEnrolledInDevice.html
     * @param obj
     */
    checkIsSoterEnrolledInDevice(obj): Promise<any>;

    /// 数据

    /**
     * 自定义分析数据上报接口。使用前，需要在小程序管理后台自定义分析中新建事件，配置好事件名与字段
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/analysis-report.html
     * @param eventName {String} 事件名
     * @param data {Object} 上报的自定义数据。key为配置中的字段名，value为上报的数据
     */
    reportAnalytics(eventName: string, data: params.AnyObject): void;

    /// 更新

    /**
     * 获取全局唯一的版本更新管理器，用于管理小程序更新
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/getUpdateManager.html
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/framework/operating-mechanism.html
     */
    getUpdateManager(): params.UpdateManager;

    /// 多线程

    /**
     * 创建一个 Worker 线程，并返回 Worker 实例，目前限制最多只能创建一个 Worker，创建下一个 Worker 前请调用 Worker.terminate
     * scriptPath 为 worker 的入口文件路径，需填写绝对路径
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/createWorker.html
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/framework/workers.html
     * @param scriptPath
     */
    createWorker(scriptPath: string): params.WxWorker;

    /// 调试接口

    /**
     * 设置是否打开调试开关，此开关对正式版也能生效
     * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/setEnableDebug.html
     * @param obj
     */
    setEnableDebug(obj): Promise<string>;

    /// 其他
    [key: string]: any;
}

export default WXP;
