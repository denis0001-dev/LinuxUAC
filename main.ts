// noinspection ES6UnusedImports
import 'electron';
import {app, BrowserWindow, ipcMain} from 'electron/main';
import {exec} from "child_process";

require('@electron/remote/main').initialize();

const createWindow = () => {
    const win = new BrowserWindow({
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
            (win as any).app = arg.replace("--app=", "");
        }
    });
    (win as any).argv = process.argv;
    (win as any).mainProcess = process;
    exec("env | xargs", (err, stdout) => {
        if (!err) {
            (win as any).env = stdout.toString();
        }
    })

    require("@electron/remote/main").enable(win.webContents);
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on("close",() => {
    app.quit();
});