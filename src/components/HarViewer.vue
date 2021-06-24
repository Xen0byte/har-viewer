<script>
  import { ref } from "vue";

  import RequestCard from "./RequestCard";

  export default {
    name: "HarViewer",
    components: { RequestCard },
    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },
    setup(props) {
      const selectedEntry = ref(null);
      const filteredData = ref(props.data.entries); // TODO: use this to lazy render components on scroll
      // https://www.digitalocean.com/community/tutorials/vuejs-implementing-infinite-scroll

      return {
        selectedEntry,
        filteredData,
      };
    },
  };
</script>

<template>
  <main class="har-viewer">
    <aside class="request-list">
      <RequestCard
        v-for="(entry, i) in filteredData"
        :key="i"
        :data="entry"
        :active="selectedEntry === entry"
        @select="selectedEntry = entry"
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

    & .request-card:not(:last-child) {
      margin-bottom: .75rem;
    }

    & .request-list {
      padding: .75rem 1rem .75rem .75rem;
      height: 100%;
      max-height: 100%;
      overflow-y: auto;
      width: 475px;
      max-width: 100%;
    }
  }
</style>
