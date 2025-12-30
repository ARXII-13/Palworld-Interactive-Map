import Store from "electron-store";

interface SettingsStore {
    mapSettings?: any;
    appSettings?: any;
}

const store = new Store<SettingsStore>();

export async function loadSettings(): Promise<SettingsStore> {
    return store.store;
}

export async function saveSettings(settings: SettingsStore) {
    store.store = settings;
}
