<script>
  import { ref } from "vue";
  import EntryDetails from "./components/EntryDetails";
  import { parseHarFile } from "./utils/har";

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
      const harContent = ref(null);
      const filteredEntries = ref([]);
      const loadError = ref(null);
      const isLoading = ref(false);
      const selectedEntry = ref(false);

      const filterEntries = page => {
        selectedEntry.value = null;
        filteredEntries.value = harContent.value.entries
          .filter(entry => entry.pageref === page)
          .sort((a, b) => new Date(a.startedDateTime) - new Date(b.startedDateTime));
      };

      const onLoadFile = async file => {
        loadError.value = null;
        isLoading.value = true;

        try {
          const har = await parseHarFile(file);

          harContent.value = har;
          filterEntries(har.pages[0].id);
        } catch (e) {
          loadError.value = e.message;
        } finally {
          isLoading.value = false;
        }
      };

      const onSelectEntry = entry => {
        selectedEntry.value = entry;
      };

      const onLoadUrl = async url => {
        loadError.value = null;
        isLoading.value = true;

        try {
          const result = await window.fetch(url);
          console.log(url);
          console.log(result);

          // const har = await parseHarFile(result);
          // harContent.value = har;
          // onPage(har.pages[0].id);
        } catch (e) {
          loadError.value = e.message;
        } finally {
          isLoading.value = false;
        }
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
      };
    },
  };
</script>

<template>
  <div class="wrapper">
    <Header
      :error="loadError"
      :loading="isLoading"
      @load-file="onLoadFile"
      @load-url="onLoadUrl"
    />
    <main>
      <div
        v-if="isLoading"
        class="viewer-loading"
      >
        <div class="spinner">
          <div class="rect1" />
          <div class="rect2" />
          <div class="rect3" />
          <div class="rect4" />
          <div class="rect5" />
        </div>
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
          @select-page="filterEntries"
        />
        <div class="viewer-content">
          <div class="viewer-entries">
            <Entry
              v-for="(entry, i) in filteredEntries"
              :key="i"
              :entry="entry"
              @select="onSelectEntry(entry)"
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
  @use "sass:map";
  @import "./styles/colors";

  .wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  main {
    flex-grow: 1;
    min-height: 0;

    @media (prefers-color-scheme: dark) {
      background-color: map.get($colors-dark, "background.default");
      color: map.get($colors-dark, "text.primary");
    }

    @media (prefers-color-scheme: light) {
      background-color: map.get($colors-light, "background.paper");
      color: map.get($colors-light, "text.primary");
    }
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
    padding: .75em;
    display: flex;
    flex-direction: row;
  }

  .viewer-entries {
    min-width: 600px;
    max-width: 600px;
    margin-right: 1em;
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .viewer-details {
    flex-grow: 1;
    min-width: 0;
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .viewer-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
  }

  .entry:not(:last-child) {
    margin-bottom: 1em;
  }

  .spinner {
    width: 50px;
    height: 100px;
    text-align: center;
    font-size: 10px;

    & > div {
      height: 100%;
      width: 6px;
      display: inline-block;

      animation: sk-stretchdelay 1.2s infinite ease-in-out;

      &:not(:last-child) {
        margin-right: 3px;
      }

      @media (prefers-color-scheme: dark) {
        background-color: map.get($colors-dark, "text.secondary");
      }

      @media (prefers-color-scheme: light) {
        background-color: map.get($colors-light, "text.secondary");
      }
    }

    & > .rect2 {
      animation-delay: -1.1s;
    }

    & > .rect3 {
      animation-delay: -1.0s;
    }

    & > .rect4 {
      animation-delay: -0.9s;
    }

    & > .rect5 {
      animation-delay: -0.8s;
    }

    @keyframes sk-stretchdelay {
      0%, 40%, 100% {
        transform: scaleY(0.4);
      }

      20% {
        transform: scaleY(1.0);
      }
    }
  }
</style>
