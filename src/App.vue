<script>
  import { ref } from "vue";
  import { parseHarFile } from "./utils/har";

  import Footer from "./components/Footer";
  import Header from "./components/Header";
  import MetaBar from "./components/MetaBar";

  export default {
    components: {
      Footer,
      Header,
      MetaBar,
    },
    setup() {
      const harContent = ref(null);
      const filteredEntries = ref([]);
      const selectedEntry = ref(null);
      const loadError = ref(null);

      const onPage = page => {
        selectedEntry.value = null;
        filteredEntries.value = harContent.value.entries
          .filter(entry => entry.pageref === page);
      };

      const onSelectEntry = entry => {
        selectedEntry.value = entry;
      };

      const onUploadFile = async file => {
        try {
          const har = await parseHarFile(file);
          loadError.value = null;
          harContent.value = har;
          onPage(har.pages[0].id);
        } catch (e) {
          loadError.value = e.message;
        }
      };

      return {
        loadError,
        onUploadFile,
        harContent,
        filteredEntries,
        onPage,
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
      @upload-file="onUploadFile"
    />
    <main>
      <div v-if="harContent">
        <MetaBar
          :browser="harContent.browser"
          :creator="harContent.creator"
          :pages="harContent.pages"
          :version="harContent.version"
        />
        <div class="viewer-content">
          <table>
            <thead>
              <tr>
                <th>
                  Method
                </th>
                <th>
                  Name
                </th>
                <th>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(entry, i) in filteredEntries"
                :key="i"
                style="cursor: pointer;"
                @click="onSelectEntry(entry)"
              >
                <td>{{ entry.request.method }}</td>
                <td>{{ entry.request.url.split("?")[0] }}</td>
                <td>{{ entry.response.status }}</td>
              </tr>
            </tbody>
          </table>
          <div>
            {{ selectedEntry }}
          </div>
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
  }

  .viewer {
    flex-direction: column;
    max-height: 100%;
  }

  .viewer-header {
    flex-direction: row;
    margin: .5em 1em;
    align-items: center;
  }

  .viewer-content {
    overflow-y: auto;
    flex-grow: 1;
    min-height: 0;
    flex-direction: row;
  }
</style>
