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
        <slot />
      </div>
    </div>
  </div>
</template>
