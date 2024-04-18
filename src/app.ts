import { app, BrowserWindow } from 'electron';
import path from 'path'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 500,
    height: 500
  })
  win.loadFile(path.join(__dirname, '..', 'index.html'))
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})