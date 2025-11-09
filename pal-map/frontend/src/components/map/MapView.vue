<template>
    <div class="relative w-full h-full">
        <div id="map" class="w-full h-full"></div>

        <!-- Toggle Button -->
        <button
            class="map-toggle-button"
            :style="{ right: showPanel ? '19rem' : '1rem' }"
            @click="showPanel = !showPanel"
        >
            {{ showPanel ? "⮝ Hide Filters" : "⮞ Show Filters" }}
        </button>

        <MapFilterPanel :showPanel="showPanel" v-model="markerFilters" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, watch, computed, ref, onUnmounted } from "vue";
import L from "leaflet";
import type { MapMarker, MapMarkerType, MapMarkerTypeFilter } from "@/types/map";
import MapFilterPanel from "@/components/map/panel/MapFilterPanel.vue";
import {
    MAP_SIZE,
    mapToWorld,
    worldToMap,
    worldToLeaflet,
    ORIGIN_GAME_X,
    ORIGIN_GAME_Y,
    TRANSFORM_A,
    TRANSFORM_B,
    TRANSFORM_C,
    TRANSFORM_D,
    leafletToMap,
} from "@/components/map/utils";
import { mapImages, mapIcons } from "@/components/map/mapImages";
import "leaflet/dist/leaflet.css";
import "@/components/map/MapView.css";

const props = defineProps<{
    markers: MapMarker[];
}>();

const showPanel = ref(false);
const markerFilters = ref({
    fastTravelPoint: {
        icon: mapImages.fastTravelPointIcon,
        label: "Fast Travel",
        visible: true,
        count: 0,
    },
    towerTravelPoint: {
        icon: mapImages.towerTravelPointIcon,
        label: "Tower",
        visible: true,
        count: 0,
    },
} as Record<MapMarkerType, MapMarkerTypeFilter>);

const markerTypeToIcon: Record<MapMarkerType, L.Icon> = {
    fastTravelPoint: mapIcons.fastTravel,
    towerTravelPoint: mapIcons.towerTravel,
};

let map: L.Map;
let markerLayer: L.LayerGroup;

onMounted(() => {
    const bounds: L.LatLngBoundsExpression = [
        [0, 0] as L.LatLngTuple,
        [MAP_SIZE, MAP_SIZE] as L.LatLngTuple,
    ];

    // Custom CRS with corrected transformation
    const CustomCRS = L.extend({}, L.CRS.Simple, {
        transformation: new L.Transformation(TRANSFORM_A, TRANSFORM_B, TRANSFORM_C, TRANSFORM_D),
    });

    // Set CRS.Simple because it’s a flat image, not real-world coordinates
    map = L.map("map", {
        center: [0, 0] as [number, number],
        crs: CustomCRS,
        minZoom: -4,
        maxZoom: 3,
        maxBounds: bounds,
        maxBoundsViscosity: 1,
    });

    L.imageOverlay(mapImages.worldMap, bounds).addTo(map);
    map.fitBounds(bounds);

    const initialView = computed<[number, number]>(() => {
        const worldCoords = mapToWorld(ORIGIN_GAME_X, ORIGIN_GAME_Y);
        const origin = worldToLeaflet(worldCoords.x, worldCoords.y);
        return [origin.lat, origin.lng] as [number, number];
    });

    map.setView(initialView.value, -3);

    markerLayer = L.layerGroup().addTo(map);

    updateMarkersCount();
    addCoordinateDisplay();
    updateMarkers();
});

onUnmounted(() => {
    if (map) {
        map.remove();
    }
});

function updateMarkersCount() {
    const counts: Record<MapMarkerType, number> = {
        fastTravelPoint: 0,
        towerTravelPoint: 0,
    };
    props.markers.forEach((marker) => {
        const markerType = marker.type;
        if (counts[markerType] !== undefined) {
            counts[markerType]++;
        }
    });

    markerFilters.value = {
        fastTravelPoint: {
            ...markerFilters.value.fastTravelPoint,
            count: counts.fastTravelPoint,
        },
        towerTravelPoint: {
            ...markerFilters.value.towerTravelPoint,
            count: counts.towerTravelPoint,
        },
    };
}

function updateMarkers() {
    if (!markerLayer) return;
    markerLayer.clearLayers();

    const visibleMarkers = props.markers.filter(
        (marker) => markerFilters.value[marker.type].visible
    );

    visibleMarkers.forEach((m) => {
        const mapCoords = worldToMap(m.position.x, m.position.y);
        const mapLatLng = worldToLeaflet(m.position.x, m.position.y);

        L.marker(mapLatLng, {
            icon: markerTypeToIcon[m.type],
        })
            .addTo(markerLayer)
            .bindPopup(
                `<b>${m.name}</b><br>Map: ${mapCoords.x}, ${-mapCoords.y}<br>Game: ${m.position.x}, ${m.position.y}`
            );
    });
}

function addCoordinateDisplay() {
    if (!map) return;

    const coordControl = L.Control.extend({
        options: {
            position: "bottomright",
        },

        onAdd: function () {
            const container = L.DomUtil.create("div", "coordinate-display");
            container.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            container.style.color = "white";
            container.style.padding = "5px 10px";
            container.style.borderRadius = "4px";
            container.style.margin = "0";
            container.style.fontFamily = "monospace";
            container.style.fontSize = "12px";
            container.style.lineHeight = "1.4";
            container.innerHTML = "Coordinates: 0, 0";
            return container;
        },
    });

    map.addControl(new coordControl());

    // Update coordinates on mouse move
    map.on("mousemove", function (e: L.LeafletMouseEvent) {
        const display = document.querySelector(".coordinate-display");
        if (display) {
            const mapCoords = leafletToMap(e.latlng);
            const worldCoords = mapToWorld(mapCoords.x, mapCoords.y);

            const innerHTML = `
                    World: ${Math.round(worldCoords.x)}, ${Math.round(worldCoords.y)}<br>
                    Map: ${Math.round(mapCoords.x)}, ${Math.round(mapCoords.y)}<br>
                    Leaflet: ${Math.round(e.latlng.lng)}, ${Math.round(e.latlng.lat)}
                `;

            display.innerHTML = innerHTML;
        }
    });
}

watch(
    () => props.markers,
    () => {
        updateMarkersCount();
        updateMarkers();
    },
    { immediate: true }
);
</script>

<style></style>
