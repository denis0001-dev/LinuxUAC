"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_fuses_1 = require("@electron-forge/plugin-fuses");
const fuses_1 = require("@electron/fuses");
module.exports = {
    packagerConfig: {
        asar: true,
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {},
        },
        {
            name: '@electron-forge/maker-deb',
            config: {
                scripts: {
                    postinst: "./postinst.sh",
                    prerm: "./prerm.sh"
                }
            },
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {},
        },
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {},
        },
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new plugin_fuses_1.FusesPlugin({
            version: fuses_1.FuseVersion.V1,
            [fuses_1.FuseV1Options.RunAsNode]: false,
            [fuses_1.FuseV1Options.EnableCookieEncryption]: true,
            [fuses_1.FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [fuses_1.FuseV1Options.EnableNodeCliInspectArguments]: false,
            [fuses_1.FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [fuses_1.FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
};
