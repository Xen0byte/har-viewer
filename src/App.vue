<script>
  import { ref, onMounted, onBeforeMount } from "vue";
  import EntryDetails from "./components/EntryDetails";

  import { switchTheme, getSystemTheme } from "./utils/theme";
  import { parseHarFile, checkHar } from "./utils/har";

  import Footer from "./components/Footer";
  import Header from "./components/Header";
  import MetaBar from "./components/MetaBar";
  import Entry from "./components/Entry";

  export default {
    components: {
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
      const filteredEntries = ref([]);
      const loadError = ref(null);
      const isLoading = ref(false);
      const selectedEntry = ref(null);
      const selectedIndex = ref(null);

      const filterEntries = page => {
        selectedEntry.value = null;
        selectedIndex.value = null;
        filteredEntries.value = harContent.value.entries
          .filter(entry => (page ? entry.pageref === page : true))
          .sort((a, b) => new Date(a.startedDateTime) - new Date(b.startedDateTime));
      };

      const onLoadFile = async file => {
        loadError.value = null;
        isLoading.value = true;

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

      const onDownloadRedacted = () => {
        // TODO: implement reacted download
        // eslint-disable-next-line no-alert
        window.alert("not implemented");
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
        onDownloadRedacted,
        filename,
      };
    },
  };
</script>

<template>
  <!--TODO: add filter options-->
  <div class="wrapper">
    <Header
      :error="loadError"
      :loading="isLoading"
      :is-loaded="!!harContent"
      @load-file="onLoadFile"
      @load-url="onLoadUrl"
      @download-redacted="onDownloadRedacted"
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
          <div class="viewer-entries">
            <Entry
              v-for="(entry, i) in filteredEntries"
              :key="i"
              :entry="entry"
              :class="{ active: i === selectedIndex }"
              @select="onSelectEntry(entry, i)"
            />
          </div>
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

  .viewer-entries {
    min-width: 500px;
    max-width: 500px;
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding-left: .75em;
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
