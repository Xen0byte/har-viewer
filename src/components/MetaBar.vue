<script>
  export default {
    props: {
      browser: {
        type: Object,
        default: null,
      },
      creator: {
        type: Object,
        required: true,
      },
      version: {
        type: String,
        required: true,
      },
      pages: {
        type: Array,
        default: () => [],
      },
    },
    emits: [
      "select-page",
    ],
    setup(props, { emit }) {
      const onChangePage = page => {
        emit("select-page", page);
      };

      return {
        onChangePage,
      };
    },
  };
</script>

<template>
  <div class="metabar">
    <div>
      <b class="is-unselectable">Version: </b>
      <span>{{ version }}</span>
    </div>
    <div
      v-if="browser"
      style="margin-left: 1em;"
    >
      <b class="is-unselectable">Browser: </b>
      <span>{{ browser.name }} ({{ browser.version }})</span>
    </div>
    <div style="margin-left: 1em;">
      <b class="is-unselectable">Creator: </b>
      <span>{{ creator.name }} ({{ creator.version }})</span>
    </div>
    <div
      v-if="pages.length > 1"
      class="select"
      style="margin-left: auto;"
    >
      <select @change="onChangePage">
        <option
          v-for="page in pages"
          :key="page.id"
          :value="page.id"
        >
          {{ page.title }}
        </option>
      </select>
    </div>
  </div>
</template>

<style
  lang="scss"
  scoped
>
  @use "sass:map";
  @import "../styles/colors";

  .metabar {
    display: flex;
    flex-direction: row;
    padding: .5em 1em;

    @media (prefers-color-scheme: dark) {
      background-color: map.get($colors-dark, "background.paper");
      color: map.get($colors-dark, "text.primary");
    }

    @media (prefers-color-scheme: light) {
      background-color: map.get($colors-light, "background.default");
      color: map.get($colors-light, "text.primary");
    }
  }
</style>
