<template>
    <div v-if="loading">Loading markers...</div>
    <MapView v-else :markers="markers" v-model:markerSourceMode="markerSourceMode" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import MapView from "@/components/map/MapView.vue";
import type { MapMarker, MarkerSourceMode } from "@/types/map";
import { getMapData, getMapRealtimeData } from "@/services/map";
import { getMarkerDiscoveryData } from "@/services/marker";
import { loadAppSettings, type AppSettings } from "@/services/appSettings";
import { useToast } from "vue-toastification";

const markers = ref<MapMarker[]>([]);
const loading = ref(true);
const toast = useToast();

const markerSourceMode = ref<MarkerSourceMode>("game");

const settings = ref<AppSettings>({
    markerSourceMode: "game",
    ue4ssFolderPath: undefined,
});

async function loadMapMarkers() {
    try {
        const [mapData, discoveryData] = await Promise.all([
            getMapData(),
            getMarkerDiscoveryData(),
        ]);

        const discoveryMap = new Map(discoveryData.map((d) => [d.id, d]));
        markers.value = mapData.map((m) => ({
            ...m,
            discovered: discoveryMap.has(m.id),
        }));
    } catch (err) {
        console.error("Failed to load marker data:", err);
    } finally {
        loading.value = false;
    }
}

async function loadRealtimeMarkers(folderPath: string) {
    try {
        const mapData = await getMapRealtimeData(folderPath);
        markers.value = mapData;
    } catch (err) {
        console.error("Failed to load realtime marker data:", err);
    } finally {
        loading.value = false;
    }
}

async function loadMarkers() {
    loading.value = true;

    try {
        if (settings.value.markerSourceMode === "game") {
            console.log("Loading markers from game data source");
            await loadMapMarkers();
        } else {
            console.log("Loading markers from memory data source");
            if (settings.value.ue4ssFolderPath) {
                await loadRealtimeMarkers(settings.value.ue4ssFolderPath);
            } else {
                toast.error("UE4SS folder path is not set for memory marker source.");
            }
        }
    } catch (err) {
        console.error("Failed to load markers:", err);
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    settings.value = await loadAppSettings();
    await loadMarkers();
});

watch(
    () => settings.value.markerSourceMode,
    async () => {
        await loadMarkers();
    }
);
</script>
