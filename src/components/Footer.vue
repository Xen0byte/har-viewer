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
          target="_blank"
          :href="homepage"
        ><b v-text="app" /></a> by
        <a
          target="_blank"
          :href="authorUrl"
          v-text="authorName"
        />.
        The source code is licensed under the
        <a
          target="_blank"
          :href="`https://opensource.org/licenses/${license}`"
          v-text="license"
        /> license.
      </span>
    </div>
    <div>
      <span>
        <b class="is-unselectable">Version:</b> {{ version }}
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
    color: map.get($colors, "info.main");
    text-decoration: none;
  }
</style>
