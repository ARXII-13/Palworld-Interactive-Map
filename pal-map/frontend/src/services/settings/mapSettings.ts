import { MAP_MARKER_TYPES, type MapMarkerType } from "@/types/map";
import { ref } from "vue";

const SETTINGS_KEY = "palmap-map-settings";

export interface MapSettings {
    hideDiscoveredMarkers: boolean;
    appliedFilters: MapMarkerType[];
}

export const defaultMapSettings: MapSettings = {
    hideDiscoveredMarkers: false,
    appliedFilters: MAP_MARKER_TYPES.map((type) => type),
};

export const mapSettings = ref<MapSettings>(defaultMapSettings);

export async function loadMapSettings(): Promise<MapSettings> {
    if (window.electron?.loadSettings) {
        const allSettings = await window.electron.loadSettings();
        if (allSettings && allSettings.mapSettings) {
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
    if (window.electron?.saveSettings && window.electron?.loadSettings) {
        let allSettings = await window.electron?.loadSettings();
        if (!allSettings) {
            allSettings = {};
        }

        const newSettings = {
            ...allSettings,
            mapSettings: settings,
        };
        await window.electron.saveSettings(JSON.parse(JSON.stringify(newSettings)));
    } else {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
}
