<template>
    <div class="app-root">
        <Sidebar :class="{ hidden: !sidebarOpen }" />

        <main class="main">
            <button class="sidebar-toggle" @click="toggleSidebar">
                {{ sidebarOpen ? "⮝ Hide Menu" : "⮞ Show Menu" }}
            </button>

            <router-view />
        </main>
    </div>
</template>

<script setup lang="ts">
import Sidebar from "@/components/nav/Sidebar.vue";
import { ref } from "vue";
import "@/App.css";

const sidebarOpen = ref(true);

function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
}
</script>
