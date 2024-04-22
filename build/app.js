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
// import { mkConfig, generateCsv, asString } from "export-to-csv";
const csv_writer_1 = require("csv-writer");
const path_1 = __importDefault(require("path"));
const services_1 = __importDefault(require("./services"));
let cred = "";
// const csvConfig = mkConfig({ useKeysAsHeaders: true });
try {
    require('electron-reloader')(module);
}
catch (_) { }
const createWindow = () => {
    const win = new electron_1.BrowserWindow({
        width: 1000,
        height: 1000,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            contextIsolation: true
        },
    });
    win.loadFile(path_1.default.join(__dirname, '..', 'index.html'));
    win.webContents.openDevTools();
    // FETCH TOKEN
    electron_1.ipcMain.on('fetch-token', (event, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { username, password } = args;
            const response = yield services_1.default.login(username, password);
            event.reply('fetch-token-response', {
                status: 200,
                result: response
            });
        }
        catch (error) {
            event.reply('fetch-data-error', {
                status: 500,
                message: error.message
            });
        }
    }));
    // FETCH DATA
    electron_1.ipcMain.on('fetch-data', (event, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { token } = args;
            const response = yield services_1.default.fetchData(token);
            event.reply('fetch-data-response', {
                status: 200,
                result: response
            });
        }
        catch (error) {
            event.reply('fetch-data-error', {
                status: 500,
                message: error.message
            });
        }
    }));
    // EXPORT
    electron_1.ipcMain.on('export-data', (event, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { data } = args;
            const dataToCSV = [];
            data.forEach((item) => dataToCSV.concat(item));
            const header = [
                {
                    id: 'article',
                    title: 'article'
                },
                {
                    id: 'brand',
                    title: 'brand'
                }
            ];
            const writer = (0, csv_writer_1.createObjectCsvWriter)({
                path: path_1.default.resolve(__dirname, 'products.csv'),
                header,
            });
            yield writer.writeRecords(dataToCSV);
            event.reply('export-data-response', {
                status: 200,
                message: 'Данные экспортированы!'
            });
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
