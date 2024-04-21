"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('process', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});
electron_1.contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => electron_1.ipcRenderer.send(channel, data),
    on: (channel, callback) => electron_1.ipcRenderer.on(channel, (event, ...args) => callback(...args))
});
