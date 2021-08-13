<script setup>
  const app = APP;
  const authorName = AUTHOR_NAME;
  const authorUrl = AUTHOR_URL;
  const homepage = HOMEPAGE;
  const license = LICENSE;
  const version = VERSION;
</script>

<template>
  <footer
    class="footer row is-unselectable"
    role="contentinfo"
  >
    <div>
      <span>
        <a
          :href="homepage"
          title="Homepage"
          target="_blank"
          rel="noreferrer"
        ><b v-text="app" /></a> v{{ version }} by
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
    padding: .25em;
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
