<script>
  import { ref } from "vue";

  import AppBar from "./components/AppBar";

  export default {
    name: "Shell",
    components: { AppBar },
    setup() {
      const root = document.querySelector("html");

      const data = ref(null);
      const theme = ref(root.dataset.theme);

      const onAction = action => {
        console.log(action);
      };

      return {
        data,
        theme,
        onAction,
      };
    },
  };
</script>

<template>
  <app-bar @action="onAction">
    <h1>HTTP Archive Viewer</h1>
  </app-bar>
  <main />
</template>

<style lang="scss">
  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-height: 100vh;
    overflow: hidden;
  }

  main {
    flex-grow: 1;
  }
</style>
