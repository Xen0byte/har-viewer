<script setup>
  import { computed } from "vue";

  const props = defineProps({
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

  const statusType = computed(() => {
    if (props.data.response.status === 0) {
      // eslint-disable-next-line no-underscore-dangle
      return props.data.response._error ? "error" : "unknown";
    }

    // informational response
    if (props.data.response.status < 200) {
      return "info";
    }

    // success
    if (props.data.response.status < 300) {
      return "success";
    }

    // redirect
    if (props.data.response.status < 400) {
      return "info";
    }

    // client error
    if (props.data.response.status < 500) {
      return "warning";
    }

    // server error
    if (props.data.response.status < 600) {
      return "error";
    }

    return "unknown";
  });

  const statusCode = computed(() => {
    if (props.data.response.status !== 0) {
      return props.data.response.status;
    }

    // eslint-disable-next-line no-underscore-dangle
    if (props.data.response._error) {
      // eslint-disable-next-line no-underscore-dangle
      return props.data.response._error.replace("net::", "");
    }

    return "unknown";
  });

  const url = computed(() => props.data.request.url.split("?")[0]);
  const duration = computed(() => `${Math.round(props.data.time)} ms`);
</script>

<template>
  <div
    class="request-card"
    :class="{ active: props.active }"
    role="button"
    tabindex="0"
    @click="emit('click')"
    @keydown.enter="emit('click')"
  >
    <b v-text="props.data.request.method" />
    <span v-text="duration" />
    <span v-text="props.data.custom.resourceType" />
    <div
      :class="`tag tag-${statusType}`"
      v-text="statusCode"
    />
    <div
      class="url overflow-text is-unselectable"
      v-text="url"
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
