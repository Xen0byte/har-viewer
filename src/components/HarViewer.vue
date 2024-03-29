<script setup>
  import { ref, computed, watch } from "vue";
  import svgChevronLeft from "@mdi/svg/svg/chevron-left.svg";

  import RequestCard from "./RequestCard.vue";
  import TabBar from "./TabBar.vue";

  import CookieTab from "./tabs/CookieTab.vue";
  import PostDataTab from "./tabs/PostDataTab.vue";
  import RequestTab from "./tabs/RequestTab.vue";
  import ResponseContentTab from "./tabs/ResponseContentTab.vue";
  import WebsocketTab from "./tabs/WebsocketTab.vue";
  import ResponseTab from "./tabs/ResponseTab.vue";
  import TimingTab from "./tabs/TimingTab.vue";

  import { uniqueArrayByProperty } from "../utils/helpers.js";
  import { viewerTabs } from "../utils/constants.js";

  const props = defineProps({
    data: {
      type: Array,
      required: true,
    },
  });

  const selectedId = ref(0);
  const showDialog = ref(false);
  const currentTab = ref("request");

  const groups = computed(() => uniqueArrayByProperty(props.data, o => o._harviewer.group));

  const selectedEntry = computed(() => (selectedId.value !== -1
    ? props.data.find(o => o._harviewer.id === selectedId.value)
    : null));

  const tabViews = {
    request: RequestTab,
    postData: PostDataTab,
    response: ResponseTab,
    responseContent: ResponseContentTab,
    websocket: WebsocketTab,
    cookies: CookieTab,
    timing: TimingTab,
  };

  /**
   * get the enabled tabs for a given entry.
   * @param {HttpArchive.Entry} entry - The entry to get enabled tabs for.
   * @returns {string[]} - The enabled tabs for the entry.
   */
  function getEnabledTabs(entry) {
    return viewerTabs.filter(tab => (entry
      && !(tab.name === "websocket" && !entry.request.url.startsWith("ws"))
      && !(tab.name === "postData" && !entry.request.postData)
      && !(tab.name === "responseContent" && (entry.response.bodySize < 0
        && entry.response.content && entry.response.content.size < 0))
      && !(tab.name === "cookies"
        && entry.request.cookies.length === 0
        && entry.response.cookies.length === 0)
      && !(tab.name === "timing" && Object.keys(entry.timings).length === 0)
    ));
  }

  const enabledTabs = computed(() => getEnabledTabs(selectedEntry.value));

  const onSelect = id => {
    selectedId.value = id;

    const persistentTab = getEnabledTabs(selectedEntry.value)
      .find(t => t.name === currentTab.value);

    if (!persistentTab) {
      currentTab.value = "request";
    }

    if (window.innerWidth <= 475) {
      showDialog.value = true;
    }
  };

  watch(selectedEntry, () => {
    if (!props.data.find(o => o._harviewer.id === selectedId.value)) {
      selectedId.value = props.data[0]._harviewer.id;
    }
  });
</script>

<template>
  <div class="har-viewer">
    <aside class="request-list">
      <template v-if="groups.length !== 0">
        <template
          v-for="group in groups"
          :key="group"
        >
          <b
            class="group-label"
            v-text="group"
          />
          <div class="group">
            <RequestCard
              v-for="entry in data.filter(o => o._harviewer.group === group)"
              :key="entry._harviewer.id"
              :data="entry"
              :active="selectedId === entry._harviewer.id"
              @click="() => onSelect(entry._harviewer.id)"
            />
          </div>
        </template>
      </template>
      <template v-else>
        <RequestCard
          v-for="entry in data"
          :key="entry._harviewer.id"
          :data="entry"
          :active="selectedId === entry._harviewer.id"
          @click="() => onSelect(entry._harviewer.id)"
        />
      </template>
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
          class="btn btn-primary-dark"
          type="button"
          @click="showDialog = false; selectedEntry = null"
        >
          <img
            alt="Close dialog"
            class="icon"
            :src="svgChevronLeft"
          >
        </button>
      </div>
      <div
        v-if="selectedEntry"
        class="container column"
      >
        <TabBar
          :current-tab="currentTab"
          :as-dialog="showDialog"
          :tabs="enabledTabs"
          @change="tab => currentTab = tab"
        />
        <div
          class="tabs"
          role="tabpanel"
        >
          <component
            :is="tabViews[currentTab]"
            :data="selectedEntry"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style
  lang="scss"
  scoped
>
  .group-label {
    color: var(--color-text);
  }

  .group {
    margin-top: .5rem;

    &:not(:last-of-type) {
      margin-bottom: 1.5rem;
    }
  }

  .har-viewer {
    display: flex;
    flex-grow: 1;
    height: 100%;
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
      padding: .5rem;
      height: 100%;
      max-height: 100%;
      overflow-y: auto;
      width: 475px;
      max-width: 100vw;
      z-index: 1;
    }

    & .request-details {
      height: 100%;
      z-index: 2;

      & .container {
        padding: .5rem;
        height: 100%;

        & .tabs {
          flex-grow: 1;
          height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          background-color: var(--color-background-dark);
          border-radius: 5px;
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
          background: var(--color-primary);
          padding: .5rem .75rem;
          position: sticky;
          top: 0;
          margin-bottom: .5rem;
        }
      }

      .request-details.show {
        display: flex !important;
        flex-direction: column;
      }
    }
  }
</style>
