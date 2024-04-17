"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var createWindow = function () {
    var win = new electron_1.BrowserWindow({
        width: 500,
        height: 500
    });
    win.loadFile('index.html');
};
electron_1.app.whenReady().then(function () {
    createWindow();
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
