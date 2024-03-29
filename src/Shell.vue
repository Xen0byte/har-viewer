<script setup>
  import { ref, onMounted, onBeforeMount } from "vue";
  import svgLoading from "@mdi/svg/svg/loading.svg";
  import svgAlertCircleOutline from "@mdi/svg/svg/alert-circle-outline.svg";

  import AppBar from "./components/AppBar.vue";
  import InfoDialog from "./components/dialogs/InfoDialog.vue";
  import OpenDialog from "./components/dialogs/OpenDialog.vue";
  import PropDialog from "./components/dialogs/PropDialog.vue";
  import ExportDialog from "./components/dialogs/ExportDialog.vue";
  import HarViewer from "./components/HarViewer.vue";
  import Footer from "./components/Footer.vue";

  import parseHar from "./utils/parser/index.js";
  import applyCollation from "./utils/collation/index.js";
  import {
    exportToCSV,
    exportToHar,
    exportToPostman,
    redactData,
  } from "./utils/export/index.js";

  import { getSystemTheme, switchTheme, isPWA } from "./utils/theme.js";

  const data = ref(null);
  const file = ref("");
  const isLoading = ref(false);
  const hasError = ref(null);
  const showPropDialog = ref(false);
  const propAttached = ref(false);
  const showInfoDialog = ref(false);
  const showOpenDialog = ref(false);
  const showExportDialog = ref(false);
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
  const filteredData = ref([]);

  let filter = null;

  const onPropApply = filters => {
    const onlySortAndGroup = filter === filters.filter;

    filteredData.value = applyCollation(onlySortAndGroup
      ? filteredData.value
      : data.value.entries, filters, onlySortAndGroup);
    filter = filters.filter;

    propFilter.value = filters;
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
      showPropDialog.value = false;
      propAttached.value = false;
      propFilter.value = {
        filter: {
          methods: "",
          status: "",
          resType: "",
          domains: "",
        },
        sortBy: "",
        groupBy: "",
      };
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

  const onExport = settings => {
    let exportData = settings.onlyFiltered ? {
      log: {
        ...data.value,
        creator: {
          name: "HTTP Archive Viewer",
          version: VERSION,
        },
        entries: filteredData.value,
      },
    } : {
      log: {
        ...data.value,
        creator: {
          name: "HTTP Archive Viewer",
          version: VERSION,
        },
      },
    };

    if (settings.redact) {
      redactData(exportData.log.entries, settings.redactWordList);
    }

    let mimeType = "";
    let ext = "";

    switch (settings.format) {
      case "har":
        mimeType = "application/json";
        ext = ".har";

        exportData = exportToHar(exportData);
        break;
      case "postman":
        mimeType = "application/json";
        ext = ".postman_collection.json";
        exportData = exportToPostman(settings.filename, exportData);
        break;
      case "csv":
        mimeType = "text/csv";
        ext = ".csv";
        exportData = exportToCSV(exportData, {
          msExcelCompatible: settings.csvExcel.csvExcel,
        });
        break;
      default:
        mimeType = "text/plain";
        ext = ".txt";
    }

    const e = document.createElement("a");
    e.setAttribute("href", `data:${mimeType};charset=utf-8,${encodeURIComponent(exportData)}`);
    e.setAttribute("download", settings.filename + ext);
    e.style.display = "none";
    document.body.appendChild(e);
    e.click();
    document.body.removeChild(e);

    showExportDialog.value = false;
  };

  const onAction = async action => {
    switch (action) {
      case "export":
        showExportDialog.value = true;
        break;
      case "open":
        showOpenDialog.value = true;
        break;
      case "sort-and-filter":
        if (propAttached.value) {
          showPropDialog.value = false;
          propAttached.value = false;
          return;
        }

        showPropDialog.value = true;
        break;
      case "sort-and-filter_attached":
        if (propAttached.value) {
          showPropDialog.value = false;
          propAttached.value = false;
          return;
        }

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

  onBeforeMount(() => switchTheme(getSystemTheme()));
  onMounted(async () => {
    // workaround for 100vh on mobile browsers
    window.height = window.innerHeight;

    // open file from query parameters if given
    const params = new URLSearchParams(window.location.search);
    const fileUri = params.get("file");

    if (fileUri) {
      isLoading.value = true;
      const res = await window.fetch(fileUri);
      const resData = await res.json();

      try {
        await onOpenFile({
          src: fileUri,
          data: parseHar(resData),
          filter: {},
        });
      } catch (e) {
        data.value = null;
        filteredData.value = null;
        hasError.value = e.message;
        isLoading.value = false;
      }
    }
  });
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
    :file="file"
    :version="data.version"
    @close="showInfoDialog = false"
  />
  <OpenDialog
    v-if="showOpenDialog"
    @open="onOpenFile"
    @close="showOpenDialog = false"
  />
  <ExportDialog
    v-if="showExportDialog"
    @export="onExport"
    @close="showExportDialog = false"
  />
</template>

<style
  lang="scss"
  scoped
>
  // TODO: move all css to scss files
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
