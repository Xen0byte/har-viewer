import { createApp } from "vue";

import "@openfonts/inter_latin";

import "./styles/normalize.scss";
import "./styles/index.scss";
import App from "./App";

if (!DEBUG) {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        await navigator.serviceWorker.register(SW_URL);
      } catch (_) {
        // ignore
      }
    });
  }
}

const app = createApp(App);

app.mount("#app");
