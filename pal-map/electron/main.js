const { app, BrowserWindow } = require("electron");
const path = require("path");
const { fork } = require("child_process");

let mainWindow;
let backendProcess;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "Palworld Interactive Map",
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // Wait for backend to boot
    setTimeout(() => {
        mainWindow.loadURL("http://localhost:3000");
    }, 1000);

    mainWindow.on("closed", () => {
        if (backendProcess) backendProcess.kill();
        mainWindow = null;
    });
}

app.on("ready", () => {
    // ✅ Run your backend server directly
    const serverPath = path.join(__dirname, "../backend/build/server.js");
    backendProcess = fork(serverPath, [], {
        cwd: path.dirname(serverPath),
        stdio: "inherit",
    });

    createWindow();
});

app.on("window-all-closed", () => {
    if (backendProcess) backendProcess.kill();
    app.quit();
});
