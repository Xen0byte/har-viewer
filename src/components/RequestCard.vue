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

  const emit = defineEmits(["select"]);

  const statusTypesMap = {
    informationalResponse: [1, 199, "info"],
    success: [200, 299, "success"],
    redirection: [300, 399, "info"],
    clientErrors: [400, 499, "warning"],
    serverErrors: [500, 599, "error"],
  };

  const statusTypes = Object.keys(statusTypesMap);

  const statusType = computed(() => {
    for (let i = 0; i < statusTypes.length; i++) {
      const typeData = statusTypesMap[statusTypes[i]];
      if (props.data.response.status >= typeData[0] && props.data.response.status <= typeData[1]) {
        return typeData[2];
      }
    }

    // eslint-disable-next-line no-underscore-dangle
    if (props.data.response.status === 0 && props.data.response._error) {
      return "error";
    }

    return "unknown";
  });

  const status = computed(() => {
    if (props.data.response.status !== 0) {
      return props.data.response.status;
    }

    // eslint-disable-next-line no-underscore-dangle
    if (props.data.response._error) {
      // eslint-disable-next-line no-underscore-dangle
      return props.data.response._error.replace("net::", "");
    }

    return "UNKNOWN";
  });

  const url = computed(() => props.data.request.url.split("?")[0]);

  const onSelect = () => emit("select");
  const calcDuration = x => `${Math.round(x)} ms`;
</script>

<template>
  <div
    class="request-card"
    :class="{ active: props.active }"
    @click="onSelect"
    @keydown.enter="onSelect"
  >
    <div class="details">
      <b v-text="props.data.request.method" />
      <span v-text="calcDuration(props.data.time)" />
      <span v-text="props.data._resourceType" />
      <div :class="`tag tag-${statusType}`">
        <b v-text="status" />
      </div>
    </div>
    <span
      class="url overflow-text"
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
    border-radius: .25rem;
    border-width: 2px;
    border-style: dashed;
    color: var(--color-text);
    padding: 1rem;

    @media (min-width: 476px) {
      &:hover {
        background-color: var(--color-background);
        border-color: var(--color-primary-light);
      }
    }

    & > .details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: .3rem;
    }

    & > .url {
      white-space: nowrap;
      user-select: none;
    }

    & .tag {
      border-radius: 5px;
      padding: .2em .33em;
      width: max-content;
      color: #ffffff;
    }

    & .tag-unknown {
      background-color: var(--color-background);
      color: var(--color-text);
    }

    & .tag-success {
      background-color: var(--color-success);
      color: var(--color-success-text);
    }

    & .tag-info {
      background-color: var(--color-info);
      color: var(--color-info-text);
    }

    & .tag-warning {
      background-color: var(--color-warning);
      color: var(--color-warning-text);
    }

    & .tag-error {
      background-color: var(--color-error);
      color: var(--color-error-text);
    }
  }
</style>
