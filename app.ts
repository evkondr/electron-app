import { app, BrowserWindow } from 'electron';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 500,
    height: 500
  })
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})