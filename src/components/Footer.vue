<script>
  export default {
    setup() {
      return {
        app: APP,
        authorName: AUTHOR_NAME,
        authorUrl: AUTHOR_URL,
        homepage: HOMEPAGE,
        license: LICENSE,
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
    user-select: none;
    justify-content: space-between;
    padding: .25em .25em;
    background-color: var(--color-background-dark);
    color: var(--color-text);

    @media (max-width: 576px) {
      display: none;
    }
  }

  a {
    color: var(--color-text);
    text-decoration: none;
  }
</style>
