<script>
  import {
    ref, computed, onMounted, onBeforeMount,
  } from "vue";
  import ExportDialog from "./components/dialogs/ExportDialog";
  import EntryDetails from "./components/EntryDetails";
  import FilterControl from "./components/FilterControl";

  import { switchTheme, getSystemTheme } from "./utils/theme";
  import { parseHarFile, checkHar } from "./utils/har";

  import Footer from "./components/Footer";
  import Header from "./components/Header";
  import MetaBar from "./components/MetaBar";
  import Entry from "./components/Entry";

  export default {
    components: {
      ExportDialog,
      FilterControl,
      EntryDetails,
      Footer,
      Header,
      MetaBar,
      Entry,
    },
    setup() {
      onBeforeMount(() => {
        switchTheme(getSystemTheme());
      });

      onMounted(() => {
        // workaround for 100vh on mobile browsers
        window.height = window.innerHeight;
      });

      const filename = ref(null);
      const harContent = ref(null);
      const loadError = ref(null);
      const isLoading = ref(false);
      const selectedEntry = ref(null);
      const selectedIndex = ref(null);
      const selectedPage = ref("");
      const selectedType = ref("");
      const selectedStatusCode = ref("");
      const showExportDialog = ref(false);

      const filterEntries = page => {
        selectedEntry.value = null;
        selectedIndex.value = null;
        selectedPage.value = page;
      };

      const filteredEntries = computed(() => (harContent.value ? harContent.value.entries
        .filter(entry => (selectedPage.value ? entry.pageref === selectedPage.value : true))
        // eslint-disable-next-line no-underscore-dangle
        .filter(entry => (selectedType.value ? entry._resourceType === selectedType.value : true))
        .filter(entry => (selectedStatusCode.value ? String(entry.response.status) === selectedStatusCode.value : true))
        .sort((a, b) => new Date(a.startedDateTime) - new Date(b.startedDateTime)) : []));

      const statusCodes = computed(() => {
        const codes = harContent.value ? harContent.value.entries
          .filter(entry => (selectedPage.value ? entry.pageref === selectedPage.value : true))
          .map(entry => entry.response.status)
          .filter(sc => sc === 0 || !!sc)
          .sort() : [];
        return [...new Set(codes)];
      });

      const types = computed(() => {
        const typeValues = harContent.value ? harContent.value.entries
          .filter(entry => (selectedPage.value ? entry.pageref === selectedPage.value : true))
          // eslint-disable-next-line no-underscore-dangle
          .map(entry => entry._resourceType)
          .filter(t => !!t)
          .sort() : [];
        return [...new Set(typeValues)];
      });

      const onLoadFile = async file => {
        loadError.value = null;
        isLoading.value = true;
        selectedStatusCode.value = "";
        selectedType.value = "";
        selectedPage.value = "";

        try {
          const har = await parseHarFile(file);

          harContent.value = har;
          filename.value = file.name;
          filterEntries("");
        } catch (e) {
          loadError.value = e.message;
        } finally {
          isLoading.value = false;
        }
      };

      const onSelectEntry = (entry, index) => {
        selectedEntry.value = entry;
        selectedIndex.value = index;
      };

      const onLoadUrl = async url => {
        loadError.value = null;
        isLoading.value = true;
        selectedStatusCode.value = "";
        selectedType.value = "";
        selectedPage.value = "";

        try {
          const res = await window.fetch(url);
          const json = await res.json();
          const har = checkHar(json);

          harContent.value = har;
          filterEntries(har.pages[0].id);
          filename.value = url;
        } catch (e) {
          loadError.value = e.message;
        } finally {
          isLoading.value = false;
        }
      };

      const onTypeSelected = type => {
        selectedType.value = type;
      };

      const onStatusCodeSelected = statusCode => {
        selectedStatusCode.value = statusCode;
      };

      const onExport = options => {
        const data = options.onlyFiltered ? {
          log: {
            ...harContent.value,
            creator: {
              name: "HTTP Archive Viewer",
              version: VERSION,
            },
            entries: filteredEntries.value,
          },
        } : {
          log: {
            ...harContent.value,
            creator: {
              name: "HTTP Archive Viewer",
              version: VERSION,
            },
          },
        };

        let mimeType = "";
        let ext = "";

        switch (options.format) {
          case "har":
            mimeType = "application/json";
            ext = ".har";
            break;
          default:
            mimeType = "text/plain";
            ext = ".txt";
        }

        const e = document.createElement("a");
        e.setAttribute("href", `data:${mimeType};charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`);
        e.setAttribute("download", options.filename + ext);
        e.style.display = "none";
        document.body.appendChild(e);
        e.click();
        document.body.removeChild(e);

        showExportDialog.value = false;
      };

      return {
        loadError,
        onLoadFile,
        onLoadUrl,
        harContent,
        filteredEntries,
        filterEntries,
        isLoading,
        onSelectEntry,
        selectedEntry,
        selectedIndex,
        filename,
        statusCodes,
        types,
        onTypeSelected,
        onStatusCodeSelected,
        showExportDialog,
        onExport,
      };
    },
  };
</script>

<template>
  <!--TODO: add filter options-->
  <div class="wrapper">
    <Header
      :has-error="!!loadError"
      :loading="isLoading"
      :is-loaded="!!harContent"
      @load-file="onLoadFile"
      @load-url="onLoadUrl"
      @export="showExportDialog = true"
    />
    <main>
      <div
        v-if="isLoading"
        class="viewer-loading"
      >
        <span>Loading...</span>
      </div>
      <div
        v-if="!isLoading && loadError"
        class="viewer-error"
      >
        <span v-text="loadError" />
      </div>
      <div
        v-if="!isLoading && harContent"
        class="viewer"
      >
        <MetaBar
          :browser="harContent.browser"
          :creator="harContent.creator"
          :pages="harContent.pages"
          :version="harContent.version"
          :filename="filename"
          @select-page="filterEntries"
        />
        <div class="viewer-content">
          <aside class="sidebar">
            <FilterControl
              :status-codes="statusCodes"
              :types="types"
              @selectedType="onTypeSelected"
              @selectedStatusCode="onStatusCodeSelected"
            />
            <div class="viewer-entries">
              <Entry
                v-for="(entry, i) in filteredEntries"
                :key="i"
                :entry="entry"
                :class="{ active: i === selectedIndex }"
                @select="onSelectEntry(entry, i)"
              />
            </div>
          </aside>
          <EntryDetails
            v-if="selectedEntry"
            :entry="selectedEntry"
            class="viewer-details"
          />
        </div>
      </div>
    </main>
    <Footer />
  </div>
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
  .wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  main {
    flex-grow: 1;
    min-height: 0;

    background-color: var(--color-background);
    color: var(--color-text);
  }

  .viewer {
    display: flex;
    flex-direction: column;
    max-height: 100%;
  }

  .viewer-content {
    flex-grow: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    padding-top: .75em;
    padding-bottom: .75em;
  }

  .sidebar {
    padding-left: .75em;
    min-width: 475px;
    max-width: 475px;
    box-sizing: border-box;
  }

  .viewer-entries {
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    margin-top: .5em;
  }

  .viewer-details {
    flex-grow: 1;
    min-width: 0;
    max-height: 100%;
    overflow: hidden;
  }

  .viewer-loading, .viewer-error {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
  }

  .viewer-error {
    font-weight: bold;
    color: var(--color-danger);
  }

  .viewer-loading {
    font-weight: bold;
    color: var(--color-spinner);
  }

  .entry:not(:last-child) {
    margin-bottom: .75em;
  }
</style>
