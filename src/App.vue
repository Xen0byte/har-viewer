<script>
  import { ref } from "vue";

  export default {
    setup() {
      const uploadRef = ref(null);
      const harContent = ref(null);
      const selectedPage = ref(null);
      const filteredEntries = ref([]);
      const selectedEntry = ref(null);

      const onPage = () => {
        selectedEntry.value = null;
        filteredEntries.value = harContent.value.entries
          .filter(entry => entry.pageref === selectedPage.value);
      };

      const onUpload = () => {
        uploadRef.value.click();
      };

      const onSelectEntry = entry => {
        selectedEntry.value = entry;
      };

      const onUploadRef = async e => {
        const input = e.target;

        if (!("files" in input && input.files.length > 0)) {
          return;
        }

        const readFile = () => new Promise(((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = event => resolve(event.target.result);
          reader.onerror = error => reject(error);
          reader.readAsText(input.files[0]);
        }));

        const content = await readFile();
        const har = JSON.parse(content);
        harContent.value = har.log;
        selectedPage.value = har.log.pages[0].id;
        onPage();
      };

      return {
        uploadRef,
        onUpload,
        onUploadRef,
        harContent,
        selectedPage,
        filteredEntries,
        onPage,
        onSelectEntry,
        selectedEntry,
      };
    },
  };
</script>

<template>
  <div class="is-flex wrapper">
    <header>
      <nav
        class="navbar is-unselectable is-dark"
        role="navigation"
        aria-label="main navigation"
      >
        <div class="navbar-brand">
          <span class="navbar-item">
            HAR Viewer
          </span>
        </div>
        <div class="navbar-menu">
          <div class="navbar-end">
            <div class="navbar-item">
              <div class="field is-grouped">
                <p class="control">
                  <input
                    ref="uploadRef"
                    type="file"
                    accept=".har"
                    hidden
                    @change="onUploadRef"
                  >
                  <button
                    class="button is-link"
                    type="button"
                    @click="onUpload"
                  >
                    <span class="icon">
                      <i class="mdi mdi-file-upload" />
                    </span>
                    <span>Load HAR File</span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
    <main class="has-background-grey-dark has-text-light">
      <div
        v-if="harContent"
        class="is-flex viewer"
      >
        <div class="is-flex viewer-header">
          <div>
            <b class="is-unselectable">Version: </b>
            {{ harContent.version ? harContent.version : "unknown" }}
          </div>
          <div
            v-if="harContent.browser"
            style="margin-left: 1em;"
          >
            <b class="is-unselectable">Browser: </b>
            {{ harContent.browser.name ? harContent.browser.name : "Unknown" }}
            ({{ harContent.browser.version ? harContent.browser.version : "unknown" }})
          </div>
          <div
            v-if="harContent.creator"
            style="margin-left: 1em;"
          >
            <b class="is-unselectable">Creator: </b>
            {{ harContent.creator.name ? harContent.creator.name : "Unknown" }}
            ({{ harContent.creator.version ? harContent.creator.version : "unknown" }})
          </div>
          <div
            class="select"
            style="margin-left: auto;"
          >
            <select
              v-model="selectedPage"
              class="is-unselectable"
              @change="onPage"
            >
              <option
                v-for="page in harContent.pages"
                :key="page.id"
                :value="page.id"
              >
                {{ page.title }}
              </option>
            </select>
          </div>
        </div>
        <div class="viewer-content is-flex">
          <table class="table has-background-dark has-text-light">
            <thead class="is-unselectable">
              <tr>
                <th class="has-text-light">
                  Method
                </th>
                <th class="has-text-light">
                  Name
                </th>
                <th class="has-text-light">
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
    <footer class="footer is-unselectable has-background-dark has-text-light">
      <div class="content has-text-centered">
        <p>
          <strong class="has-text-light">HAR Viewer</strong> by
          <a
            target="_blank"
            href="https://github.com/develerik"
          >
            Erik Bender
          </a>.
          The source code is licensed
          <a
            target="_blank"
            href="https://opensource.org/licenses/ISC"
          >
            ISC
          </a>.
        </p>
      </div>
    </footer>
  </div>
</template>

<style
  lang="scss"
  scoped
>
  .wrapper {
    flex-direction: column;
    height: 100vh;

    & main {
      flex-grow: 1;
      min-height: 0;
    }
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

  .footer {
    padding: 1rem 1.5rem 1rem;
  }
</style>
