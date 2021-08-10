<script>
  import Modal from "../Modal";

  export default {
    name: "InfoDialog",
    components: { Modal },
    props: {
      creator: {
        type: Object,
        default: () => ({}),
      },
      version: {
        type: String,
        default: "",
      },
    },
    emits: ["close"],
    setup(_, { emit }) {
      const onClose = () => emit("close");

      return {
        onClose,
      };
    },
  };
</script>

<template>
  <Modal>
    <template #header>
      <div class="dialog-header">
        <span>Info</span>
      </div>
    </template>
    <div class="details column">
      HAR Version: {{ version }}<br>
      Creator: {{ creator.name }} ({{ creator.version }})
    </div>
    <template #footer>
      <button
        v-if="!isAttached"
        class="btn btn-primary"
        type="button"
        @click="onClose"
      >
        Close
      </button>
    </template>
  </Modal>
</template>
