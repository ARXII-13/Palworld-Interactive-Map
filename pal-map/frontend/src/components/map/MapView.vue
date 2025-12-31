<template>
    <div class="map-container">
        <div class="map-root">
            <div id="map"></div>

            <!-- Toggle buttons -->
            <div class="map-toggle-buttons" :class="{ 'panel-open': !!activePanel }">
                <button class="map-toggle-button" @click="togglePanel('filters')">
                    {{ activePanel === "filters" ? "⮝ Hide Filters" : "⮞ Filters" }}
                </button>

                <button class="map-toggle-button" @click="togglePanel('settings')">
                    {{ activePanel === "settings" ? "⮝ Hide Settings" : "⚙ Map Settings" }}
                </button>
            </div>

            <!-- Panels -->
            <MapFilterPanel
                v-if="activePanel === 'filters'"
                v-model="markerFilters"
                @filters-updated="onFiltersUpdated"
            />

            <MapSettingPanel
                v-if="activePanel === 'settings'"
                v-model:hideDiscoveredMarkers="mapSettings.hideDiscoveredMarkers"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, watch, computed, ref, onUnmounted } from "vue";
import L from "leaflet";
import type { MapMarker, MapMarkerType, MapMarkerTypeFilter, MarkerProgress } from "@/types/map";
import MapFilterPanel from "@/components/map/panel/MapFilterPanel.vue";
import MapSettingPanel from "@/components/map/panel/MapSettingPanel.vue";
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
import { addMarkerDiscoveryStatus, deleteMarkerDiscoveryStatus } from "@/services/marker";
import { useToast } from "vue-toastification";
import {
    defaultMapSettings,
    loadMapSettings,
    type MapSettings,
} from "@/services/settings/mapSettings";

const props = defineProps<{
    markers: MapMarker[];
}>();

const markerFilters = ref({
    fastTravelPoint: {
        icon: mapImages.fastTravelPointIcon,
        label: "Fast Travel",
        visible: true,
        totalCount: 0,
    },
    towerTravelPoint: {
        icon: mapImages.towerTravelPointIcon,
        label: "Tower",
        visible: true,
        totalCount: 0,
    },
    treasure: {
        icon: mapImages.treasureIcon,
        label: "Treasure",
        visible: true,
        totalCount: 0,
    },
    egg: {
        icon: mapImages.eggIcon,
        label: "Egg",
        visible: true,
        totalCount: 0,
    },
} as Record<MapMarkerType, MapMarkerTypeFilter>);

const activePanel = ref<"filters" | "settings" | null>(null);
function togglePanel(panel: "filters" | "settings") {
    activePanel.value = activePanel.value === panel ? null : panel;
}

const markerTypeToIcon: Record<string, L.Icon | L.DivIcon> = {
    fastTravelPoint: mapIcons.fastTravel,
    fastTravelPointChecked: mapIcons.fastTravelChecked,
    towerTravelPoint: mapIcons.towerTravel,
    towerTravelPointChecked: mapIcons.towerTravelChecked,
    treasure: mapIcons.treasure,
    treasureChecked: mapIcons.treasureChecked,
    egg: mapIcons.egg,
    eggChecked: mapIcons.eggChecked,
};

let map: L.Map;
let markerLayer: L.LayerGroup;

const mapSettings = ref<MapSettings>(defaultMapSettings);

onMounted(async () => {
    mapSettings.value = await loadMapSettings();

    const appliedFilters = mapSettings.value.appliedFilters || [];
    Object.keys(markerFilters.value).forEach((key) => {
        markerFilters.value[key as MapMarkerType].visible = appliedFilters.includes(
            key as MapMarkerType
        ) as boolean;
    });
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
        zoomControl: false,
    });

    L.control
        .zoom({
            position: "bottomleft",
        })
        .addTo(map);

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
    const totalCounts: Record<MapMarkerType, number> = {
        fastTravelPoint: 0,
        towerTravelPoint: 0,
        treasure: 0,
        egg: 0,
    };
    const discoveredCounts: Record<MapMarkerType, number> = {
        fastTravelPoint: 0,
        towerTravelPoint: 0,
        treasure: 0,
        egg: 0,
    };
    props.markers.forEach((marker) => {
        const markerType = marker.type;
        if (totalCounts[markerType] !== undefined) {
            totalCounts[markerType]++;

            if (marker.discovered) {
                discoveredCounts[markerType]++;
            }
        }
    });

    markerFilters.value = {
        fastTravelPoint: {
            ...markerFilters.value.fastTravelPoint,
            totalCount: totalCounts.fastTravelPoint,
            discoveredCount: discoveredCounts.fastTravelPoint,
        },
        towerTravelPoint: {
            ...markerFilters.value.towerTravelPoint,
            totalCount: totalCounts.towerTravelPoint,
            discoveredCount: discoveredCounts.towerTravelPoint,
        },
        treasure: {
            ...markerFilters.value.treasure,
            totalCount: totalCounts.treasure,
            discoveredCount: discoveredCounts.treasure,
        },
        egg: {
            ...markerFilters.value.egg,
            totalCount: totalCounts.egg,
            discoveredCount: discoveredCounts.egg,
        },
    };
}

function updateMarkers() {
    if (!markerLayer) return;
    markerLayer.clearLayers();

    const { hideDiscoveredMarkers, appliedFilters } = mapSettings.value;
    const visibleMarkers = props.markers
        .filter((marker) => appliedFilters.includes(marker.type))
        .filter((marker) => (hideDiscoveredMarkers ? !marker.discovered : true));

    visibleMarkers.forEach((m) => {
        const mapCoords = worldToMap(m.position.x, m.position.y);
        const mapLatLng = worldToLeaflet(m.position.x, m.position.y);

        const popupHtml = `
  <div class="custom-popup-content">
    <b>${m.name}</b>
    <div>Map: ${Math.round(mapCoords.x)}, ${Math.round(-mapCoords.y)}</div>
    <div>Game: ${Math.round(m.position.x)}, ${Math.round(m.position.y)}</div>
    <label>
      <input type="checkbox" id="chk-${m.id}" ${m.discovered ? "checked" : ""} />
      <span>Discovered</span>
    </label>
  </div>
`;

        const icon = markerTypeToIcon[m.discovered ? `${m.type}Checked` : m.type]; // Example of different
        const marker = L.marker(mapLatLng, {
            icon,
        })
            .addTo(markerLayer)
            .bindPopup(popupHtml);

        marker.on("popupopen", () => {
            const checkbox = document.getElementById(`chk-${m.id}`) as HTMLInputElement;
            if (checkbox) {
                checkbox.checked = m.discovered;
                checkbox.addEventListener("change", () => {
                    toggleMarkerProgress(m.type, m.id);

                    const updated = props.markers.find((x) => x.id === m.id);
                    if (updated) {
                        const icon = markerTypeToIcon[m.discovered ? `${m.type}Checked` : m.type];
                        if (icon) {
                            marker.setIcon(icon);
                        }
                    }
                });
            }
        });
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

function toggleMarkerProgress(markerType: MapMarkerType, markerId: string) {
    const marker = props.markers.find((m) => m.id === markerId);
    if (marker) {
        const isDiscovered = marker.discovered === true;
        try {
            if (isDiscovered) {
                deleteMarkerDiscoveryStatus(markerId);
                markerFilters.value[markerType].discoveredCount--;
            } else {
                const data: MarkerProgress = {
                    id: markerId,
                    markerType,
                    name: marker.name,
                };
                addMarkerDiscoveryStatus(data);
                markerFilters.value[markerType].discoveredCount++;
            }
            marker.discovered = !isDiscovered;
        } catch (error) {
            useToast().error("Error updating marker discovery status.");
            return;
        }
    }
}

async function onFiltersUpdated(newFilters: typeof markerFilters.value) {
    markerFilters.value = { ...newFilters };
    mapSettings.value = await loadMapSettings();
    updateMarkersCount();
    updateMarkers();
}

watch(
    () => props.markers,
    () => {
        updateMarkersCount();
        updateMarkers();
    },
    { deep: true, immediate: true }
);

watch(
    () => mapSettings.value.hideDiscoveredMarkers,
    () => {
        updateMarkers();
    }
);
</script>

<style></style>
