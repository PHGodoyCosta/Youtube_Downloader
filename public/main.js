const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const electron = require("electron")
const path = require("path");
const os = require("os");
const { exec, spawn } = require("child_process");
const createMenu = require("./menu");

let mainWindow;
let pythonServer;
const platform = os.platform();

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: true,
        fullscreenable: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: true,
        },
        icon: path.join(__dirname, "static/images/mg.png"),
    });

    // Carregar um arquivo HTML para a interface gráfica
    mainWindow.loadFile(
        path.join(app.getAppPath(), "public", "templates", "index.html"),
    );
}

app.whenReady().then(() => {
    //Iniciar o servidor Flask quando o Electron iniciar
    // exec('python3 server/server.py', (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`Erro ao iniciar o Flask: ${error.message}`);
    //         return;
    //     }
    //     console.log(`Servidor Flask iniciado: ${stdout}`);
    // });

    if (platform == "linux") {
        const isPackaged = electron.app.isPackaged

        const pythonScriptPath = isPackaged
        ? path.join(__dirname, "server", "server.py") // no AppImage ou build
        : path.join(__dirname, "..", "server", "server.py"); // em dev com `npm start`

        pythonServer = spawn("python3", [pythonScriptPath]);
    } else if (platform == "win32") {
        pythonServer = spawn(
            path.join(app.getAppPath(), "server", "server_mg_conversor.exe"),
        );
    }

    pythonServer.stdout.on("data", (data) => {
        console.log(`Servidor Flask iniciado: ${data}`);
    });

    pythonServer.stderr.on("data", (data) => {
        console.error(`Erro no servidor Flask: ${data}`);
    });

    pythonServer.on("close", (code) => {
        console.log(`Servidor Flask encerrado com código ${code}`);
    });

    console.log(`Meu PID é ${pythonServer.pid}`);
    createMenu();
    setTimeout(() => {
        createWindow();
    }, 3500);

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

ipcMain.handle("select-directory", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ["openDirectory"],
    });
    console.log(`Diretório: ${result.filePaths[0]}`);
    return result.filePaths[0]; // Retorna o caminho do diretório selecionado
});

ipcMain.handle("get-download-path", () => {
    const downloadsPath = app.getPath("downloads");
    return downloadsPath;
});

// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit();
//     }
// });

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        if (pythonServer) {
            pythonServer.kill(); // Finaliza o processo Python
            console.log("Servidor Flask encerrado ao fechar todas as janelas.");
        }
        app.quit();
    }
});

app.on("quit", () => {
    if (pythonServer) {
        pythonServer.kill();
        exec(
            `taskkill /f /im server_mg_conversor.exe`,
            (err, stdout, stderr) => {
                if (err) {
                    console.error(`Erro ao finalizar servidor Flask: ${err}`);
                    return;
                }
                console.log("Servidor Flask encerrado com taskkill.");
            },
        );
    }
});

process.on("exit", () => {
    if (pythonServer) {
        exec(
            `taskkill /f /im server_mg_conversor.exe`,
            (err, stdout, stderr) => {
                if (err) {
                    console.error(`Erro ao finalizar servidor Flask: ${err}`);
                    return;
                }
                console.log("Servidor Flask encerrado com taskkill.");
            },
        );
        pythonServer.kill(); // Finaliza o servidor Flask quando o processo Node.js sair
        console.log("Servidor Flask encerrado ao sair do processo.");
    }
});
