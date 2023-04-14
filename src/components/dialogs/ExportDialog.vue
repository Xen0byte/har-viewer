<script setup>
  import { ref } from "vue";

  import Modal from "../Modal.vue";

  const emit = defineEmits(["close", "export"]);

  const availableFormats = {
    har: "HTTP Archive",
    postman: "Postman Collection",
    csv: "CSV (Reduced)",
  };

  const filename = ref(`exported_${(new Date()).toISOString().split("T")[0]}`);
  const onlyFiltered = ref(true);
  const redact = ref(false);
  const redactWordList = ref("");
  const format = ref("har");
  const csvExcel = ref(false);

  const onExport = () => emit("export", {
    format: format.value,
    filename: filename.value,
    onlyFiltered: onlyFiltered.value,
    redact: redact.value,
    csvExcel: csvExcel.value,
    redactWordList: redactWordList.value,
  });
</script>

<template>
  <Modal>
    <template #header>
      Export
    </template>
    <form
      class="is-unselectable"
      @submit.prevent
    >
      <div>
        <label for="filename">Filename</label>
        <input
          id="filename"
          v-model="filename"
          type="text"
        >
      </div>
      <div>
        <label for="filter">Respect filter</label>
        <input
          id="filter"
          v-model="onlyFiltered"
          type="checkbox"
        >
      </div>
      <div>
        <label for="redact">Redact sensitive values</label>
        <input
          id="redact"
          v-model="redact"
          type="checkbox"
        >
      </div>
      <div v-if="redact">
        <label for="redactWordList">Custom Word List</label>
        <textarea
          id="redactWordList"
          v-model="redactWordList"
          rows="3"
          placeholder="Separated by comma (leave empty to use default values)"
        />
      </div>
      <div>
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
      </div>
      <div v-if="format === 'csv'">
        <label
          for="csvExcel"
          title="Allows to open the csv directly in MS Excel without using data import"
        >
          Add MS Excel metadata
        </label>
        <input
          id="csvExcel"
          v-model="csvExcel"
          type="checkbox"
        >
      </div>
    </form>
    <template #footer>
      <button
        class="btn btn-dark"
        type="button"
        @click="emit('close')"
      >
        Cancel
      </button>
      <button
        class="btn btn-primary"
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
  form {
    min-width: 350px;
    max-width: 350px;

    & > div:not(:last-of-type) {
      margin-bottom: .5rem;
    }

    & input[type=text], select {
      margin-top: .1rem;
    }

    & input[type=checkbox] {
      margin-left: .5rem;
    }

    @media (max-width: 475px) {
      min-width: unset;
      max-width: unset;
    }
  }

  label {
    font-weight: 600;
  }
</style>
