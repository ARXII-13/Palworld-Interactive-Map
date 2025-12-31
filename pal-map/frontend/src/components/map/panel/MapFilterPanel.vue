<template>
    <transition name="slide">
        <aside class="map-slide-panel">
            <div class="panel-content">
                <h3 class="panel-title">Map Filters</h3>

                <label v-for="(filter, key) in filters" :key="key" class="filter-row">
                    <input type="checkbox" v-model="filter.visible" @change="emitFilters" />

                    <img :src="filter.icon" class="filter-icon" :alt="filter.label" />

                    <span class="filter-label">
                        {{ filter.label }}
                    </span>

                    <span class="filter-count">
                        {{ filter.discoveredCount }}/{{ filter.totalCount }}
                    </span>
                </label>

                <div class="panel-actions">
                    <button @click="setAll(true)">Show All</button>
                    <button @click="setAll(false)">Hide All</button>
                </div>
            </div>
        </aside>
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
} from "@/services/settings/mapSettings";

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
        .map(([markerType, _]) => markerType as MapMarkerType);

    await saveMapSettings(mapSettings.value);
    emit("filters-updated", filters);
}

onMounted(async () => {
    mapSettings.value = await loadMapSettings();
});
</script>

<style></style>
