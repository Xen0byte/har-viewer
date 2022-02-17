<script setup>
  import svgDownload from "@mdi/svg/svg/download.svg";
  import svgFolderOpen from "@mdi/svg/svg/folder-open-outline.svg";
  import svgFilterMenu from "@mdi/svg/svg/filter-menu-outline.svg";
  import svgInformation from "@mdi/svg/svg/information-outline.svg";

  defineProps({
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
        v-if="isLoaded"
        type="button"
        class="btn btn-primary-dark"
        title="Export file"
        @click="emit('action', 'export')"
      >
        <img
          alt="Download Icon"
          role="none"
          class="icon"
          :src="svgDownload"
        >
      </button>
      <button
        v-if="isLoaded"
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
        v-if="isLoaded"
        type="button"
        class="btn btn-primary-dark"
        title="Filter / Sort / Group"
        @click.exact="emit('action', 'sort-and-filter')"
        @click.shift="emit('action', 'sort-and-filter_attached')"
      >
        <img
          alt="Settings Icon"
          role="none"
          class="icon"
          :src="svgFilterMenu"
        >
      </button>
      <button
        type="button"
        class="btn btn-primary-dark"
        @click="emit('action', 'open')"
      >
        <img
          alt="Open Icon"
          role="none"
          class="icon"
          :src="svgFolderOpen"
        >
        <span>Open File</span>
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
    gap: .35rem;
  }

  @media (max-width: 280px) {
    .appbar {
      padding: .5rem .5rem;
    }

    .actions {
      gap: .25rem;
    }
  }

  @media (max-width: 415px) {
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
