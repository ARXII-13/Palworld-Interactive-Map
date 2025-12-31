import { createRouter, createWebHistory } from "vue-router";
import MapPage from "@/pages/MapPage.vue";
import AppSettingPage from "@/pages/AppSettingPage.vue";

const routes = [
    { path: "/", component: MapPage },
    { path: "/settings", component: AppSettingPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
