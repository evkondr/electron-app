import { ipcRenderer, contextBridge } from 'electron';
import APISerives from './services';

contextBridge.exposeInMainWorld('api', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  login: async (username: string, password: string) => {
    const result = await APISerives.login(username, password)
    return result
  }
})