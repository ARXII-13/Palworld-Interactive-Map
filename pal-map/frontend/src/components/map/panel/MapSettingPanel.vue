<template>
    <transition name="slide">
        <aside class="map-slide-panel">
            <div class="panel-content">
                <h3 class="panel-title">Map Settings</h3>

                <label class="setting-row">
                    <span class="setting-label"> Hide Discovered Markers </span>

                    <input type="checkbox" v-model="mapSettings.hideDiscoveredMarkers" />
                </label>
            </div>
        </aside>
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
} from "@/services/settings/mapSettings";

const props = defineProps<{
    hideDiscoveredMarkers: boolean;
}>();
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
