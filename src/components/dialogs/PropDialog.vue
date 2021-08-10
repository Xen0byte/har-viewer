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
      <div class="dialog-header row">
        <span v-if="isAttached" />
        <span v-else>Filter / Sort / Group</span>
        <button
          class="btn btn-icon btn-attach"
          type="button"
          :title="isAttached ? 'Detach filter from main window' : 'Attach filter to main window'"
          @click="onAttach"
        >
          <img
            v-if="isAttached"
            role="none"
            :src="svgPinOff"
          >
          <img
            v-else
            role="none"
            :src="svgPin"
          >
        </button>
      </div>
    </template>
    <form class="form column">
      <fieldset class="filter-group">
        <legend>Filter</legend>
        <label for="methods">
          <b>Methods</b>
        </label>
        <input
          id="methods"
          v-model="methods"
          style="margin-bottom: .5rem;"
          type="text"
          title="Multiple methods can be specified separated by commas. Use ! to exclude methods."
        >
        <label for="status">
          <b>Status</b>
        </label>
        <input
          id="status"
          v-model="status"
          style="margin-bottom: .5rem;"
          type="text"
          title="Multiple status can be specified separated by commas or using ranges. Use ! to exclude status."
        >
        <label for="domains">
          <b>Domains</b>
        </label>
        <input
          id="domains"
          v-model="domains"
          style="margin-bottom: .5rem;"
          type="text"
          title="Multiple domains can be specified separated by commas. Use ! to exclude domains or * as wildcard."
        >
        <label for="resource-types">
          <b>Resource Types</b>
        </label>
        <input
          id="resource-types"
          v-model="resType"
          type="text"
          title="Multiple resource types can be specified separated by commas. Use ! to exclude resource types."
        >
      </fieldset>
      <div style="max-width: 300px; padding: .5rem">
        <label for="sort">
          <b>Sort By</b>
        </label>
        <select
          id="sort"
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
        <label for="group">
          <b>Group By</b>
        </label>
        <select
          id="group"
          v-model="groupBy"
        >
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
        class="btn btn-primary"
        type="button"
        @click="onClose"
      >
        Cancel
      </button>
      <button
        class="btn btn-primary"
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
  @media (max-width: 475px) {
    .btn-attach {
      display: none !important;
    }

    ::v-deep(.modal-footer) {
      & > div {
        justify-content: center;
      }
    }
  }

  .form {
    user-select: none;
    align-items: center;
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
    justify-content: space-between;
  }

  .filter-group {
    border-color: var(--color-background-dark);
    border-radius: .25rem;
    margin-right: .75rem; max-width: 300px;
  }

  input, select {
    margin-top: .25rem;
  }

  .btn {
    &.btn-reset {
      background-color: var(--color-background-dark);
      color: var(--color-text);

      &:hover {
        background-color: var(--color-primary-light);
      }
    }
  }
</style>
