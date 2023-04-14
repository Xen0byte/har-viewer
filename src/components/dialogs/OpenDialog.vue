<script setup>
  import { ref } from "vue";

  import svgUpload from "@mdi/svg/svg/upload-outline.svg";
  import svgDownload from "@mdi/svg/svg/download-outline.svg";
  import svgLoading from "@mdi/svg/svg/loading.svg";

  import parseHar from "../../utils/parser/index.js";
  import { readFile } from "../../utils/helpers.js";
  import Modal from "../Modal.vue";

  const emit = defineEmits(["close", "open"]);

  const loadFrom = ref("file");
  const loadUrl = ref("");
  const loadedFile = ref("");
  const isLoading = ref(false);
  const hasError = ref(false);
  const filterEnabled = ref(false);

  const page = ref("");
  const pages = ref([]);

  let data = null;
  let src = "";

  const loadFromUrl = async uri => {
    if (!uri) {
      return;
    }

    try {
      // eslint-disable-next-line no-new
      new URL(uri);
    } catch (e) {
      hasError.value = "Invalid URL";
      return;
    }

    loadedFile.value = uri;
    isLoading.value = "Downloading...";

    try {
      const res = await window.fetch(uri);
      const resData = await res.json();

      hasError.value = false;
      isLoading.value = "Parsing file...";
      data = parseHar(resData);
      src = loadedFile.value;
      pages.value = data.pages;
      filterEnabled.value = true;
    } catch (e) {
      hasError.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const onOpen = async () => {
    if (!filterEnabled.value && loadFrom.value === "url") {
      await loadFromUrl(loadUrl.value);
    }

    if (!src || !data) {
      return;
    }

    if (page.value) {
      data.entries = data.entries.filter(e => e.pageref === page.value);
      data.pages = data.pages.filter(p => p.id === page.value);
    }

    emit("open", {
      src,
      data,
      filter: {},
    });
  };

  const openFile = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".har";

    fileInput.onchange = async ({ target: input }) => {
      if (!input.files || input.files.length !== 1) {
        return;
      }

      filterEnabled.value = false;
      hasError.value = false;
      loadedFile.value = input.files[0].name;
      isLoading.value = "Parsing file...";

      try {
        if (input.files[0].type && input.files[0].type !== "application/json") {
          // eslint-disable-next-line no-console
          console.error("mime type does not match");
          throw new Error("invalid HAR file: wrong file type");
        }

        const content = await readFile(input.files[0]);
        const harContent = JSON.parse(content);

        data = parseHar(harContent);
        src = loadedFile.value;
        pages.value = data.pages;
        filterEnabled.value = true;
      } catch (e) {
        hasError.value = e.message;
      } finally {
        isLoading.value = false;
      }
    };

    fileInput.click();
  };
</script>

<template>
  <Modal>
    <template #header>
      <span>Open File</span>
    </template>
    <form
      class="is-unselectable"
      @submit.prevent
    >
      <div class="load-from">
        Load from:
        <input
          id="file"
          v-model="loadFrom"
          type="radio"
          value="file"
          @click="hasError = false; loadUrl = ''"
        >
        <label for="file">File</label>
        <input
          id="url"
          v-model="loadFrom"
          type="radio"
          value="url"
          @click="hasError = false; loadedFile = ''"
        >
        <label for="url">URL</label>
      </div>
      <div class="load-file">
        <label
          v-if="loadFrom === 'file'"
          for="filePath"
        >
          Select the file you want to open:
        </label>
        <div
          v-if="loadFrom === 'file'"
          class="file-input"
        >
          <input
            id="filePath"
            v-model="loadedFile"
            type="text"
            readonly
          >
          <button
            class="btn btn-dark"
            type="button"
            title="Open file dialog"
            @click="openFile"
          >
            <img
              alt="Upload Icon"
              role="none"
              class="icon"
              :src="svgUpload"
            >
          </button>
        </div>
        <label
          v-if="loadFrom === 'url'"
          for="urlPath"
        >
          Enter the URL you want to load the file from:
        </label>
        <div
          v-if="loadFrom === 'url'"
          class="file-input"
        >
          <input
            id="urlPath"
            v-model="loadUrl"
            type="text"
            @keyup.enter="() => loadFromUrl(loadUrl)"
            @change="filterEnabled = false"
          >
          <button
            class="btn btn-dark"
            type="button"
            title="Pre-Download file"
            @click="() => loadFromUrl(loadUrl)"
          >
            <img
              alt="Download Icon"
              role="none"
              class="icon"
              :src="svgDownload"
            >
          </button>
        </div>
        <div
          v-if="!!hasError"
          class="error"
          v-text="hasError"
        />
      </div>
      <fieldset
        class="initial-filter"
        :disabled="!filterEnabled"
      >
        <legend>Initial Filter</legend>
        <label for="pages">
          Page
        </label>
        <select
          id="pages"
          v-model="page"
        >
          <option value="">
            All
          </option>
          <option
            v-for="p in pages"
            :key="p.id"
            :value="p.id"
            v-text="p.title"
          />
        </select>
      </fieldset>
    </form>
    <template #footer>
      <div
        v-if="!!isLoading"
        class="spinner"
      >
        <img
          :alt="isLoading"
          :src="svgLoading"
        >
        <span
          class="is-unselectable"
          v-text="isLoading"
        />
      </div>
      <button
        class="btn btn-primary"
        type="button"
        :disabled="!(loadFrom === 'file' && loadedFile && !hasError)
          && !(loadFrom === 'url' && loadUrl && !hasError)"
        @click="onOpen"
      >
        Open
      </button>
      <button
        class="btn btn-primary"
        type="button"
        @click="emit('close')"
      >
        Cancel
      </button>
    </template>
  </Modal>
</template>

<style
  lang="scss"
  scoped
>
  form {
    min-width: 400px;
    max-width: 400px;

    @media (max-width: 475px) {
      min-width: unset;
      max-width: unset;
    }
  }

  .error {
    padding-left: .5rem;
    padding-right: .5rem;
    padding-top: .25rem;
    color: var(--color-background-error);
  }

  .spinner {
    height: 24px;
    flex-grow: 1;
    display: flex;
    align-items: center;
    margin-right: 1.5rem !important;

    & > img {
      height: 24px;
      width: 24px;
      margin-right: 0 !important;
    }

    & > span {
      margin-left: .5rem;
      color: var(--color-text);
    }
  }

  label {
    font-weight: 600;
  }

  .initial-filter {
    margin-top: .5rem;
    border-color: var(--color-background-dark);
    border-radius: 5px;

    & > input:not(:last-of-type) {
      margin-bottom: .5rem;
    }

    & > input[type=text], select {
      margin-top: .1rem;
    }
  }

  .load-from {
    display: flex;
    margin-bottom: .5rem;
    align-items: center;

    & > input {
      margin-left: .75rem;
      margin-right: .3rem;
    }
  }

  .load-file input {
    height: 36px;
  }

  .file-input {
    margin-top: .25rem;
    display: flex;

    & > input {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    & > button {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
</style>
