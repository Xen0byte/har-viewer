<script setup>
  import Modal from "../Modal";

  const props = defineProps({
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
    <table class="column">
      <tbody>
        <tr>
          <th>File</th>
          <td v-text="props.file" />
        </tr>
        <tr>
          <th>Creator</th>
          <td v-text="`${props.creator.name} (${props.creator.version})`" />
        </tr>
        <tr>
          <th>HAR Version</th>
          <td v-text="props.version" />
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
