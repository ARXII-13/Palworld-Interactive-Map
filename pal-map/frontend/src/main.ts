import { createApp } from "vue";
import App from "@/App.vue";
import "@/style.css";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.use(Toast, {
    position: "top-right",
    timeout: 3000,
});

app.mount("#app");
