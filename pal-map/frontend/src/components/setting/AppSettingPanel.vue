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

const appSettings = ref<AppSettings>({
    markerSourceMode: "game",
    ue4ssFolderPath: undefined,
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
            console.error("Failed to pick folder:", err);
        }
    } else {
        showBrowserFallback.value = true;
        appSettings.value.ue4ssFolderPath = "";
    }
}
</script>
