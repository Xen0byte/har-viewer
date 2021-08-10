<script>
  import svgDownload from "@mdi/svg/svg/download.svg";
  import svgUpload from "@mdi/svg/svg/upload.svg";
  import svgWeb from "@mdi/svg/svg/web.svg";
  import svgTune from "@mdi/svg/svg/tune.svg";
  import svgInformation from "@mdi/svg/svg/information.svg";

  export default {
    name: "AppBar",
    props: {
      isLoaded: {
        type: Boolean,
        default: false,
      },
    },
    emits: ["action"],
    setup(_, { emit }) {
      const onExport = () => emit("action", "export");
      const onOpenFile = () => emit("action", "openFile");
      const onLoadUrl = () => emit("action", "loadUrl");
      const onShowInfo = () => emit("action", "info");
      const onSortAndFilter = () => emit("action", "sort-and-filter");

      return {
        svgDownload,
        svgUpload,
        svgWeb,
        svgTune,
        svgInformation,
        onExport,
        onShowInfo,
        onOpenFile,
        onLoadUrl,
        onSortAndFilter,
      };
    },
  };
</script>

<template>
  <header class="appbar">
    <div class="brand">
      <h1>
        HTTP Archive Viewer
      </h1>
      <h1>
        HAR Viewer
      </h1>
    </div>
    <div class="actions">
      <button
        v-if="isLoaded"
        type="button"
        class=" btn-primary-dark"
        title="Export"
        style="display: none"
        @click="onExport"
      >
        <img :src="svgDownload">
        <span>Export</span>
      </button>
      <button
        v-if="isLoaded"
        type="button"
        class="btn btn-primary-dark"
        title="Show Info"
        @click="onShowInfo"
      >
        <img :src="svgInformation">
      </button>
      <button
        v-if="isLoaded"
        type="button"
        class="btn btn-primary-dark"
        title="Filter / Sort / Group"
        @click="onSortAndFilter"
      >
        <img :src="svgTune">
      </button>
      <button
        type="button"
        class="btn btn-primary-dark"
        title="Open File"
        @click="onOpenFile"
      >
        <img :src="svgUpload">
        <span>Open File</span>
      </button>
      <button
        type="button"
        class="btn btn-primary-dark"
        title="Load URL"
        @click="onLoadUrl"
      >
        <img :src="svgWeb">
        <span>Load URL</span>
      </button>
    </div>
  </header>
</template>

<style
  lang="scss"
  scoped
>
  .appbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    background: var(--color-primary);
    padding: .5rem .75rem;

    & .brand {
      h1:last-child {
        display: none;
      }
    }

    & .actions {
      display: flex;

      & button > span {
        margin-left: .5rem;
      }

      & button > img {
        filter: invert(99%) sepia(1%) saturate(2%) hue-rotate(66deg) brightness(117%) contrast(100%);
      }

      & button:not(:last-child) {
        margin-right: .35rem;
      }
    }

    & .brand > h1 {
      color: var(--color-primary-text);
      font-size: 1.25rem;
      font-weight: 400;
      line-height: 1.5;
      user-select: none;
    }
  }

  @media (max-width: 280px) {
    .appbar {
      padding: .5rem .5rem;

      & .actions button:not(:last-child) {
        margin-right: .25em;
      }
    }
  }

  @media (max-width: 375px) {
    .appbar {
      & .brand {
        h1:first-child {
          display: none;
        }

        h1:last-child {
          display: inline-block;
        }
      }
    }
  }

  @media (max-width: 579px) {
    .appbar {
      & .actions button > span {
        display: none;
      }
    }
  }
</style>
