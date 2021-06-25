<script>
  import Modal from "../Modal";

  export default {
    name: "PropDialog",
    components: { Modal },
    emits: ["apply", "close"],
    setup(_, { emit }) {
      const onClose = () => emit("close");
      const onApply = () => emit("apply");

      return {
        onClose,
        onApply,
      };
    },
  };
</script>

<template>
  <modal>
    <template #header>
      Sort / Filter / Group
    </template>
    <template #footer>
      <button
        class="btn"
        type="button"
        @click="onClose"
      >
        Cancel
      </button>
      <button
        class="btn"
        type="button"
        @click="onApply"
      >
        Apply
      </button>
    </template>
  </modal>
</template>

<style
  lang="scss"
  scoped
>
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
