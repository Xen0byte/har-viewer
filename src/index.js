import { createApp } from "vue";

// TODO: remove on firefox and safari support.
import "dialog-polyfill/dist/dialog-polyfill.css";

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
