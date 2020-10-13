import { createApp } from "vue";

import "@openfonts/roboto_latin";

import "./styles/normalize.scss";
import "./styles/index.scss";
import "./styles/prism.scss";
import App from "./App";

const app = createApp(App);

app.mount("#app");
