<script>
  import { computed } from "vue";

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
      const onChangePage = e => emit("select-page", e.target.value);
      const sortedPages = computed(() => {
        const { pages } = props;
        return pages.sort((a, b) => {
          const keyA = new Date(a.startedDateTime);
          const keyB = new Date(b.startedDateTime);

          if (keyA < keyB) {
            return -1;
          }

          if (keyA > keyB) {
            return 1;
          }

          return 0;
        });
      });

      return {
        sortedPages,
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
      style="text-align: end; flex-grow: 1;"
    >
      <select
        class="page-select"
        aria-label="Select the recorded page to display"
        @change="onChangePage"
      >
        <option value="">
          All Pages
        </option>
        <option
          v-for="page in sortedPages"
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

    @media (max-width: 835px) {
      flex-direction: column;
      align-items: flex-start;

      & > div:first-child {
        margin-bottom: .5em;
      }
    }
  }

  .page-select {
    max-width: 45vw;
  }
</style>
