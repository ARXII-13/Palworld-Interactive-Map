<template>
    <aside class="sidebar">
        <div class="sidebar-header">
            <h3>Palworld Interactive Map</h3>
        </div>

        <nav class="sidebar-nav">
            <router-link to="/" class="sidebar-link" :class="{ active: isActive('/') }">
                Map
            </router-link>

            <router-link
                to="/settings"
                class="sidebar-link"
                :class="{ active: isActive('/settings') }"
            >
                Settings
            </router-link>

            <router-link to="/about" class="sidebar-link" :class="{ active: isActive('/about') }">
                About
            </router-link>
        </nav>

        <div class="sidebar-footer">© 2025 Palworld Interactive Map v1.0.1</div>
    </aside>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const isActive = (path: string) => route.path === path;
</script>

<style src="@/components/nav/Sidebar.css" scoped></style>
