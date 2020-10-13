<script>
  import { ref } from "vue";

  export default {
    setup() {
      const app = ref(APP);
      const authorName = ref(AUTHOR_NAME);
      const authorUrl = ref(AUTHOR_URL);
      const homepage = ref(HOMEPAGE);
      const license = ref(LICENSE);
      const version = ref(VERSION);

      return {
        app,
        authorName,
        authorUrl,
        homepage,
        license,
        version,
      };
    },
  };
</script>

<template>
  <footer class="footer">
    <div>
      <span class="is-unselectable">
        <a
          :href="homepage"
          target="_blank"
          rel="noreferrer"
        ><b v-text="app" /></a> by
        <a
          :href="authorUrl"
          target="_blank"
          rel="noreferrer"
          v-text="authorName"
        />.
        The source code is licensed under the
        <a
          :href="`https://opensource.org/licenses/${license}`"
          target="_blank"
          rel="noreferrer"
          v-text="license"
        /> license.
      </span>
    </div>
    <div>
      <span>
        <b class="is-unselectable">Version: </b><span v-text="version" />
      </span>
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
    padding: .75em 1em;

    @media (prefers-color-scheme: dark) {
      background-color: map.get($colors-dark, "background.paper");
      color: map.get($colors-dark, "text.primary");
    }

    @media (prefers-color-scheme: light) {
      background-color: map.get($colors-light, "background.default");
      color: map.get($colors-light, "text.primary");
    }
  }

  a {
    color: map.get($colors, "info.light");
    text-decoration: none;
  }
</style>
