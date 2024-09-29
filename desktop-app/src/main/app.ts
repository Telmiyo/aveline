/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import WindowManager from './window';

/**
 * Represents the AppUpdater class
 * @class
 */
class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

/**
 * Represents the Apps lifecycle class
 * @class
 */
class App {
  private windowManager: WindowManager | null = null;

  constructor() {
    this.initSourceMapSupport();
    this.initDebugTools();

    app.on('window-all-closed', this.onWindowAllClosed);
    app.on('activate', this.onActivate);

    app
      .whenReady()
      .then(this.onReady)
      .catch(this.onError);
  }
  // enhances error handling in production
  private initSourceMapSupport() {
    if (process.env.NODE_ENV === 'production') {
      const sourceMapSupport = require('source-map-support');
      sourceMapSupport.install();
    }
  }

  // electron debugging tools
  private initDebugTools(): void {
    const isDebug =
      process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

    if (isDebug) {
      require('electron-debug')();
    }

  }

  // Called when Electron app is ready
  private onReady = () => {
    this.windowManager = new WindowManager();
    new AppUpdater();
  };

  // Called when all windows are closed (except on macOS)
  private onWindowAllClosed = () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  };

  // Called when the app is activated (e.g., when clicking on dock icon on macOS)
  private onActivate = () => {
    if (this.windowManager?.getMainWindow() === null) {
      this.windowManager = new WindowManager();
    }
  };

  // Handle app-level errors
  private onError = (err: Error) => {
    log.error('App failed to initialize:', err);
  };
}
new App();
