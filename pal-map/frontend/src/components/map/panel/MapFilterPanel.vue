<template>
    <transition name="slide">
        <div class="map-slide-panel">
            <div class="slide-panel-container">
                <h3 class="text-lg font-semibold mb-3 text-gray-800">Map Filters</h3>
                <label
                    v-for="(value, key) in filters"
                    :key="key"
                    class="flex items-center cursor-pointer slide-item-label"
                >
                    <div class="flex items-center gap-2 w-full">
                        <input type="checkbox" v-model="value.visible" @change="emitFilters" />
                        <span class="flex items-center gap-2">
                            <img :src="value.icon" class="slide-item-icon" :alt="key" />
                            <span>{{ value.label }}</span>
                        </span>
                        <span class="text-gray-500">
                            {{ value.discoveredCount }}/{{ value.totalCount }}
                        </span>
                    </div>
                </label>
                <div class="mt-auto pt-3 border-t border-gray-200 flex justify-between text-xs">
                    <button class="text-blue-600 hover:underline" @click="setAll(true)">
                        Show All
                    </button>
                    <button class="text-gray-500 hover:underline" @click="setAll(false)">
                        Hide All
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { MapMarkerType, MapMarkerTypeFilter } from "@/types/map";
import "@/components/map/panel/MapFilterPanel.css";
import {
    defaultMapSettings,
    loadMapSettings,
    saveMapSettings,
    type MapSettings,
} from "@/services/mapSettings";

const props = defineProps<{
    modelValue: Record<MapMarkerType, MapMarkerTypeFilter>;
}>();

const emit = defineEmits<{
    (e: "filters-updated", newFilters: Record<MapMarkerType, MapMarkerTypeFilter>): void;
}>();
const filters = ref({ ...props.modelValue });

const mapSettings = ref<MapSettings>(defaultMapSettings);

watch(
    () => props.modelValue,
    (newVal) => {
        filters.value = { ...newVal };
    },
    { deep: true }
);

function emitFilters() {
    const updatedFilters: Partial<Record<MapMarkerType, MapMarkerTypeFilter>> = {};
    Object.entries(filters.value).forEach(([markerType, typeFilter]) => {
        const originalFilter = props.modelValue[markerType as MapMarkerType];
        updatedFilters[markerType as MapMarkerType] = {
            ...originalFilter,
            visible: typeFilter.visible,
        } as MapMarkerTypeFilter;
    });
    onFilterChange(updatedFilters as Record<MapMarkerType, MapMarkerTypeFilter>);
}
function setAll(value: boolean) {
    const newFilters: Partial<Record<MapMarkerType, MapMarkerTypeFilter>> = {};
    Object.entries(filters.value).forEach(([markerType, typeFilter]) => {
        newFilters[markerType as MapMarkerType] = {
            ...typeFilter,
            visible: value,
        } as MapMarkerTypeFilter;
    });
    onFilterChange(newFilters as Record<MapMarkerType, MapMarkerTypeFilter>);
}

async function onFilterChange(filters: Record<MapMarkerType, MapMarkerTypeFilter>) {
    mapSettings.value.appliedFilters = Object.entries(filters)
        .filter(([_, filter]) => filter.visible)
        .map(([markerType, _]) => markerType);
    await saveMapSettings(mapSettings.value);
    emit("filters-updated", filters);
}

onMounted(async () => {
    mapSettings.value = await loadMapSettings();
});
</script>

<style></style>
