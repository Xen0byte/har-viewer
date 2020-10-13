<script>
  import { ref } from "vue";

  export default {
    setup() {
      const version = ref(VERSION);

      return {
        version,
      };
    },
  };
</script>

<template>
  <footer class="footer">
    <div>
      <p class="is-unselectable">
        <strong>HAR Viewer</strong> by
        <a
          target="_blank"
          href="https://github.com/develerik"
        >
          Erik Bender</a>.
        The source code is licensed
        <a
          target="_blank"
          href="https://opensource.org/licenses/ISC"
        >
          ISC</a>.
      </p>
    </div>
    <div>
      <p>
        <b class="is-unselectable">Version:</b> {{ version }}
      </p>
    </div>
  </footer>
</template>

<style
  lang="scss"
  scoped
>
  @use "sass:map";
  @import "../styles/colors";

  .footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 1em;
    padding-right: 1em;
  }

  a {
    color: map.get($colors, "info.main");
    text-decoration: none;
  }

  @media (prefers-color-scheme: dark) {
    .footer {
      background-color: map.get($colors-dark, "background.paper");
      color: map.get($colors-dark, "text.primary");
    }
  }

  @media (prefers-color-scheme: light) {
    .footer {
      background-color: map.get($colors-light, "background.paper");
      color: map.get($colors-light, "text.primary");
    }
  }
</style>
