<script>
  import { onMounted, onBeforeUnmount } from "vue";

  export default {
    name: "Modal",
    emits: ["close"],
    setup(_, { emit }) {
      const emitClose = () => emit("close");

      onMounted(() => document.addEventListener("keyup", emitClose));
      onBeforeUnmount(() => document.removeEventListener("keyup", emitClose));

      return {
        emitClose,
      };
    },
  };
</script>

<template>
  <div
    class="modal-mask"
    @click="emitClose"
  >
    <div class="modal-wrapper">
      <div
        class="modal-container"
        @click.stop
      >
        <div class="modal-header">
          <h2 v-if="$slots.header">
            <slot name="header" />
          </h2>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div
          v-if="$slots.footer"
          class="modal-footer"
        >
          <div>
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  lang="scss"
  scoped
>
  h2 {
    color: var(--color-primary-500);
    user-select: none;
    margin: 0;
  }

  .modal-header {
    background-color: var(--color-primary);
    padding: .5rem;
    color: white;
  }

  .modal-footer {
    padding: .5rem;
    width: 100%;

    & > div {
      display: flex;
      justify-content: flex-end;
    }

    & ::v-deep(:not(:last-child)) {
      margin-right: .5em;
    }
  }

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .modal-body {
    padding: .75rem;
    color: var(--color-text);
  }

  .modal-container {
    background-color: var(--color-background);
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    overflow: auto;
    max-height: 75vh;
    max-width: 75vw;
  }
</style>
