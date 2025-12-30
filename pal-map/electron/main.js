const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { fork } = require("child_process");

let mainWindow;
let backendProcess;
const isDev = !app.isPackaged;
const PORT = 8013;

const preloadPath = isDev
    ? path.join(__dirname, "preload.js")
    : path.join(process.resourcesPath, "app.asar.unpacked", "preload.js");

const appDataPath = process.env.APPDATA || ".";
const userDataPath = path.join(appDataPath, "palmap-desktop");
const settingsFile = path.join(appDataPath, "settings.json");

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "Palworld Interactive Map",
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // Wait for backend to boot
    setTimeout(() => {
        mainWindow.loadURL(`http://localhost:${PORT}`);
    }, 1000);

    mainWindow.on("closed", () => {
        if (backendProcess) backendProcess.kill();
        mainWindow = null;
    });
}

ipcMain.handle("pick-folder", async () => {
    const result = await dialog.showOpenDialog({
        properties: ["openDirectory"],
    });

    if (result.canceled || result.filePaths.length === 0) {
        return null;
    }

    return result.filePaths[0];
});

ipcMain.handle("save-settings", async (event, settings) => {
    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
    return true;
});

ipcMain.handle("load-settings", async () => {
    if (!fs.existsSync(settingsFile)) return null;
    return JSON.parse(fs.readFileSync(settingsFile, "utf-8"));
});

app.on("ready", () => {
    // ✅ Run your backend server directly
    const serverPath = isDev
        ? path.join(__dirname, "../backend/build/server.js")
        : path.join(process.resourcesPath, "backend", "build", "server.js");

    console.log("📦 Backend path:", serverPath);
    console.log("💾 Persistent data dir:", userDataPath);

    backendProcess = fork(serverPath, [], {
        cwd: path.dirname(serverPath),
        env: {
            ...process.env,
            ELECTRON_APP_DATA: userDataPath,
        },
        stdio: "inherit",
    });
    createWindow();
});

app.on("window-all-closed", () => {
    if (backendProcess) backendProcess.kill();
    app.quit();
});
