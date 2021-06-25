<script>
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import svgChevronLeft from "@mdi/svg/svg/chevron-left.svg";

  import RequestCard from "./RequestCard";
  import TabBar from "./TabBar";
  import RequestTab from "./tabs/RequestTab";

  export default {
    name: "HarViewer",
    components: {
      RequestTab,
      TabBar,
      RequestCard,
    },
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
      const showDialog = ref(false);
      const currentTab = ref("request");

      const onSelect = entry => {
        currentTab.value = "request";
        selectedEntry.value = entry;
        if (window.innerWidth <= 475) {
          showDialog.value = true;
        }
      };

      let onScroll;

      onMounted(() => {
        if (props.data.entries.length < 100) {
          filteredData.value = props.data.entries;
          slowMode.value = false;
          return;
        }

        slowMode.value = true;
        const initialItems = 100;
        filteredData.value = props.data.entries.slice(0, initialItems);

        let addedElement = initialItems;

        const list = window.document.querySelector(".request-list");

        onScroll = ({ target }) => {
          const { scrollTop } = target;

          if (scrollTop > target.scrollHeight - target.scrollHeight / 5) {
            filteredData.value.push(props.data.entries[addedElement]);
            addedElement += 1;

            if (addedElement >= props.data.entries.length) {
              list.removeEventListener("scroll", onScroll);
            }
          }
        };

        list.addEventListener("scroll", onScroll);
      });

      onBeforeUnmount(() => {
        if (onScroll) {
          window.document.querySelector(".request-list")
            .removeEventListener("scroll");
        }
      });

      return {
        svgChevronLeft,
        selectedEntry,
        filteredData,
        slowMode,
        onSelect,
        showDialog,
        currentTab,
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
        @select="() => onSelect(entry)"
      />
    </aside>
    <div
      class="request-details"
      :class="{ show: showDialog }"
    >
      <div
        v-if="showDialog"
        class="navbar"
      >
        <button
          class="btn"
          type="button"
          @click="showDialog = false; selectedEntry = null"
        >
          <img :src="svgChevronLeft">
        </button>
      </div>
      <div
        v-if="selectedEntry"
        class="container"
      >
        <TabBar
          :current-tab="currentTab"
          :as-dialog="showDialog"
          @change="tab => currentTab = tab"
        />
        <div class="tabs">
          <RequestTab
            v-if="currentTab === 'request'"
            :data="selectedEntry"
          />
        </div>
      </div>
    </div>
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

    & .tabbar {
      margin-bottom: .5rem;
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

    & .request-details {
      height: 100%;

      & .container {
        padding: .25rem .5rem;
        height: 100%;
        display: flex;
        flex-direction: column;

        & .tabs {
          flex-grow: 1;
          height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          background-color: var(--color-background-dark);
          border-radius: .25rem;
          padding: 1rem;
          color: var(--color-text);
        }
      }
    }

    @media (max-width: 475px) {
      .request-details {
        display: none;
        position: absolute;
        height: 100vh;
        width: 100vw;
        top: 0;
        background-color: var(--color-background);
        overflow: hidden;

        & .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 56px;
          background: var(--color-primary);
          padding: .5rem .75rem;
          position: sticky;
          top: 0;
          margin-bottom: .5rem;

          & .btn {
            background-color: var(--color-primary-dark);
            border: none;
            color: #ffffff;
            padding: .375rem .75rem;
            cursor: pointer;
            font-size: 1rem;
            line-height: 1.5;
            font-weight: 400;
            border-radius: .25rem;
            user-select: none;
            display: flex;
            align-items: center;
            justify-content: center;

            transition: background-color .15s ease-in-out;

            & > img {
              filter: invert(99%) sepia(1%) saturate(2%) hue-rotate(66deg) brightness(117%) contrast(100%);
            }

            &:hover {
              background-color: var(--color-primary-light);
            }
          }
        }
      }

      .request-details.show {
        display: block !important;
      }
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
