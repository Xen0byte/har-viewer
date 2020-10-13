<script>
  import { ref } from "vue";
  import { parseHarFile } from "./utils/har";

  import Footer from "./components/Footer";
  import Header from "./components/Header";
  import MetaBar from "./components/MetaBar";
  import Entry from "./components/Entry";

  export default {
    components: {
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

      const filterEntries = page => {
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
        v-if="harContent"
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
          <Entry
            v-for="(entry, i) in [filteredEntries[0]]"
            :key="i"
            :entry="entry"
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
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
