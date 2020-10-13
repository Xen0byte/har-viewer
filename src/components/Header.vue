<script>
  import { ref } from "vue";
  import svgFileUpload from "@mdi/svg/svg/file-upload.svg";
  import svgWeb from "@mdi/svg/svg/web.svg";

  export default {
    props: {
      error: {
        type: String,
        default: null,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    emits: [
      "load-file",
      "load-url",
    ],
    setup(props, { emit }) {
      const fileInputRef = ref(null);
      const iconFileUpload = ref(svgFileUpload);
      const iconWeb = ref(svgWeb);

      const onLoadFromFile = () => fileInputRef.value.click();
      const onLoadFromUrl = () => {
        // TODO: better modal
        // eslint-disable-next-line no-alert
        const url = prompt("Enter the URL of the HAR file to load:");

        if (url) {
          emit("load-url", url);
        }
      };

      const onFileUpload = ({ target: input }) => {
        // check if file uploaded
        if (!input.files || input.files.length !== 1) {
          return;
        }

        emit("load-file", input.files[0]);
      };

      return {
        fileInputRef,
        onLoadFromFile,
        onLoadFromUrl,
        onFileUpload,
        iconFileUpload,
        iconWeb,
      };
    },
  };
</script>

<template>
  <header class="header">
    <nav>
      <span
        class="is-unselectable"
        style="font-size: 1.25rem;"
      >
        HTTP Archive Viewer
      </span>
      <div>
        <input
          ref="fileInputRef"
          type="file"
          accept=".har"
          hidden
          @change="onFileUpload"
        >
        <span
          v-if="error"
          class="text-error"
          style="margin-right: 1em; font-weight: bold;"
          v-text="error"
        />
        <button
          :disabled="loading"
          class="btn-primary"
          type="button"
          @click="onLoadFromFile"
        >
          <img
            :src="iconFileUpload"
            class="icon"
            width="18"
            height="18"
          >
          <span>Open File</span>
        </button>
        <button
          :disabled="loading"
          class="btn-primary"
          type="button"
          style="margin-left: .5em;"
          @click="onLoadFromUrl"
        >
          <img
            :src="iconWeb"
            class="icon"
            width="18"
            height="18"
          >
          <span>Load From URL</span>
        </button>
      </div>
    </nav>
  </header>
</template>

<style
  lang="scss"
  scoped
>
  @use "sass:map";
  @import "../styles/colors";

  .header {
    padding: .5em .5em .5em 1em;
    background-color: map.get($colors, "primary.main");
    color: map.get($colors, "primary.contrast");

    & nav {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
