<script>
  export default {
    name: "RequestCard",
    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
      active: {
        type: Boolean,
        default: false,
      },
    },
    emits: [
      "select",
    ],
    setup(props, { emit }) {
      let statusType = "unknown";
      // eslint-disable-next-line vue/no-setup-props-destructure,prefer-const
      let { statusText, status } = props.data.response;
      const url = props.data.request.url.split("?")[0];
      const duration = `${Math.round(props.data.time)} ms`;
      // eslint-disable-next-line vue/no-setup-props-destructure
      const { method } = props.data.request;
      // eslint-disable-next-line no-underscore-dangle,vue/no-setup-props-destructure
      const resourceType = props.data._resourceType;

      const onSelect = () => emit("select");

      if (status === 0) {
        // eslint-disable-next-line no-underscore-dangle
        status = props.data.response._error.replace("net::", "") || "UNKNOWN";
      } else if (status < 200) {
        statusType = "info";
      } else if (status > 199 && status < 300) {
        statusType = "success";
      } else if (status > 299 && status < 400) {
        statusType = "info";
      } else if (status > 399 && status < 500) {
        statusType = "warning";
      } else if (status > 499) {
        statusType = "error";
      }

      return {
        onSelect,
        duration,
        statusType,
        statusText,
        url,
        status,
        method,
        resourceType,
      };
    },
  };
</script>

<template>
  <div
    class="request-card"
    :class="{ active }"
    @click="onSelect"
  >
    <div class="details">
      <b v-text="method" />
      <span v-text="duration" />
      <span v-text="resourceType" />
      <div :class="`tag tag-${statusType}`">
        <b v-text="status" />
      </div>
    </div>
    <div
      class="url"
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
    background-color: var(--color-background-2);
    border-color: var(--color-background-2);
    border-radius: .25rem;
    border-width: 2px;
    border-style: dashed;
    color: var(--color-text);
    padding: 1rem;

    &.active {
      background-color: #0359a2 !important;
      border-color: #0359a2 !important;
      color: #f8f9fa;
    }

    @media (min-width: 476px) {
      &:hover {
        background-color: var(--color-background);
        border-color: #4da4f0;
      }
    }

    & > .details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: .3rem;
    }

    & > .url {
      overflow-wrap: anywhere;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
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
      background-color: #28a745;
    }

    & .tag-info {
      background-color: #17a2b8;
    }

    & .tag-warning {
      background-color: #ffc107;
      color: #2a2e33;
    }

    & .tag-error {
      background-color: #dc3545;
    }
  }
</style>
