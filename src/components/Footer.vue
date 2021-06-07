<script>
  import { ref } from "vue";

  export default {
    setup() {
      const app = ref(APP);
      const authorName = ref(AUTHOR_NAME);
      const authorUrl = ref(AUTHOR_URL);
      const homepage = ref(HOMEPAGE);
      const license = ref(LICENSE);

      return {
        app,
        authorName,
        authorUrl,
        homepage,
        license,
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
  </footer>
</template>

<style
  lang="scss"
  scoped
>
  .footer {
    justify-content: space-between;
    padding: .25em .25em;
    background-color: white;
    color: black;

    @media (max-width: 576px) {
      display: none;
    }
  }

  a {
    color: #0359a2;
    text-decoration: none;
  }
</style>
