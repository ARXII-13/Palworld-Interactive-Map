<template>
    <section class="app-setting-container">
        <header class="app-setting-header">
            <h3>App Settings</h3>
        </header>

        <div class="app-setting-item">
            <label class="app-setting-label" for="marker-source">
                Marker Source
                <span
                    class="info-icon"
                    title="By default, this app reads markers directly from the game files. If you have the UE4SS installled, then this app can read some realtime markers like chests or eggs from memory."
                    >ℹ️</span
                >
            </label>
            <select
                id="marker-source"
                class="app-setting-control"
                v-model="appSettings.markerSourceMode"
            >
                <option value="game">Game</option>
                <option value="memory">Memory</option>
            </select>
        </div>

        <div class="app-setting-item">
            <label class="app-setting-label" for="ue4ss-folder">
                UE4SS Folder
                <span
                    class="info-icon"
                    title="Select the folder where UE4SS is installed. Or where the `xxxxxxx-ue4ss_actor_data.csv` files are located. For example: `C:\steam\steamapps\common\Palworld\Pal\Binaries\Win64\ue4ss`."
                    >ℹ️</span
                >
            </label>
            <div class="folder-picker">
                <button v-if="!showBrowserFallback" class="folder-button" @click="selectFolder">
                    Pick Folder
                </button>

                <div
                    v-if="appSettings.ue4ssFolderPath"
                    class="folder-path"
                    :title="appSettings.ue4ssFolderPath"
                >
                    {{ appSettings.ue4ssFolderPath }}
                </div>

                <div v-if="showBrowserFallback" class="browser-fallback">
                    <input
                        id="ue4ss-folder"
                        type="text"
                        v-model="appSettings.ue4ssFolderPath"
                        placeholder="C:\steam\steamapps\common\Palworld\Pal\Binaries\Win64\ue4ss"
                    />
                </div>
            </div>
        </div>

        <div class="app-setting-item">
            <label class="app-setting-label" for="refresh-markers">
                Refresh Memory Markers
                <span
                    class="info-icon"
                    title="Reload all marker data from the game memory to get the latest updates."
                    >ℹ️</span
                >
            </label>
            <button class="refresh-button" @click="handleRefreshMarkers">Refresh now</button>
        </div>

        <div class="app-setting-item">
            <label class="app-setting-label" for="enable-cheat">
                Enable Cheats
                <span
                    class="info-icon"
                    title="Enable it to use cheat commands. Requires to setup the UE4SS lua scripts before using it. Use at your own RISK!"
                    >ℹ️</span
                >
            </label>
            <input
                id="enable-cheat"
                class="app-setting-checkbox"
                type="checkbox"
                v-model="appSettings.enableCheats"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import "@/components/setting/AppSettingPanel.css";
import {
    loadAppSettings,
    saveAppSettings,
    type AppSettings,
} from "@/services/settings/appSettings";
import { updateMapRealtimeData } from "@/services/map";
import { useToast } from "vue-toastification";

const toast = useToast();

const appSettings = ref<AppSettings>({
    markerSourceMode: "game",
    ue4ssFolderPath: undefined,
    enableCheats: false,
});

const showBrowserFallback = ref(false);
onMounted(async () => {
    showBrowserFallback.value = !window.electron?.pickFolder;
    appSettings.value = await loadAppSettings();
});

watch(
    appSettings,
    async (val) => {
        await saveAppSettings(val);
    },
    { deep: true }
);

async function selectFolder() {
    if (window.electron?.pickFolder) {
        try {
            const folder = await window.electron.pickFolder();
            if (folder) {
                appSettings.value.ue4ssFolderPath = folder;
            }
        } catch (err) {
            toast.error("Failed to pick folder.");
            console.error(err);
        }
    } else {
        showBrowserFallback.value = true;
        appSettings.value.ue4ssFolderPath = "";
    }
}

async function handleRefreshMarkers() {
    if (appSettings.value.ue4ssFolderPath) {
        try {
            await updateMapRealtimeData(appSettings.value.ue4ssFolderPath);
        } catch (err) {
            toast.error("Failed to update realtime data.");
            console.error(err);
        }
    } else {
        toast.warning("Please select a UE4SS folder first.");
    }
}
</script>
