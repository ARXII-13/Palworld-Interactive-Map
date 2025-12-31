<template>
    <section class="app-setting-container">
        <header class="app-setting-header">
            <h3>App Settings</h3>
        </header>

        <!-- Marker source -->
        <div class="app-setting-item">
            <label class="app-setting-label">Marker Source</label>

            <select class="app-setting-control" v-model="appSettings.markerSourceMode">
                <option value="game">Game</option>
                <option value="memory">Memory</option>
            </select>
        </div>

        <!-- UE4SS Folder -->
        <div class="app-setting-item">
            <label class="app-setting-label">UE4SS Folder</label>

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

                <!-- Browser fallback -->
                <div v-if="showBrowserFallback" class="browser-fallback">
                    <input
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
import "@/components/map/panel/MapSettingPanel.css";
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
