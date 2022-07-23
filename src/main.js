const { app, ipcMain } = require('electron');

const LoginWindow = require('./windows/controller/login');
const UploaderWindow = require('./windows/controller/uploader');
const SignIn = require('./windows/controller/signIn');

const Logger = require('./common/logger');
const Const = require('./common/const');
const { PageEvent } = require('./common/event');
const Listen = require('./windows/controller/listen');

class CloudUploader {
  constructor() {
    this.loginWindow = null;
    this.uploaderWindow = null;
    this.logger = null;
    this.signIn = null;
    this.listen = null;

    // 初始化
    this.init();
  }

  init() {
    this.logger = new Logger('CloudUploader');
    // 签到模块
    this.signIn = new SignIn();

    // 刷歌模块
    this.listen = new Listen();

    this.initApp();
  }

  initApp() {
    app.on('ready', () => {
      this.activeWindow();

      ipcMain.on('login-by-account', (event, data) => {
        this.logger.log('receive login-by-account event!', data);
        this.loginWindow.accountLogin(data);
      });

      ipcMain.on('logout', (event) => {
        this.logger.log('receive logout event!');
        this.activeLoginWindow(true);
      });

      ipcMain.on('auto-sign', (event, flag) => {
        this.logger.log('receive auto-sign-in-set event!', flag);
        this.signIn.asyncState();
      });

      // uploader
      ipcMain.on('file-select', (event) => {
        this.logger.log('receive file-select event!');
        this.uploaderWindow.fileSelect();
      });

      ipcMain.on('drag-select', (event, files) => {
        this.logger.log('receive drag-select event!', files);
        this.uploaderWindow.startUpload(files);
      });

      ipcMain.on('auto-listen', (event, flag) => {
        this.logger.log('receive auto-listen-set event!', flag);
        this.listen.asyncState();
      });

      // 登录成功
      PageEvent.on(Const.LOGIN_SUCCESS_EVENT_TOPIC, () => {
        this.activeUploaderWindow();
      });

      // 退出登录
      PageEvent.on(Const.LOGIN_LOGOUT_EVENT_TOPIC, () => {
        this.activeLoginWindow(true);
      });

      // 签到成功
      PageEvent.on(Const.SIGN_IN_SIGNED_EVENT_TOPIC, () => {
        this.uploaderWindow.sendSignInSuccess();
      });

      // 刷歌成功
      PageEvent.on(Const.LISTEN_FINISHED_EVENT_TOPIC, () => {
        this.uploaderWindow.sendListenFinished();
      });
    });

    app.on('activate', () => {
      this.logger.info('主窗口激活事件 activate～');
      this.activeWindow();
    });

    app.on('window-all-closed', async () => {
      this.logger.info('主窗口关闭事件 window-all-closed～', process.platform);
      // 处理 UnhandledPromiseRejectionWarning: TypeError: Object has been destroyed
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  async activeWindow() {
    this.logger.info(`主窗口激活，是否登录: ${await LoginWindow.checkLogin()}`);
    if (!(await LoginWindow.checkLogin())) {
      this.activeLoginWindow();
    } else {
      this.activeUploaderWindow();
    }
  }

  activeLoginWindow(logout) {
    if (logout) {
      LoginWindow.logout();
    }

    if (this.loginWindow) {
      this.loginWindow.show();
    } else {
      this.loginWindow = new LoginWindow();
    }

    if (this.uploaderWindow) {
      this.uploaderWindow.hide();
    }
  }

  activeUploaderWindow() {
    if (this.uploaderWindow) {
      this.uploaderWindow.show();
    } else {
      this.uploaderWindow = new UploaderWindow();
    }

    if (this.loginWindow) {
      this.loginWindow.hide();
    }
  }
}

new CloudUploader();
