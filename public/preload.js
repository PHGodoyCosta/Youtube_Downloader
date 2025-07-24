const { contextBridge, ipcRenderer } = require('electron');

// Expondo uma API para o renderer process acessar o seletor de diretório
contextBridge.exposeInMainWorld('electronAPI', {
    selectDirectory: () => {
        console.log("Preload: Selecting directoty")
        return ipcRenderer.invoke('select-directory')
    },
    
    getDownloadPath: () => {
        return ipcRenderer.invoke("get-download-path")
    }
});