const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true
        }
    });

    // Carregar um arquivo HTML para a interface gráfica
    mainWindow.loadFile('src/templates/index.html');
}

app.whenReady().then(() => {
    // Iniciar o servidor Flask quando o Electron iniciar
    // exec('python3 server/server.py', (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`Erro ao iniciar o Flask: ${error.message}`);
    //         return;
    //     }
    //     console.log(`Servidor Flask iniciado: ${stdout}`);
    // });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

ipcMain.handle('select-directory', async() => {
    console.log("OII")
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });
    console.log(`Diretório: ${result.filePaths[0]}`)
    return result.filePaths[0]; // Retorna o caminho do diretório selecionado
});

ipcMain.handle('get-download-path', () => {
    const downloadsPath = app.getPath('downloads'); 
    return downloadsPath;
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
