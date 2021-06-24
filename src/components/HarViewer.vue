<script>
  import { ref, onMounted } from "vue";

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
      const filteredData = ref([]);
      const slowMode = ref(false);

      onMounted(() => {
        if (props.data.entries.length < 100) {
          filteredData.value = props.data.entries;
          return;
        }

        slowMode.value = true;
        const initialItems = 100;
        filteredData.value = props.data.entries.slice(0, initialItems);

        let addedElement = initialItems;

        window.document.querySelector(".request-list").onscroll = ({ target }) => {
          if (addedElement < props.data.entries.length) {
            const { scrollTop } = target;

            if (scrollTop > target.getBoundingClientRect().height) {
              filteredData.value.push(props.data.entries[addedElement]);
              addedElement += 1;
            }
          }
        };
      });

      return {
        selectedEntry,
        filteredData,
        slowMode,
      };
    },
  };
</script>

<template>
  <div
    v-if="slowMode"
    class="warning"
  >
    Your file contains more than 100 items - enabled slow mode!
  </div>
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
    margin-top: .5rem;
    margin-bottom: .5rem;

    & > aside {
      overflow: auto;
      max-height: 100%;
    }

    & > div {
      flex-grow: 1;
      width: 0;
    }

    & .request-card:not(:last-child) {
      margin-bottom: .5rem;
    }

    & .request-list {
      padding: .25rem .5rem;
      height: 100%;
      max-height: 100%;
      overflow-y: auto;
      width: 475px;
      max-width: 100%;
    }
  }

  .warning {
    background-color: #ffc107;
    color: #2a2e33;
    padding-left: .5rem;
    padding-right: .5rem;
    user-select: none;
  }
</style>
