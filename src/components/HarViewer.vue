<script>
  import { ref, computed } from "vue";
  import svgChevronLeft from "@mdi/svg/svg/chevron-left.svg";

  import RequestCard from "./RequestCard";
  import TabBar from "./TabBar";

  import CookieTab from "./tabs/CookieTab";
  import PostDataTab from "./tabs/PostDataTab";
  import RequestTab from "./tabs/RequestTab";
  import ResponseContentTab from "./tabs/ResponseContentTab";
  import ResponseTab from "./tabs/ResponseTab";
  import TimingTab from "./tabs/TimingTab";

  export default {
    name: "HarViewer",
    components: {
      PostDataTab,
      ResponseContentTab,
      TimingTab,
      CookieTab,
      ResponseTab,
      RequestTab,
      TabBar,
      RequestCard,
    },
    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
      filter: {
        type: Object,
        default: () => ({}),
      },
    },
    setup(props) {
      const selectedEntry = ref(null);
      const showDialog = ref(false);
      const currentTab = ref("request");

      const compare = (a, b) => {
        if (a < b) {
          return -1;
        }

        if (a > b) {
          return 1;
        }

        return 0;
      };

      const filteredData = computed(() => {
        const {
          filter,
          sortBy,
          groupBy,
        } = props.filter;
        let clone = [...props.data.entries];

        if (filter) {
          if (filter.methods) {
            const methods = filter.methods.split(",");
            clone = clone.filter(o => methods.includes(o.request.method.toLowerCase()));
          }

          if (filter.status) {
            const status = filter.status.split(",");
            clone = clone.filter(o => status.includes(o.response.status.toString()));
          }

          if (filter.resType) {
            const resTypes = filter.resType.split(",");
            // eslint-disable-next-line no-underscore-dangle
            clone = clone.filter(o => resTypes.includes(o._resourceType.toLowerCase()));
          }

          if (filter.domains) {
            const domains = filter.domains.split(",");
            clone = clone.filter(o => domains.includes((new URL(o.request.url)).hostname.toLowerCase()));
          }
        }

        if (sortBy) {
          let sortFunc;

          switch (sortBy) {
            case "status":
              sortFunc = (a, b) => compare(a.response.status, b.response.status);
              break;
            case "status-reverse":
              sortFunc = (a, b) => compare(b.response.status, a.response.status);
              break;
            case "timing":
              sortFunc = (a, b) => compare(a.time, b.time);
              break;
            case "timing-reverse":
              sortFunc = (a, b) => compare(b.time, a.time);
              break;
            default:
              sortFunc = null;
              break;
          }

          clone = clone.sort(sortFunc);
        }

        if (groupBy) {
          clone = clone.map(o => {
            let group = "";

            if (groupBy === "method") {
              group = o.request.method;
            } else if (groupBy === "status") {
              // eslint-disable-next-line no-underscore-dangle
              group = `${o.response.status} - ${o.response.statusText || o.respose._error}`;
            } else if (groupBy === "status-type") {
              if (props.data.response.status < 0 && props.data.response.status < 200) {
                group = "Informational";
              } else if (props.data.response.status > 199 && props.data.response.status < 300) {
                group = "Success";
              } else if (props.data.response.status > 299 && props.data.response.status < 400) {
                group = "Redirection";
              } else if (props.data.response.status > 399 && props.data.response.status < 500) {
                group = "Client Error";
              } else if (props.data.response.status > 499) {
                group = "Server Error";
              } else {
                group = "Unknown";
              }
            } else if (groupBy === "resource-type") {
              // eslint-disable-next-line no-underscore-dangle
              group = o._resourceType;
            } else if (groupBy === "domain") {
              group = (new URL(o.request.url)).hostname;
            }

            return {
              ...o,
              group,
            };
          });
        }

        return clone;
      });

      const uniqueArrayByProperty = (arr, cb) => arr.reduce((prev, item) => {
        const v = cb(item);
        if (!prev.includes(v)) {
          prev.push(v);
        }
        return prev;
      }, []);

      const groups = computed(() => uniqueArrayByProperty(filteredData.value, o => o.group));

      const onSelect = entry => {
        currentTab.value = "request";
        selectedEntry.value = entry;
        if (window.innerWidth <= 475) {
          showDialog.value = true;
        }
      };

      return {
        svgChevronLeft,
        selectedEntry,
        filteredData,
        groups,
        onSelect,
        showDialog,
        currentTab,
      };
    },
  };
</script>

<template>
  <main class="har-viewer">
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
              v-for="(entry, i) in filteredData.filter(o => o.group === group)"
              :key="i"
              :data="entry"
              :active="selectedEntry === entry"
              @select="() => onSelect(entry)"
            />
          </div>
        </template>
      </template>
      <template v-else>
        <RequestCard
          v-for="(entry, i) in filteredData"
          :key="i"
          :data="entry"
          :active="selectedEntry === entry"
          @select="() => onSelect(entry)"
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
          :has-post-data="!!selectedEntry.request.postData"
          :has-response-content="selectedEntry.response.content.size !== 0"
          :has-cookies="selectedEntry.request.cookies.length !== 0 || selectedEntry.response.cookies.length !== 0"
          :has-timings="Object.keys(selectedEntry.timings).length !== 0"
          @change="tab => currentTab = tab"
        />
        <div class="tabs">
          <RequestTab
            v-if="currentTab === 'request'"
            :data="selectedEntry"
          />
          <PostDataTab
            v-if="currentTab === 'post-data'"
            :data="selectedEntry"
          />
          <ResponseTab
            v-if="currentTab === 'response'"
            :data="selectedEntry"
          />
          <ResponseContentTab
            v-if="currentTab === 'response-content'"
            :data="selectedEntry"
          />
          <CookieTab
            v-if="currentTab === 'cookies'"
            :data="selectedEntry"
          />
          <TimingTab
            v-if="currentTab === 'timing'"
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
        display: flex !important;
        flex-direction: column;
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
