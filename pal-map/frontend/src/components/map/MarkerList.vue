<template>
    <div>
        <h2 class="text-lg font-bold mb-3">Markers</h2>
        <ul>
            <li
                v-for="marker in markers"
                :key="marker.id"
                class="p-2 border-b border-gray-300 cursor-pointer hover:bg-gray-200"
                @click="$emit('markerSelected', marker)"
            >
                <strong>{{ marker.name }}</strong
                ><br />
                <small
                    >{{ marker.position.x.toFixed(3) }}, {{ marker.position.y.toFixed(3) }}</small
                >
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import type { MapMarker } from "@/types/map";

defineProps<{
    markers: MapMarker[];
}>();

defineEmits<{
    (e: "markerSelected", marker: MapMarker): void;
}>();
</script>
