'use strict';

// 常量定义
module.exports = {
  // 公共变量
  COMMON_DEBUG: false, // 是否为调试模式

  // 登录窗口相关
  LOGIN_TITLE: '登录',
  LOGIN_WINDOW_SIZE_WIDTH: 350,
  LOGIN_WINDOW_SIZE_HEIGHT: 550,
  LOGIN_SUCCESS_EVENT_TOPIC: 'login-success',

  // 上传窗口相关
  UPLOADER_TITLE: '上传音乐',
  UPLOADER_WINDOW_SIZE_WIDTH: 800,
  UPLOADER_WINDOW_SIZE_HEIGHT: 600,
  UPLOADER_WINDOW_SIZE_MIN_WIDTH: 350,
  UPLOADER_WINDOW_SIZE_MIN_HEIGHT: 550,
  // UPLOADER_UPLOAD_INTERVAL_TIME: 100, // 上传间隔，避免频繁请求接口导致失败，也可以用下面这种配置方式
  UPLOADER_UPLOAD_INTERVAL_TIME: {
    // 上传间隔会在 min 和 max 之间随机，更有效的避免频率限制导致的失败
    Min: 1000,
    Max: 3000,
  },

  // 网易云音乐api
  CLOUD_MUSIC_SUCCESS_STATUS: 200,
  // 二维码状态
  CLOUD_MUSIC_SCAN_EXPIRE_STATUS: 800,
  CLOUD_MUSIC_SCAN_WAIT_STATUS: 801,
  CLOUD_MUSIC_SCAN_FINISHED_STATUS: 803,
};
