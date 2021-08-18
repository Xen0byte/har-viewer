<script setup>
  import { ref, computed } from "vue";
  import svgChevronLeft from "@mdi/svg/svg/chevron-left.svg";

  import RequestCard from "./RequestCard";
  import TabBar from "./TabBar";

  import CookieTab from "./tabs/CookieTab";
  import PostDataTab from "./tabs/PostDataTab";
  import RequestTab from "./tabs/RequestTab";
  import ResponseContentTab from "./tabs/ResponseContentTab";
  import WebsocketTab from "./tabs/WebsocketTab";
  import ResponseTab from "./tabs/ResponseTab";
  import TimingTab from "./tabs/TimingTab";

  import { uniqueArrayByProperty } from "../utils/array";

  const props = defineProps({
    data: {
      type: Array,
      required: true,
    },
  });

  const selectedIndex = ref(-1);
  const selectedGroup = ref("");
  const showDialog = ref(false);
  const currentTab = ref("request");

  const groups = computed(() => uniqueArrayByProperty(props.data, o => o.group));

  const selectedEntry = computed(() => {
    if (selectedIndex.value === -1) {
      return null;
    }

    return selectedGroup.value
      ? props.data.filter(o => o.group === selectedGroup.value)[selectedIndex.value]
      : props.data[selectedIndex.value];
  });

  const tabViews = {
    request: RequestTab,
    "post-data": PostDataTab,
    response: ResponseTab,
    "response-content": ResponseContentTab,
    websocket: WebsocketTab,
    cookies: CookieTab,
    timing: TimingTab,
  };

  const onSelect = (idx, group = null) => {
    currentTab.value = "request";
    selectedIndex.value = idx;
    selectedGroup.value = group;
    if (window.innerWidth <= 475) {
      showDialog.value = true;
    }
  };
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
              v-for="(entry, i) in props.data.filter(o => o.group === group)"
              :key="i"
              :data="entry"
              :active="selectedIndex === i && selectedGroup === group"
              @click="() => onSelect(i, group)"
            />
          </div>
        </template>
      </template>
      <template v-else>
        <RequestCard
          v-for="(entry, i) in props.data"
          :key="i"
          :data="entry"
          :active="selectedIndex === i"
          @click="() => onSelect(i)"
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
          :has-post-data="!!selectedEntry.request.postData"
          :has-response-content="selectedEntry.response.content.size !== 0"
          :has-cookies="selectedEntry.request.cookies.length !== 0 || selectedEntry.response.cookies.length !== 0"
          :has-timings="Object.keys(selectedEntry.timings).length !== 0"
          :has-websocket="!!selectedEntry._webSocketMessages"
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
