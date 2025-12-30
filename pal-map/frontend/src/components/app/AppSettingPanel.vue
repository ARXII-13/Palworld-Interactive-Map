<template>
    <transition name="slide">
        <div class="map-slide-panel">
            <div class="slide-panel-container">
                <h3 class="text-lg font-semibold mb-3 text-gray-800">Map Settings</h3>

                <label class="flex items-center cursor-pointer slide-item-label">
                    <div class="flex items-center gap-2 w-full">
                        <span class="flex items-center gap-2">
                            <span>Hide Discovered Markers</span>
                        </span>
                        <input
                            type="checkbox"
                            class="slide-item-control"
                            v-model="settings.hideDiscoveredMarkers"
                        />
                    </div>
                </label>

                <label class="flex items-center cursor-pointer slide-item-label">
                    <div class="flex items-center gap-2 w-full">
                        <span class="flex items-center gap-2">
                            <span>Marker Source</span>
                        </span>
                        <select class="slide-item-control" v-model="settings.markerSourceMode">
                            <option value="game">Game</option>
                            <option value="memory">Memory</option>
                        </select>
                    </div>
                </label>

                <div class="folder-picker">
                    <button v-if="!showBrowserFallback" @click="selectFolder">Pick Folder</button>
                    <div
                        v-if="settings.ue4ssFolderPath"
                        class="folder-path"
                        :title="settings.ue4ssFolderPath"
                    >
                        Selected Folder: {{ settings.ue4ssFolderPath }}
                    </div>

                    <!-- Browser fallback -->
                    <div v-if="showBrowserFallback" class="browser-fallback">
                        <label>
                            Please enter the full folder path manually:
                            <input
                                type="text"
                                v-model="settings.ue4ssFolderPath"
                                placeholder="e.g., C:\steam\steamapps\common\Palworld\Pal\Binaries\Win64\ue4ss"
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import type { MarkerSourceMode } from "@/types/map";
import { onMounted, ref, watch } from "vue";
import "@/components/map/panel/MapSettingPanel.css";
import { loadAppSettings, saveAppSettings, type AppSettings } from "@/services/appSettings";

const props = defineProps<AppSettings>();
const emit = defineEmits<{
    (e: "update:hideDiscoveredMarkers", value: boolean): void;
    (e: "update:markerSourceMode", value: MarkerSourceMode): void;
}>();

const settings = ref<AppSettings>({
    markerSourceMode: "game",
    ue4ssFolderPath: undefined,
});

const showBrowserFallback = ref(false);
onMounted(async () => {
    settings.value = await loadAppSettings();
});

watch(
    settings,
    async (val) => {
        console.log("Settings changed:", val);
        await saveAppSettings(val);

        emit("update:hideDiscoveredMarkers", val.hideDiscoveredMarkers);
        emit("update:markerSourceMode", val.markerSourceMode);
    },
    { deep: true }
);

async function selectFolder() {
    if (window.electron?.pickFolder) {
        try {
            const folder = await window.electron.pickFolder();
            if (folder) {
                settings.value.ue4ssFolderPath = folder;
            }
        } catch (err) {
            console.error("Failed to pick folder:", err);
        }
    } else {
        showBrowserFallback.value = true;
        settings.value.ue4ssFolderPath = "";
    }
}
</script>
