const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    pickFolder: async () => {
        const result = await ipcRenderer.invoke("pick-folder");
        return result;
    },

    saveSettings: async (settings) => ipcRenderer.invoke("save-settings", settings),
    loadSettings: async () => ipcRenderer.invoke("load-settings"),
});
