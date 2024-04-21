import { app, BrowserWindow, ipcMain } from 'electron';
// import { mkConfig, generateCsv, asString } from "export-to-csv";
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path'
import APISerives from './services';
import { IProduct } from './types';
import { writeFile } from "node:fs";
import { Buffer } from "node:buffer";

// const csvConfig = mkConfig({ useKeysAsHeaders: true });

try {
  require('electron-reloader')(module)
} catch (_) {}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  })
  win.loadFile(path.join(__dirname, '..', 'index.html'))
  win.webContents.openDevTools()
  // FETCH TOKEN
  ipcMain.on('fetch-token', async (event, args) => {
    try {
      const {username, password} = args;
       const response = await APISerives.login(username, password)
       event.reply('fetch-token-response', {
        status: 200,
        result: response
       });
    } catch (error:any) {
      event.reply('fetch-data-error', {
        status: 500,
        message: error.message
       });
    }
 });
 // FETCH DATA
 ipcMain.on('fetch-data', async (event, args) => {
    try {
      const { token } = args;
      const response = await APISerives.fetchData(token)
      event.reply('fetch-data-response', {
        status: 200,
        result: response
      });
    } catch (error:any) {
      event.reply('fetch-data-error', {
        status: 500,
        message: error.message
      });
    }
  });
  // EXPORT
  ipcMain.on('export-data', async (event, args) => {
    try {
      const { data } = args as { data: [IProduct[]]};
      const dataToCSV:IProduct[] = []
      data.forEach((item) => dataToCSV.concat(item))
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
      const writer = createObjectCsvWriter({
        path: path.resolve(__dirname, 'products.csv'),
        header, 
      })
      await writer.writeRecords(dataToCSV)
      event.reply('export-data-response', {
        status: 200,
        message: 'Данные экспортированы!'
      })
    } catch (error:any) {
      event.reply('fetch-data-error', {
        status: 500,
        message: error.message
      });
    }
  });
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})