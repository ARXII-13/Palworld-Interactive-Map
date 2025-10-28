<template>
    <l-map style="height: 100%; width: 100%" :zoom="zoom" :center="center" ref="mapRef">
        <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
        />

        <l-marker
            v-for="marker in markers"
            :key="marker.id"
            :lat-lng="[marker.lat, marker.lng]"
            @click="handleMarkerClick(marker)"
        >
            <l-popup>
                <strong>{{ marker.name }}</strong
                ><br />
                {{ marker.description }}
            </l-popup>
        </l-marker>
    </l-map>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import type { MapMarker } from "@/types/map";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
    markers: MapMarker[];
}

const props = defineProps<Props>();
const mapRef = ref<InstanceType<typeof LMap> | null>(null);

const center = ref<[number, number]>([0, 0]);
const zoom = ref(3);

function handleMarkerClick(marker: MapMarker) {
    console.log("Clicked:", marker);
}
</script>
