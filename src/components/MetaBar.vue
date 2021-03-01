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
      filename: {
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
  <div class="metabar row">
    <div class="column">
      <div>
        <b class="is-unselectable">Source: </b>
        <span v-text="filename" />
      </div>
      <div
        class="row"
        style="margin-top: .25em;"
      >
        <div>
          <b class="is-unselectable">HAR Version: </b>
          <span v-text="version" />
        </div>
        <div style="margin-left: 1em;">
          <b class="is-unselectable">Creator: </b>
          <span v-text="`${creator.name} (${creator.version})`" />
        </div>
        <div
          v-if="browser"
          style="margin-left: 1em;"
        >
          <b class="is-unselectable">Browser: </b>
          <span v-text="`${browser.name} (${browser.version})`" />
        </div>
      </div>
    </div>
    <div
      v-if="pages.length > 1"
      class="select"
      style="margin-left: auto;"
    >
      <select
        aria-label="Select the recorded page to display"
        @change="onChangePage"
      >
        <option
          v-for="page in pages"
          :key="page.id"
          :value="page.id"
        >
          [{{ (new Date(page.startedDateTime)).toISOString().slice(11, -1) }}] {{ page.title }}
        </option>
      </select>
    </div>
  </div>
</template>

<style
  lang="scss"
  scoped
>
  .metabar {
    padding: .5em 1em;
    align-items: center;

    background-color: var(--color-background-card);
    color: var(--color-text);
  }
</style>
