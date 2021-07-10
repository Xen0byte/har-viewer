<script>
  import { ref } from "vue";
  import svgPin from "@mdi/svg/svg/pin.svg";
  import svgPinOff from "@mdi/svg/svg/pin-off.svg";

  import Modal from "../Modal";

  export default {
    name: "PropDialog",
    components: { Modal },
    props: {
      filter: {
        type: Object,
        default: () => ({}),
      },
      isAttached: {
        type: Boolean,
        default: false,
      },
    },
    emits: ["apply", "close", "attach"],
    setup(props, { emit }) {
      const methods = ref(props.filter.filter.methods);
      const status = ref(props.filter.filter.status);
      const resType = ref(props.filter.filter.resType);
      const domains = ref(props.filter.filter.domains);

      const sortBy = ref(props.filter.sortBy);
      const groupBy = ref(props.filter.groupBy);

      const onClose = () => emit("close");
      const onApply = () => {
        emit("apply", {
          filter: {
            methods: methods.value.toLowerCase(),
            status: status.value,
            resType: resType.value.toLowerCase(),
            domains: domains.value.toLowerCase(),
          },
          sortBy: sortBy.value,
          groupBy: groupBy.value,
        });
      };

      const onReset = () => {
        methods.value = "";
        status.value = "";
        domains.value = "";
        resType.value = "";
        sortBy.value = "";
        groupBy.value = "";
      };

      const onAttach = () => emit("attach");

      return {
        methods,
        status,
        domains,
        resType,
        sortBy,
        groupBy,
        onClose,
        onApply,
        onReset,
        onAttach,
        svgPin,
        svgPinOff,
      };
    },
  };
</script>

<template>
  <modal :is-attached="isAttached">
    <template #header>
      <div class="dialog-header">
        <span v-if="isAttached" />
        <span v-else>Filter / Sort / Group</span>
        <button
          class="btn btn-icon"
          type="button"
          @click="onAttach"
        >
          <img
            v-if="isAttached"
            :src="svgPinOff"
          >
          <img
            v-else
            :src="svgPin"
          >
        </button>
      </div>
    </template>
    <form class="form">
      <fieldset class="filter-group">
        <legend>Filter</legend>
        <b>Methods</b>
        <input
          v-model="methods"
          style="margin-bottom: .5rem;"
          type="text"
        >
        <b>Status</b>
        <input
          v-model="status"
          style="margin-bottom: .5rem;"
          type="text"
        >
        <b>Domains</b>
        <input
          v-model="domains"
          style="margin-bottom: .5rem;"
          type="text"
        >
        <b>Resource Types</b>
        <input
          v-model="resType"
          type="text"
        >
      </fieldset>
      <div style="max-width: 300px; padding: .5rem">
        <b>Sort By</b>
        <select
          v-model="sortBy"
          style="margin-bottom: .5rem;"
        >
          <option value="">
            Nothing
          </option>
          <option value="status">
            Status (Ascending)
          </option>
          <option value="status-reverse">
            Status (Descending)
          </option>
          <option value="timing">
            Timing (Ascending)
          </option>
          <option value="timing-reverse">
            Timing (Descending)
          </option>
        </select>
        <b>Group By</b>
        <select v-model="groupBy">
          <option value="">
            Nothing
          </option>
          <option value="method">
            Method
          </option>
          <option value="status">
            Status
          </option>
          <option value="status-type">
            Status Type
          </option>
          <option value="resource-type">
            Resource Type
          </option>
          <option value="domain">
            Domain
          </option>
        </select>
      </div>
    </form>
    <template #footer>
      <button
        class="btn btn-reset"
        type="button"
        @click="onReset"
      >
        Reset
      </button>
      <button
        v-if="!isAttached"
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
  .form {
    display: flex;
    user-select: none;
    flex-direction: column;
  }

  .attached {
    & .btn-icon > img {
      filter: var(--filter-background-text);
    }
  }

  .btn-icon {
    background-color: unset !important;

    & > img {
      filter: var(--filter-primary-text);
    }
  }

  .dialog-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .filter-group {
    border-color: var(--color-background-dark);
    border-radius: .25rem;
    margin-right: .75rem; max-width: 300px;
  }

  select {
    cursor: pointer;
  }

  input, select {
    background-color: var(--color-background-dark);
    border: none;
    border-radius: .25rem;
    padding: .5rem;
    outline: none;
    color: var(--color-text);
    width: 100%;
    appearance: none;
    margin-top: .25rem;
  }

  .btn {
    &.btn-reset {
      background-color: var(--color-background-dark);
      color: var(--color-text);
    }

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
