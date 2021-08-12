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
      const selectedIndex = ref(-1);
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
            const includes = methods.filter(m => !m.startsWith("!"));
            const excludes = methods.filter(m => m.startsWith("!"))
              .map(m => m.replace("!", ""));

            clone = clone.filter(o => {
              const include = includes.includes(o.request.method.toLowerCase());
              const exclude = excludes.includes(o.request.method.toLowerCase());

              if (include) {
                return true;
              }

              if (exclude) {
                return false;
              }

              return !(includes.length !== 0 && !include);
            });
          }

          if (filter.status) {
            const status = filter.status.split(",");
            const includes = status.filter(m => !m.startsWith("!") && !m.includes("-"));
            const includeRanges = status.filter(m => !m.startsWith("!") && m.includes("-"))
              .map(m => {
                const parts = m.split("-");
                return [Number(parts[0]), Number(parts[1])];
              });
            const excludes = status.filter(m => m.startsWith("!") && !m.includes("-"))
              .map(m => m.replace("!", ""));
            const excludeRanges = status.filter(m => m.startsWith("!") && m.includes("-"))
              .map(m => {
                const parts = m.replace("!", "")
                  .split("-");
                return [Number(parts[0]), Number(parts[1])];
              });

            const isInRanges = (code, ranges) => {
              for (let i = 0; i < ranges.length; i++) {
                if (code >= ranges[i][0] && code <= ranges[i][1]) {
                  return true;
                }
              }

              return false;
            };

            clone = clone.filter(o => {
              const include = includes.includes(o.response.status.toString())
                || isInRanges(o.response.status, includeRanges);
              const exclude = excludes.includes(o.response.status.toString())
                || isInRanges(o.response.status, excludeRanges);

              if (include) {
                return true;
              }

              if (exclude) {
                return false;
              }

              return !((includes.length !== 0 || includeRanges.length) !== 0 && !include);
            });
          }

          if (filter.resType) {
            const resTypes = filter.resType.split(",");
            const includes = resTypes.filter(m => !m.startsWith("!"));
            const excludes = resTypes.filter(m => m.startsWith("!"))
              .map(m => m.replace("!", ""));

            clone = clone.filter(o => {
              // eslint-disable-next-line no-underscore-dangle
              const include = includes.includes(o._resourceType.toLowerCase());
              // eslint-disable-next-line no-underscore-dangle
              const exclude = excludes.includes(o._resourceType.toLowerCase());

              if (include) {
                return true;
              }

              if (exclude) {
                return false;
              }

              return !(includes.length !== 0 && !include);
            });
          }

          if (filter.domains) {
            const domains = filter.domains.split(",");
            const includes = domains.filter(m => !m.startsWith("!"));
            const excludes = domains.filter(m => m.startsWith("!"))
              .map(m => m.replace("!", ""));

            const regexMatch = (domain, patterns) => {
              for (let i = 0; i < patterns.length; i++) {
                const match = new RegExp(`^${patterns[i].replace(/\*/g, ".*")}$`).test(domain);

                if (match) {
                  return true;
                }
              }

              return false;
            };

            clone = clone.filter(o => {
              const include = includes.includes((new URL(o.request.url)).hostname.toLowerCase())
                || regexMatch((new URL(o.request.url)).hostname.toLowerCase(), includes);
              const exclude = excludes.includes((new URL(o.request.url)).hostname.toLowerCase())
                || regexMatch((new URL(o.request.url)).hostname.toLowerCase(), excludes);

              if (include) {
                return true;
              }

              if (exclude) {
                return false;
              }

              return !(includes.length !== 0 && !include);
            });
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
              if (o.response.status === 0) {
                // eslint-disable-next-line no-underscore-dangle
                group = o.response.statusText || o.response._error || "Unknown";
              } else {
                group = o.response.status;
              }
            } else if (groupBy === "status-type") {
              if (o.response.status < 0 && o.response.status < 200) {
                group = "Informational";
              } else if (o.response.status > 199 && o.response.status < 300) {
                group = "Success";
              } else if (o.response.status > 299 && o.response.status < 400) {
                group = "Redirection";
              } else if (o.response.status > 399 && o.response.status < 500) {
                group = "Client Error";
              } else if (o.response.status > 499) {
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
        if (!prev.includes(v) && v !== undefined) {
          prev.push(v);
        }
        return prev;
      }, []);

      const groups = computed(() => uniqueArrayByProperty(filteredData.value, o => o.group));

      const selectedEntry = computed(() => {
        if (selectedIndex.value === -1) {
          return null;
        }

        return filteredData.value[selectedIndex.value];
      });

      const onSelect = idx => {
        currentTab.value = "request";
        selectedIndex.value = idx;
        if (window.innerWidth <= 475) {
          showDialog.value = true;
        }
      };

      return {
        svgChevronLeft,
        selectedEntry,
        selectedIndex,
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
  <div class="har-viewer">
    <aside
      class="request-list"
      role="navigation"
    >
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
              v-memo="[i === selectedIndex]"
              :data="entry"
              :active="selectedIndex === i"
              @click="() => onSelect(i)"
            />
          </div>
        </template>
      </template>
      <template v-else>
        <RequestCard
          v-for="(entry, i) in filteredData"
          :key="i"
          v-memo="[i === selectedIndex]"
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
          <img :src="svgChevronLeft">
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
          @change="tab => currentTab = tab"
        />
        <div
          class="tabs"
          role="tabpanel"
        >
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

          & .btn > img {
            filter: invert(99%) sepia(1%) saturate(2%) hue-rotate(66deg) brightness(117%) contrast(100%);
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
