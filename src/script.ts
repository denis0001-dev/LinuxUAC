import {exec, /*spawn*/} from 'child_process';
import {app, BrowserWindow} from "electron/main";
import Process = NodeJS.Process;

namespace utils {
    export function delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    export function shell(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stdout.trim());
                }
            });
        });
    }

    export async function close(win: ExBrowserWindow, code: number = 1) {
        document.body.classList.add("notloaded");
        await delay(500);
        win.mainProcess.exitCode = code;
        win.close();
    }
}

interface ExBrowserWindow extends BrowserWindow {
    app: string;
    env: string;
    argv: string[];
    mainProcess: Process;
}

namespace uac {
    import shell = utils.shell;
    import delay = utils.delay;
    import close = utils.close;
    /*import escapeShell = utils.escapeShell;
    import hide = utils.hide;*/

    const win: ExBrowserWindow = require('@electron/remote').getCurrentWindow();

    const wallpaperCommand =
        "kreadconfig5 " +
        "--file ~/.config/plasma-org.kde.plasma.desktop-appletsrc " +
        "--group Containments " +
        "--group 1 " +
        "--group Wallpaper " +
        "--group org.kde.image " +
        "--group General " +
        "--key Image" +
        "| sed -E \"s/^(\\/.*)$/file:\\/\\/\\1/\"" +
        "| sed -E \"s/^(file:\\/\\/\\/usr\\/share\\/wallpapers\\/\\w+\\/)$/\\1contents\\/images\\/1920x1080.jpg/\"" +
        "| xargs"

    async function main() {
        const close_button = document.getElementById("close_button")!!;
        const yes_button = document.getElementById("yes")!!;
        const no_button = document.getElementById("no")!!;
        const password_inp = document.getElementById("admPassword") as HTMLInputElement;
        const invalid_password = document.getElementById("invalid")!!;

        const wallpaper = await shell(wallpaperCommand);
        const user = await shell("echo $USER");
        const hostname = await shell("hostname");

        async function confirm() {
            shell(
                `echo "${password_inp.value}" | su -c true "$USER"`
            ).then(
                async () => {
                    invalid_password.style.display = "none";
                    process.stdout.write(`${password_inp.value}\n`);
                    await delay(500);
                    await shell("sudo -K");
                    win.mainProcess.exitCode = 0;
                    close(win, 0);
                    app.quit();
                },
                () => {
                    invalid_password.style.display = "block";
                }
            );
        }

        // Initialize
        close_button.addEventListener('click',() => close(win));
        no_button.addEventListener('click', () => close(win));
        yes_button.addEventListener('click', confirm);
        password_inp.addEventListener("keydown", (e) => {
            if ((e.code || e.key) === "Enter") {
                confirm();
            }
        });

        document.querySelector("#app > .name")!!.textContent = win.app;
        document.querySelector("#admInput > .data > .user")!!.textContent = user;
        document.querySelector("#admInput >.data > .computer")!!.textContent = `${hostname}\\${user}`;

        document.body.style.backgroundImage = `url("${wallpaper}")`;


        await delay(500);
        document.body.classList.remove("notloaded");

        await (new Audio("resources/uac.mp3")).play();
    }

    document.addEventListener("DOMContentLoaded", main)
}