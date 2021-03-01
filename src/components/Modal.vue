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
        <h2 v-if="$slots.header">
          <slot name="header" />
        </h2>
        <slot />
        <div
          v-if="$slots.footer"
          class="modal-footer"
        >
          <slot name="footer" />
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
    margin: 0 0 1em;
  }

  .modal-footer {
    margin-top: 1.5em;
    float: right;

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

  .modal-container {
    padding: 1em;
    background-color: var(--color-background-card);
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    overflow: auto;
    max-height: 75vh;
    max-width: 75vw;
  }
</style>
