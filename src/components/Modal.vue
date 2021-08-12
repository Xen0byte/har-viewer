<script setup>
  import { onMounted } from "vue";

  // TODO: remove on firefox and safari support.
  import dialogPolyfill from "dialog-polyfill";

  const props = defineProps({
    isAttached: {
      type: Boolean,
      default: false,
    },
  });

  onMounted(() => {
    const dialog = document.querySelector("dialog");

    if (!dialog) {
      return;
    }

    // TODO: remove on firefox and safari support.
    dialogPolyfill.registerDialog(dialog);

    dialog.addEventListener("cancel", e => e.preventDefault());
    dialog.showModal();
  });
</script>

<template>
  <div :class="{ attached: props.isAttached }">
    <component
      :is="props.isAttached ? 'div' : 'dialog'"
      :aria-labelledby="!props.isAttached ? 'dialog-header' : null"
      :class="{ 'modal-container': !props.isAttached }"
    >
      <div class="modal-header">
        <h2
          v-if="$slots.header"
          id="dialog-header"
          class="is-unselectable"
        >
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
        <slot name="footer" />
      </div>
    </component>
  </div>
</template>

<style
  lang="scss"
  scoped
>
  h2 {
    color: var(--color-primary-text);
  }

  dialog::backdrop {
    background-color: rgba(0, 0, 0, .25);
    backdrop-filter: blur(1px);
  }

  // TODO: remove on firefox and safari support.
  dialog + .backdrop {
    background-color: rgba(0, 0, 0, .25);
    backdrop-filter: blur(1px);
  }

  .modal-header {
    background-color: var(--color-primary);
    padding: .5rem;
    color: var(--color-primary-text);
  }

  .attached {
    & .modal-header {
      background-color: unset;
      padding-bottom: 0;
    }

    & .modal-body {
      padding-top: 0;
    }
  }

  .modal-footer {
    padding: .5rem;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    & ::v-deep(:not(:last-child)) {
      margin-right: .35em;
    }
  }

  .modal-body {
    padding: .75rem;
    color: var(--color-text);
  }

  .modal-container {
    background-color: var(--color-background);
    border-radius: 5px;
    overflow: auto;
    max-height: 75vh;
    max-width: 75vw;
    padding: 0;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .5);
  }

  @media (max-width: 475px) {
    .modal-container {
      width: 100vw;
      height: 100vh;
      max-width: 100vw;
      max-height: 100vh;
      border-radius: 0;
    }
  }
</style>
