import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import "@ui/assets/styles/global.scss";
import "@ui/assets/styles/dark-theme.scss"; 
import { createPinia } from 'pinia'

const app = createApp(App);
app.use(createPinia())
app.use(router);
app.mount("#app");