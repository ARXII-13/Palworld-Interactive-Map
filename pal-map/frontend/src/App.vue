<template>
    <div class="h-screen w-screen">
        <MapView :markers="markers" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getMapData } from "@/services/api";
import MapView from "@/components/map/MapView.vue";
import type { MapMarker } from "@/types/map";

const markers = ref<MapMarker[]>([]);

onMounted(async () => {
    markers.value = await getMapData();
});
</script>
