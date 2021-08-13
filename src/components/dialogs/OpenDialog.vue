<script setup>
  import { ref } from "vue";

  import svgUpload from "@mdi/svg/svg/upload-outline.svg";
  import svgLoading from "@mdi/svg/svg/loading.svg";

  import { parseHarFile, checkHar } from "../../utils/har";
  import Modal from "../Modal";

  const emit = defineEmits(["close", "open"]);

  const loadFrom = ref("file");
  const loadUrl = ref("");
  const loadedFile = ref("");
  const isLoading = ref(false);
  const hasError = ref(false);

  let data = null;
  let src = "";

  const loadFromUrl = async uri => {
    if (!uri) {
      return;
    }

    try {
      // eslint-disable-next-line no-new
      new URL(uri);
    } catch (_) {
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
      data = checkHar(resData);
      src = loadedFile.value;
    } catch (e) {
      hasError.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const onOpen = async () => {
    if (loadFrom.value === "url") {
      await loadFromUrl(loadUrl.value);
    }

    if (!src || !data) {
      return;
    }

    emit("open", { src, data });
  };

  const openFile = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".har";

    fileInput.onchange = async ({ target: input }) => {
      if (!input.files || input.files.length !== 1) {
        return;
      }

      hasError.value = false;
      loadedFile.value = input.files[0].name;
      isLoading.value = "Parsing file...";

      try {
        data = await parseHarFile(input.files[0]);
        src = loadFrom.value;
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
            aria-label="Open file dialog"
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
        <input
          v-if="loadFrom === 'url'"
          id="urlPath"
          v-model="loadUrl"
          type="text"
        >
        <div
          v-if="!!hasError"
          class="error"
          v-text="hasError"
        />
      </div>
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
        :disabled="!(loadFrom === 'file' && loadedFile && !hasError) && !(loadFrom === 'url' && loadUrl)"
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

  #urlPath {
    margin-top: .25rem;
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

  .load-from {
    display: flex;
    align-items: center;
    margin-bottom: .5rem;

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
