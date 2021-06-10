<script>
  import { ref } from "vue";

  export default {
    name: "HarViewer",
    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },
    setup() {
      const selectedEntry = ref(null);

      return {
        selectedEntry,
      };
    },
  };
</script>

<template>
  <main class="har-viewer">
    <aside>
      <div
        v-for="(entry, i) in data.entries"
        :key="i"
        @click="selectedEntry = entry"
        v-text="entry.request.url"
      />
    </aside>
    <div v-text="selectedEntry" />
  </main>
</template>

<style
  lang="scss"
  scoped
>
  .har-viewer {
    display: flex;
    flex-grow: 1;
    height: 0;

    & > aside {
      overflow: auto;
      max-height: 100%;
    }

    & > div {
      flex-grow: 1;
      width: 0;
    }
  }
</style>
