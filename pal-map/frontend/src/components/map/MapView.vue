<template>
    <div id="map" class="h-full w-full"></div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import L from "leaflet";
import type { MapMarker } from "@/types/map";
import { MAP_SIZE } from "@/components/map/utils";
import { mapImages, mapIcons } from "@/components/map/mapImages";

const props = defineProps<{
    markers: MapMarker[];
}>();

let map: L.Map;
let markerLayer: L.LayerGroup;

onMounted(() => {
    const imageWidth = MAP_SIZE; // image pixel width
    const imageHeight = MAP_SIZE; // image pixel height

    // Image bounds: top-left (0,0), bottom-right (width, height)
    const bounds: L.LatLngBoundsExpression = [
        [0, 0] as L.LatLngTuple,
        [imageHeight, imageWidth] as L.LatLngTuple,
    ];

    // Set CRS.Simple because it’s a flat image, not real-world coordinates
    map = L.map("map", {
        center: [0, 0] as [number, number],
        crs: L.CRS.Simple,
        minZoom: -4,
        maxZoom: 3,
        maxBounds: bounds,
        zoomSnap: 0.25,
        zoom: -2,
        dragging: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
    });

    L.imageOverlay(mapImages.worldMap, bounds).addTo(map);
    map.fitBounds(bounds);

    markerLayer = L.layerGroup().addTo(map);
    updateMarkers();
});

function updateMarkers() {
    if (!markerLayer) return;
    markerLayer.clearLayers();

    const icon = mapIcons.fastTravel;
    props.markers.forEach((m) => {
        L.marker([m.position.y, m.position.x], {
            icon: icon,
        })
            .addTo(markerLayer)
            .bindPopup(`<b>${m.name}</b><br>${""}`);
    });
}

watch(
    () => props.markers,
    () => updateMarkers(),
    { deep: true }
);
</script>

<style scoped>
#map {
    height: 100%;
    width: 100%;
}
</style>
