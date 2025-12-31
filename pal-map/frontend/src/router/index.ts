import { createRouter, createWebHistory } from "vue-router";
import MapPage from "@/pages/MapPage.vue";
import AppSettingPage from "@/pages/AppSettingPage.vue";
import AboutPage from "@/pages/AboutPage.vue";

const routes = [
    { path: "/", component: MapPage },
    { path: "/settings", component: AppSettingPage },
    { path: "/about", name: "About", component: AboutPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
