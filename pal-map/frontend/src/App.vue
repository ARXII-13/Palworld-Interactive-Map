<template>
    <div class="h-screen w-screen flex">
        <div class="w-1/4 bg-gray-800 text-white p-4 overflow-y-auto">
            <MarkerList :markers="markers" @markerSelected="focusMarker" />
        </div>

        <div class="flex-1">
            <MapView :markers="markers" ref="mapView" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getMapData } from "@/services/api";
import type { MapMarker } from "@/types/map";
import MapView from "@/components/MapView.vue";
import MarkerList from "@/components/MarkerList.vue";

const markers = ref<MapMarker[]>([]);
const mapView = ref<InstanceType<typeof MapView> | null>(null);

onMounted(async () => {
    markers.value = await getMapData();
});

function focusMarker(marker: MapMarker) {
    console.log("Focus marker:", marker);
    // you can later implement panning logic in MapView via expose()
}
</script>

<style>
html,
body,
#app {
    height: 100%;
    margin: 0;
}
</style>
