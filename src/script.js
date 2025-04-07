"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const main_1 = require("electron/main");
var utils;
(function (utils) {
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    utils.delay = delay;
    function shell(command) {
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(command, (error, stdout) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(stdout.trim());
                }
            });
        });
    }
    utils.shell = shell;
    /*export function escapeShell(str: string): string {
        return str
            .replace(/`/g, "\\`")
            .replace(/"/g, "\\\"")
            .replace(/'/g, "\\'")
    }*/
    async function close(win) {
        document.body.classList.add("notloaded");
        await delay(500);
        win.close();
    }
    utils.close = close;
    /*export async function hide(win: ExBrowserWindow) {
        document.body.classList.add("notloaded");
        await delay(500);
        win.hide();
    }*/
})(utils || (utils = {}));
var uac;
(function (uac) {
    var shell = utils.shell;
    var delay = utils.delay;
    var close = utils.close;
    /*import escapeShell = utils.escapeShell;
    import hide = utils.hide;*/
    const win = require('@electron/remote').getCurrentWindow();
    const wallpaperCommand = "kreadconfig5 " +
        "--file ~/.config/plasma-org.kde.plasma.desktop-appletsrc " +
        "--group Containments " +
        "--group 1 " +
        "--group Wallpaper " +
        "--group org.kde.image " +
        "--group General " +
        "--key Image" +
        "| sed -E \"s/^(\\/.*)$/file:\\/\\/\\1/\"" +
        "| sed -E \"s/^(file:\\/\\/\\/usr\\/share\\/wallpapers\\/\\w+\\/)$/\\1contents\\/images\\/1920x1080.jpg/\"" +
        "| xargs";
    async function main() {
        const close_button = document.getElementById("close_button");
        const yes_button = document.getElementById("yes");
        const no_button = document.getElementById("no");
        const password_inp = document.getElementById("admPassword");
        const invalid_password = document.getElementById("invalid");
        const wallpaper = await shell(wallpaperCommand);
        const user = await shell("echo $USER");
        const hostname = await shell("hostname");
        async function confirm() {
            shell(`echo "${password_inp.value}" | su -c true "$USER"`).then(async () => {
                invalid_password.style.display = "none";
                console.log("writing to stdout");
                process.stdout.write(`${password_inp.value}\n`);
                console.log("sudo -K");
                await delay(500);
                await shell("sudo -K");
                console.log("exit");
                close(win);
                main_1.app.quit();
                return;
                /*await hide(win);
                const proc = spawn(
                    "bash",
                    [
                        "-c",
                        `echo "${password_inp.value}" | env "${win.env}" sudo -S bash -c "${escapeShell(win.app)}"`
                    ],
                    {
                        stdio: 'inherit'
                    }
                );
                proc.on("close", async (code) => {
                    await delay(500);
                    await shell("sudo -K");
                    process.exitCode = code || 0;
                    win.close();
                    app.quit();
                });*/
            }, () => {
                invalid_password.style.display = "block";
            });
        }
        // Initialize
        close_button.addEventListener('click', () => close(win));
        no_button.addEventListener('click', () => close(win));
        yes_button.addEventListener('click', confirm);
        password_inp.addEventListener("keydown", (e) => {
            if ((e.code || e.key) === "Enter") {
                confirm();
            }
        });
        document.querySelector("#app > .name").textContent = win.app;
        document.querySelector("#admInput > .data > .user").textContent = user;
        document.querySelector("#admInput >.data > .computer").textContent = `${hostname}\\${user}`;
        document.body.style.backgroundImage = `url("${wallpaper}")`;
        await delay(500);
        document.body.classList.remove("notloaded");
        await (new Audio("resources/uac.mp3")).play();
    }
    document.addEventListener("DOMContentLoaded", main);
})(uac || (uac = {}));
