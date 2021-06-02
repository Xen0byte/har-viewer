import { createApp } from "vue";

import "./styles/index.scss";

import Shell from "./Shell";

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

export default createApp(Shell)
  .mount(".shell");
