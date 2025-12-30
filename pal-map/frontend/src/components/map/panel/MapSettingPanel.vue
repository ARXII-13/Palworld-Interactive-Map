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
                            v-model="mapSettings.hideDiscoveredMarkers"
                        />
                    </div>
                </label>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import "@/components/map/panel/MapSettingPanel.css";
import {
    defaultMapSettings,
    loadMapSettings,
    saveMapSettings,
    type MapSettings,
} from "@/services/mapSettings";

const props = defineProps<MapSettings>();
const emit = defineEmits<{
    (e: "update:hideDiscoveredMarkers", value: boolean): void;
}>();

const mapSettings = ref<MapSettings>(defaultMapSettings);

onMounted(async () => {
    mapSettings.value = await loadMapSettings();
});

watch(
    mapSettings,
    async (val) => {
        await saveMapSettings(val);
        emit("update:hideDiscoveredMarkers", val.hideDiscoveredMarkers);
    },
    { deep: true }
);
</script>
