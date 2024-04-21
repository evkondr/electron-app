import { ipcRenderer, contextBridge, IpcRenderer } from 'electron';
import APISerives from './services';

contextBridge.exposeInMainWorld('process', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
})


contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel:string, data:any) => ipcRenderer.send(channel, data),
  on: (channel:string, callback:any) => ipcRenderer.on(channel, (event, ...args) => callback(...args))
})