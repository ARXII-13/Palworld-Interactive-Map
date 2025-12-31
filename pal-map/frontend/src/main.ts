import { createApp } from "vue";
import App from "@/App.vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import "@/index.css";
import "@/style.css";

import router from "@/router";

const app = createApp(App);

app.use(Toast, {
    position: "top-right",
    timeout: 3000,
});

app.use(router);
app.mount("#app");
