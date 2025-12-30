import { ref } from "vue";

const SETTINGS_KEY = "palmap-map-settings";

export interface MapSettings {
    hideDiscoveredMarkers: boolean;
    appliedFilters?: string[];
}

export const defaultMapSettings: MapSettings = {
    hideDiscoveredMarkers: false,
    appliedFilters: [],
};

export const mapSettings = ref<MapSettings>(defaultMapSettings);

export async function loadMapSettings(): Promise<MapSettings> {
    if (window.electron?.loadSettings) {
        const allSettings = await window.electron.loadSettings();
        if (allSettings.mapSettings) {
            mapSettings.value = allSettings.mapSettings as MapSettings;
        } else {
            mapSettings.value = defaultMapSettings;
        }
    } else {
        const stored = localStorage.getItem(SETTINGS_KEY);
        mapSettings.value = stored ? (JSON.parse(stored) as MapSettings) : defaultMapSettings;
    }

    return mapSettings.value;
}

export async function saveMapSettings(settings: MapSettings) {
    if (window.electron?.saveSettings) {
        const allSettings = await window.electron.loadSettings();
        await window.electron.saveSettings({
            ...allSettings,
            mapSettings: settings,
        });
    } else {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
}
