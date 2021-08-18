<script setup>
  import { ref, onMounted, onBeforeMount } from "vue";
  import svgLoading from "@mdi/svg/svg/loading.svg";
  import svgAlertCircleOutline from "@mdi/svg/svg/alert-circle-outline.svg";

  import AppBar from "./components/AppBar";
  import InfoDialog from "./components/dialogs/InfoDialog";
  import OpenDialog from "./components/dialogs/OpenDialog";
  import PropDialog from "./components/dialogs/PropDialog";
  import HarViewer from "./components/HarViewer";
  import Footer from "./components/Footer";

  import { getSystemTheme, switchTheme, isPWA } from "./utils/theme";

  const data = ref(null);
  const file = ref("");
  const isLoading = ref(false);
  const hasError = ref(null);
  const showPropDialog = ref(false);
  const propAttached = ref(false);
  const showInfoDialog = ref(false);
  const showOpenDialog = ref(false);
  const propFilter = ref({
    filter: {
      methods: "",
      status: "",
      resType: "",
      domains: "",
    },
    sortBy: "",
    groupBy: "",
  });
  const isStandalone = isPWA();

  onBeforeMount(() => switchTheme(getSystemTheme()));
  onMounted(() => {
    // workaround for 100vh on mobile browsers
    window.height = window.innerHeight;
  });

  const compare = (a, b) => {
    if (a < b) {
      return -1;
    }

    if (a > b) {
      return 1;
    }

    return 0;
  };

  const statusTypeOrder = {
    Informational: 0,
    Success: 1,
    Redirection: 2,
    "Client Error": 3,
    "Server Error": 4,
    Unknown: 5,
  };

  const methodOrder = {
    GET: 0,
    POST: 1,
    PATCH: 2,
    PUT: 3,
    DELETE: 4,
    OPTIONS: 5,
    HEAD: 6,
    CONNECT: 7,
    TRACE: 8,
  };

  const filteredData = ref([]);

  const applyFilters = filters => {
    const {
      filter,
      sortBy,
      groupBy,
    } = filters;
    let clone = [...data.value.entries];

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

      clone.sort(sortFunc);
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
          if (o.response.status > 0 && o.response.status < 200) {
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

      let sortFunc;

      if (groupBy === "resource-type" || groupBy === "domain" || groupBy === "status") {
        sortFunc = (a, b) => compare(a.group, b.group);
      } else if (groupBy === "status-type") {
        sortFunc = (a, b) => compare(statusTypeOrder[a.group], statusTypeOrder[b.group]);
      } else if (groupBy === "method") {
        sortFunc = (a, b) => compare(methodOrder[a.group], methodOrder[b.group]);
      }

      clone.sort(sortFunc);
    }

    return clone;
  };

  const onPropApply = filter => {
    filteredData.value = applyFilters(filter);
    propFilter.value = filter;
    showPropDialog.value = false;
  };

  const onPropAttach = () => {
    showPropDialog.value = false;
    propAttached.value = !propAttached.value;
  };

  const onOpenFile = async payload => {
    showOpenDialog.value = false;
    isLoading.value = true;

    file.value = payload.src;

    try {
      data.value = payload.data;
      filteredData.value = payload.data.entries;
      hasError.value = null;
    } catch (e) {
      data.value = null;
      filteredData.value = null;
      hasError.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const onAction = async action => {
    switch (action) {
      case "open":
        showOpenDialog.value = true;
        break;
      case "sort-and-filter":
        showPropDialog.value = true;
        break;
      case "sort-and-filter_attached":
        onPropAttach();
        showPropDialog.value = true;
        break;
      case "info":
        showInfoDialog.value = true;
        break;
      default:
        break;
    }
  };
</script>

<template>
  <app-bar
    :is-loaded="!!data"
    @action="onAction"
  >
    <h1>HTTP Archive Viewer</h1>
  </app-bar>
  <main
    v-if="isLoading"
    class="spinner"
  >
    <img
      alt="Loading..."
      :src="svgLoading"
    >
  </main>
  <main
    v-if="hasError && !isLoading"
    class="error column"
  >
    <img
      alt="Error Symbol"
      role="none"
      :src="svgAlertCircleOutline"
    >
    <span v-text="hasError" />
    <span v-text="file" />
  </main>
  <main
    v-if="!isLoading && !hasError && !!data"
    class="row is-unselectable"
  >
    <HarViewer :data="filteredData" />
    <component
      :is="propAttached ? 'aside' : 'div'"
      v-if="showPropDialog || propAttached"
      class="propdialog-container"
    >
      <PropDialog
        :filter="propFilter"
        :is-attached="propAttached"
        @apply="onPropApply"
        @close="showPropDialog = false"
        @attach="onPropAttach"
      />
    </component>
  </main>
  <main v-if="!hasError && !isLoading && !data" />
  <Footer v-if="!isStandalone" />
  <InfoDialog
    v-if="showInfoDialog && data"
    :creator="data.creator"
    :version="data.version"
    @close="showInfoDialog = false"
  />
  <OpenDialog
    v-if="showOpenDialog"
    @open="onOpenFile"
    @close="showOpenDialog = false"
  />
</template>

<style
  lang="scss"
  scoped
>
  .propdialog-container {
    height: 100%;
    border-left: var(--color-background-dark) solid 2px;

    @media (max-width: 475px) {
      border-left: unset;
    }
  }

  .error {
    color: var(--color-background-error);

    & > span {
      font-weight: 600;
      font-size: 1.2rem;
    }

    & > img {
      filter: var(--filter-background-error);
      height: 128px;
      width: 128px;
    }
  }

  .spinner > img {
    height: 64px;
    width: 64px;
  }
</style>
