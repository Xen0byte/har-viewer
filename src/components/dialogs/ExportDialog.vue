<script>
  import { ref } from "vue";

  import Modal from "../Modal";

  export default {
    name: "ExportDialog",
    components: { Modal },
    emits: ["export", "close"],
    setup(props, { emit }) {
      const availableFormats = {
        har: ".har",
      };

      const filename = ref(`exported_${(new Date()).toISOString().split("T")[0]}`);
      const onlyFiltered = ref(true);
      const format = ref("har");

      const onClose = () => emit("close");
      const onExport = () => emit("export", {
        format: format.value,
        filename: filename.value,
        onlyFiltered: onlyFiltered.value,
      });

      return {
        availableFormats,
        filename,
        onlyFiltered,
        format,
        onClose,
        onExport,
      };
    },
  };
</script>

<template>
  <Modal>
    <template #header>
      Export
    </template>
    <form class="export-form">
      <label for="filename">Filename</label>
      <input
        id="filename"
        v-model="filename"
        type="text"
      >
      <label for="filter">Respect filter</label>
      <input
        id="filter"
        v-model="onlyFiltered"
        type="checkbox"
      >
      <label for="format">Output Format</label>
      <select
        id="format"
        v-model="format"
      >
        <option
          v-for="(displayValue, index) in availableFormats"
          :key="index"
          :value="index"
        >
          {{ displayValue }}
        </option>
      </select>
    </form>
    <template #footer>
      <button
        class="btn-cancel"
        type="button"
        @click="onClose"
      >
        Cancel
      </button>
      <button
        class="btn-primary"
        type="button"
        @click="onExport"
      >
        Export
      </button>
    </template>
  </Modal>
</template>

<style
  lang="scss"
  scoped
>
  .export-form {
    display: grid;
    grid-template-columns: 150px 1fr;
    grid-gap: 1em;

    label {
      grid-column: 1 / 2;
      align-self: center;
      color: var(--color-text);
    }

    input {
      grid-column: 2 / 3;
    }
  }
</style>
