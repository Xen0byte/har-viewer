<script setup>
  import Modal from "../Modal";

  defineProps({
    creator: {
      type: Object,
      default: () => ({}),
    },
    file: {
      type: String,
      default: "",
    },
    version: {
      type: String,
      default: "",
    },
  });

  const emit = defineEmits(["close"]);
</script>

<template>
  <Modal>
    <template #header>
      <span>Info</span>
    </template>
    <table>
      <tbody>
        <tr>
          <th>File</th>
          <td v-text="file" />
        </tr>
        <tr>
          <th>Creator</th>
          <td v-text="`${creator.name} (${creator.version})`" />
        </tr>
        <tr>
          <th>HAR Version</th>
          <td v-text="version" />
        </tr>
      </tbody>
    </table>
    <template #footer>
      <button
        class="btn btn-primary"
        type="button"
        @click="emit('close')"
      >
        Close
      </button>
    </template>
  </Modal>
</template>
