// noinspection ES6UnusedImports
import * as electron from 'electron';
import {contextBridge, ipcRenderer} from 'electron/renderer';

/* contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title',title)
})

contextBridge.exposeInMainWorld('electronAPI',{
    close_window: () => ipcRenderer.send('close-window') 
}) */