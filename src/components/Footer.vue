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
  <footer class="footer row is-unselectable">
    <div>
      <span>
        <a
          :href="homepage"
          title="Homepage"
          target="_blank"
          rel="noreferrer"
        ><b v-text="app" /></a> by
        <a
          :href="authorUrl"
          target="_blank"
          title="Author Homepage"
          rel="noreferrer"
          v-text="authorName"
        />.
        The source code is licensed under the
        <a
          :href="`https://opensource.org/licenses/${license}`"
          title="License Page"
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
  .footer {
    justify-content: space-between;
    padding: .75em 1em;

    background-color: var(--color-background-card);
    color: var(--color-text);
  }

  a {
    color: var(--color-link);
    text-decoration: none;
  }
</style>
