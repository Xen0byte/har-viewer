<script setup>
  defineProps({
    data: {
      type: Object,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(["click"]);
</script>

<template>
  <div
    class="request-card"
    :class="{ active }"
    role="button"
    tabindex="0"
    @click="emit('click')"
    @keydown.enter="emit('click')"
  >
    <b v-text="data.request.method" />
    <span>{{ Math.round(data.time) }} ms</span>
    <span v-text="data.custom.resourceType" />
    <div
      :class="`tag tag-${data.custom.statusType}`"
      v-text="data.custom.statusCode"
    />
    <div
      class="url overflow-text is-unselectable"
      v-text="data.custom.url"
    />
  </div>
</template>

<style
  lang="scss"
  scoped
>
  .request-card {
    cursor: pointer;
    background-color: var(--color-background-dark);
    border-color: var(--color-background-dark);
    border-radius: 5px;
    border-width: 2px;
    border-style: dashed;
    color: var(--color-text);
    padding: .65rem;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: .3rem 0;
    align-items: center;
    grid-template-areas: "method timing type status" "url url url url";

    @media (min-width: 476px) {
      &:hover {
        background-color: var(--color-background);
        border-color: var(--color-primary-light);
      }
    }
  }

  .tag-container {
    display: flex;
    justify-content: flex-end;
  }

  .url {
    white-space: nowrap;
    grid-area: url;
  }

  .tag {
    border-radius: 5px;
    padding: .2rem .35rem;
    width: max-content;
    justify-self: flex-end;

    &.tag-unknown {
      background-color: var(--color-background);
      color: var(--color-text);
    }

    &.tag-success {
      background-color: var(--color-success);
      color: var(--color-success-text);
    }

    &.tag-info {
      background-color: var(--color-info);
      color: var(--color-info-text);
    }

    &.tag-warning {
      background-color: var(--color-warning);
      color: var(--color-warning-text);
    }

    &.tag-error {
      background-color: var(--color-error);
      color: var(--color-error-text);
    }
  }
</style>
