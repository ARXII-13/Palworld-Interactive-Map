import { ref } from "vue";
import type { MarkerSourceMode } from "@/types/map";

const SETTINGS_KEY = "palmap-app-settings";

export interface AppSettings {
    markerSourceMode: MarkerSourceMode;
    ue4ssFolderPath?: string;
}

export const defaultSettings: AppSettings = {
    markerSourceMode: "game",
    ue4ssFolderPath: undefined,
};

export const appSettings = ref<AppSettings>(defaultSettings);

export async function loadAppSettings(): Promise<AppSettings> {
    if (window.electron?.loadSettings) {
        const allSettings = await window.electron.loadSettings();
        if (allSettings.appSettings) {
            appSettings.value = allSettings.appSettings as AppSettings;
        } else {
            appSettings.value = defaultSettings;
        }
    } else {
        const stored = localStorage.getItem(SETTINGS_KEY);
        appSettings.value = stored ? (JSON.parse(stored) as AppSettings) : defaultSettings;
    }

    return appSettings.value;
}

export async function saveAppSettings(settings: AppSettings) {
    if (window.electron?.saveSettings) {
        const allSettings = await window.electron.loadSettings();
        await window.electron.saveSettings({
            ...allSettings,
            appSettings: settings,
        });
    } else {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
}
