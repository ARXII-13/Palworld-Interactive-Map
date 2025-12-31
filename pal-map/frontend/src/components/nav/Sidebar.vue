<template>
    <aside class="w-64 bg-gray-800 text-white flex flex-col h-full p-4">
        <div class="px-6 py-4 border-b border-gray-700">
            <h3 class="text-2xl font-bold text-yellow-400">Palworld Interactive Map</h3>
        </div>

        <nav class="flex-1 px-2 py-4 space-y-1">
            <router-link
                to="/"
                class="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                :class="{ 'bg-yellow-600 font-semibold': isActive('/') }"
            >
                Map
            </router-link>

            <router-link
                to="/settings"
                class="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                :class="{ 'bg-yellow-600 font-semibold': isActive('/settings') }"
            >
                Settings
            </router-link>
        </nav>

        <div class="px-6 py-4 border-t border-gray-700 text-sm text-gray-400">v1.0.0</div>
    </aside>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();

const isActive = (path: string) => route.path === path;
</script>

<style scoped>
aside {
    width: 8rem; /* 256px */
    /* Solid background to distinguish sidebar from content */
    background-color: #1f2937; /* Tailwind gray-800 */
    /* Slight shadow for depth */
    box-shadow: 2px 0 6px rgba(0, 0, 0, 0.3);
}
</style>
