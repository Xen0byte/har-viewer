<script setup>
  import svgDownload from "@mdi/svg/svg/download.svg";
  import svgUpload from "@mdi/svg/svg/upload.svg";
  import svgWeb from "@mdi/svg/svg/web.svg";
  import svgTune from "@mdi/svg/svg/tune.svg";
  import svgInformation from "@mdi/svg/svg/information.svg";

  const props = defineProps({
    isLoaded: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(["action"]);
</script>

<template>
  <header class="appbar">
    <div
      class="brand is-unselectable"
      role="banner"
    >
      <h1>
        HTTP Archive Viewer
      </h1>
      <h1>
        HAR Viewer
      </h1>
    </div>
    <div class="actions">
      <button
        v-if="props.isLoaded && false"
        type="button"
        class=" btn-primary-dark"
        @click="emit('action', 'export')"
      >
        <img
          alt="Download Icon"
          role="none"
          class="icon"
          :src="svgDownload"
        >
        <span>Export</span>
      </button>
      <button
        v-if="props.isLoaded"
        type="button"
        class="btn btn-primary-dark"
        title="Show Info"
        @click="emit('action', 'info')"
      >
        <img
          alt="Information Icon"
          role="none"
          class="icon"
          :src="svgInformation"
        >
      </button>
      <button
        v-if="props.isLoaded"
        type="button"
        class="btn btn-primary-dark"
        title="Filter / Sort / Group"
        @click="emit('action', 'sort-and-filter')"
      >
        <img
          alt="Settings Icon"
          role="none"
          class="icon"
          :src="svgTune"
        >
      </button>
      <button
        type="button"
        class="btn btn-primary-dark"
        @click="emit('action', 'openFile')"
      >
        <img
          alt="Upload Icon"
          role="none"
          class="icon"
          :src="svgUpload"
        >
        <span>Open File</span>
      </button>
      <button
        type="button"
        class="btn btn-primary-dark"
        @click="emit('action', 'loadUrl')"
      >
        <img
          alt="Web Icon"
          role="none"
          class="icon"
          :src="svgWeb"
        >
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
    background: var(--color-primary);
    padding: .5rem .5rem .5rem .75rem;
  }

  .brand > h1 {
    color: var(--color-primary-text);
    font-size: 1.25rem;
    font-weight: 400;

    &:last-child {
      display: none;
    }
  }

  .actions {
    display: flex;

    & > *:not(:last-child) {
      margin-right: .35rem;
    }
  }

  @media (max-width: 280px) {
    .appbar {
      padding: .5rem .5rem;
    }

    .actions > *:not(:last-child) {
      margin-right: .25em;
    }
  }

  @media (max-width: 375px) {
    .brand > h1 {
      &:first-child {
        display: none;
      }

      &:last-child {
        display: inline-block;
      }
    }
  }

  @media (max-width: 579px) {
    .actions button > span {
      display: none;
    }
  }
</style>
