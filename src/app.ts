import { app, BrowserWindow, ipcMain } from 'electron';
import { AxiosError, isAxiosError } from 'axios';
import { access, constants } from 'node:fs';
import { mkdir } from 'fs/promises'
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path'
import APISerives from './services';
import { IProduct } from './types';

interface IHeader {
  id: string,
  title: string
}
const isDev = process.env.NODE_ENV === 'development';
console.log(process.env.NODE_ENV) 
const createWindow = () => {
  const win = new BrowserWindow({
    width: isDev ? 1000 : 500,
    height: 500,
    resizable: isDev,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    },
    autoHideMenuBar: true,
  })
  if (isDev) {
    win.webContents.openDevTools()
  }
  win.loadFile(path.join(__dirname, '..', 'index.html'))
  // FETCH TOKEN
  ipcMain.on('fetch-token', async (event, args) => {
    try {
      const {username, password} = args;
       const response = await APISerives.login(username, password)
       event.reply('fetch-token-response', {
        status: 200,
        result: response
       });
    } catch (error) {
      if (isAxiosError(error)) {
        if(error.response?.status === 401) {
          event.reply('fetch-data-error', {
            message: 'Неверный пользователь или пароль'
           });
        } else {
          event.reply('fetch-data-error', {
            message: error.message
           });
        }
      } else {
        event.reply('fetch-data-error', {
          message: "Неизвестная ошибка"
         });
      }
    }
 });
 // FETCH DATA
 ipcMain.on('fetch-data', async (event, args) => {
    try {
      const { token } = args;
      const response = await APISerives.fetchData(token)
      event.reply('fetch-data-response', {
        result: response
      });
    } catch (error:any) {
      if (isAxiosError(error)) {
        event.reply('fetch-data-error', {
          message: error.message
         });
      } else {
        event.reply('fetch-data-error', {
          message: "Неизвестная ошибка"
         });
      }
    }
  });
  // EXPORT
  ipcMain.on('export-data', async (event, args) => {
    try {
      const { data } = args as { data: IProduct[]};
      const dataToCSV:IProduct[] = []
      data.forEach((item, index) => {
        item.props = JSON.stringify(item.props)
        item.waits = JSON.stringify(item.waits)
        item.images = JSON.stringify(item.images)
        dataToCSV.push(item as IProduct)
      })
      let header:IHeader[] = [];
      const keys = Object.keys(dataToCSV[0])
      for (let key of keys) {
        header.push({
          id: key,
          title: key,
        })
      }
      access(path.join(__dirname, '..', 'csv'), constants.R_OK | constants.W_OK, async (err) => {
        if (err) {
          await mkdir(path.join(__dirname, '..', 'csv'))
        }
        const writer = createObjectCsvWriter({
          path: path.resolve(__dirname, '..', 'csv', `products-${Date.now()}.csv`),
          header, 
        })
        await writer.writeRecords(dataToCSV)
        event.reply('export-data-response', {
          status: 200,
          message: 'Данные экспортированы!'
        })
      }); 
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