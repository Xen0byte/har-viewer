<script>
  import { ref } from "vue";

  export default {
    props: {
      error: {
        type: String,
        default: null,
      },
    },
    emits: [
      "upload-file",
    ],
    setup(props, { emit }) {
      const fileInputRef = ref(null);

      const onLoadFromFile = () => fileInputRef.value.click();
      const onLoadFromUrl = () => {
      };

      const onFileUpload = ({ target: input }) => {
        // check if file uploaded
        if (!input.files || input.files.length !== 1) {
          return;
        }

        emit("upload-file", input.files[0]);
      };

      return {
        fileInputRef,
        onLoadFromFile,
        onLoadFromUrl,
        onFileUpload,
      };
    },
  };
</script>

<template>
  <header class="header">
    <nav>
      <span class="is-unselectable">
        HAR Viewer
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
        >
          {{ error }}
        </span>
        <button
          class="btn-primary"
          type="button"
          @click="onLoadFromFile"
        >
          <span class="icon">
            <i class="mdi mdi-file-upload" />
          </span>
          <span>Open File</span>
        </button>
        <button
          disabled
          class="btn-primary"
          type="button"
          style="margin-left: 1em;"
          @click="onLoadFromUrl"
        >
          <span class="icon">
            <i class="mdi mdi-web" />
          </span>
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
    padding: .5em 1em;

    & nav {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  @media (prefers-color-scheme: dark) {
    .header {
      background-color: map.get($colors-dark, "background.paper");
      color: map.get($colors-dark, "text.primary");
    }
  }

  @media (prefers-color-scheme: light) {
    .header {
      background-color: map.get($colors-light, "background.paper");
      color: map.get($colors-light, "text.primary");
    }
  }
</style>
