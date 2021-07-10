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
    <div class="details">
      HAR Version: {{ version }}<br>
      Creator: {{ creator.name }} ({{ creator.version }})
    </div>
    <template #footer>
      <button
        v-if="!isAttached"
        class="btn"
        type="button"
        @click="onClose"
      >
        Close
      </button>
    </template>
  </Modal>
</template>

<style
  lang="scss"
  scoped
>
  .details {
    display: flex;
    flex-direction: column;
  }

  .btn {
    background-color: var(--color-primary);
    border: none;
    color: #ffffff;
    padding: .375rem .75rem;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1.5;
    font-weight: 400;
    border-radius: .25rem;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;

    transition: background-color .15s ease-in-out;

    &:hover {
      background-color: var(--color-primary-light);
    }
  }
</style>
