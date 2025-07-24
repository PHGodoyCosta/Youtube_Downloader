const { app, Menu, MenuItem } = require("electron")

function createMenu() {
    const menu = Menu.buildFromTemplate([
        {
            label: "Editar",
            submenu: [
                {
                    label: "Voltar",
                    role: "undo"
                },
                {
                    label: "Copiar",
                    role: "copy"
                },
                {
                    label: "Colar",
                    role: "paste"
                },
                {
                    label: ""
                }
            ]
        }
    ])
    Menu.setApplicationMenu(menu)
}

module.exports = createMenu