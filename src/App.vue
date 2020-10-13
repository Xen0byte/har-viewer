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
      const loadError = ref(null);

      const onPage = page => {
        filteredEntries.value = harContent.value.entries
          .filter(entry => entry.pageref === page);
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
      <div
        v-if="harContent"
        class="viewer"
      >
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
              >
                <td>{{ entry.request.method }}</td>
                <td>{{ entry.request.url.split("?")[0] }}</td>
                <td>{{ entry.response.status }}</td>
              </tr>
            </tbody>
          </table>
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
  }
</style>
