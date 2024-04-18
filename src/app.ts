import { app, BrowserWindow, ipcMain } from 'electron';
import axios from 'axios';
import path from 'path'
import APISerives from './services';

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
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})