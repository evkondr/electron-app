"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const axios_1 = require("axios");
const node_fs_1 = require("node:fs");
const promises_1 = require("fs/promises");
const csv_writer_1 = require("csv-writer");
const path_1 = __importDefault(require("path"));
const services_1 = __importDefault(require("./services"));
const isDev = process.env.NODE_ENV === 'development';
console.log(process.env.NODE_ENV);
const createWindow = () => {
    const win = new electron_1.BrowserWindow({
        width: isDev ? 1000 : 500,
        height: 500,
        resizable: isDev,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            contextIsolation: true
        },
        autoHideMenuBar: true,
    });
    if (isDev) {
        win.webContents.openDevTools();
    }
    win.loadFile(path_1.default.join(__dirname, '..', 'index.html'));
    // FETCH TOKEN
    electron_1.ipcMain.on('fetch-token', (event, args) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { username, password } = args;
            const response = yield services_1.default.login(username, password);
            event.reply('fetch-token-response', {
                status: 200,
                result: response
            });
        }
        catch (error) {
            if ((0, axios_1.isAxiosError)(error)) {
                if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                    event.reply('fetch-data-error', {
                        message: 'Неверный пользователь или пароль'
                    });
                }
                else {
                    event.reply('fetch-data-error', {
                        message: error.message
                    });
                }
            }
            else {
                event.reply('fetch-data-error', {
                    message: "Неизвестная ошибка"
                });
            }
        }
    }));
    // FETCH DATA
    electron_1.ipcMain.on('fetch-data', (event, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { token } = args;
            const response = yield services_1.default.fetchData(token);
            event.reply('fetch-data-response', {
                result: response
            });
        }
        catch (error) {
            if ((0, axios_1.isAxiosError)(error)) {
                event.reply('fetch-data-error', {
                    message: error.message
                });
            }
            else {
                event.reply('fetch-data-error', {
                    message: "Неизвестная ошибка"
                });
            }
        }
    }));
    // EXPORT
    electron_1.ipcMain.on('export-data', (event, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { data } = args;
            const dataToCSV = [];
            data.forEach((item, index) => {
                item.props = JSON.stringify(item.props);
                item.waits = JSON.stringify(item.waits);
                item.images = JSON.stringify(item.images);
                dataToCSV.push(item);
            });
            let header = [];
            const keys = Object.keys(dataToCSV[0]);
            for (let key of keys) {
                header.push({
                    id: key,
                    title: key,
                });
            }
            (0, node_fs_1.access)(path_1.default.join(__dirname, '..', 'csv'), node_fs_1.constants.R_OK | node_fs_1.constants.W_OK, (err) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    yield (0, promises_1.mkdir)(path_1.default.join(__dirname, '..', 'csv'));
                }
                const writer = (0, csv_writer_1.createObjectCsvWriter)({
                    path: path_1.default.resolve(__dirname, '..', 'csv', `products-${Date.now()}.csv`),
                    header,
                });
                yield writer.writeRecords(dataToCSV);
                event.reply('export-data-response', {
                    status: 200,
                    message: 'Данные экспортированы!'
                });
            }));
        }
        catch (error) {
            event.reply('fetch-data-error', {
                status: 500,
                message: error.message
            });
        }
    }));
};
electron_1.app.whenReady().then(() => {
    createWindow();
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
