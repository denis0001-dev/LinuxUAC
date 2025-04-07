"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// noinspection ES6UnusedImports
require("electron");
const main_1 = require("electron/main");
const child_process_1 = require("child_process");
require('@electron/remote/main').initialize();
const createWindow = () => {
    const win = new main_1.BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        fullscreen: true,
        show: false,
        transparent: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            webviewTag: true,
            sandbox: false,
            nodeIntegrationInSubFrames: true,
        },
        icon: "icons/icon.png"
    });
    win.loadFile('src/index.html');
    process.argv.forEach(arg => {
        if (arg.startsWith("--app=")) {
            win.app = arg.replace("--app=", "");
        }
    });
    win.argv = process.argv;
    win.mainProcess = process;
    (0, child_process_1.exec)("env | xargs", (err, stdout) => {
        if (!err) {
            win.env = stdout.toString();
        }
    });
    require("@electron/remote/main").enable(win.webContents);
};
main_1.app.whenReady().then(() => {
    createWindow();
    main_1.app.on('activate', () => {
        if (main_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
main_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        main_1.app.quit();
    }
});
main_1.ipcMain.on("close", () => {
    main_1.app.quit();
});
