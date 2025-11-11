<template>
    <div v-if="loading">Loading markers...</div>
    <MapView v-else :markers="markers" />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import MapView from "@/components/map/MapView.vue";
import type { MapMarker } from "@/types/map";
import { getMapData } from "@/services/map";
import { getMarkerDiscoveryData } from "@/services/marker";

const markers = ref<MapMarker[]>([]);
const loading = ref(true);

async function loadMarkers() {
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

onMounted(loadMarkers);
</script>
