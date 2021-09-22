<script setup>
  import { ref } from "vue";

  import svgPin from "@mdi/svg/svg/pin-outline.svg";
  import svgPinOff from "@mdi/svg/svg/pin-off-outline.svg";

  import Modal from "../Modal";

  const props = defineProps({
    filter: {
      type: Object,
      default: () => ({}),
    },
    isAttached: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(["apply", "close", "attach"]);

  const methods = ref(props.filter.filter.methods);
  const status = ref(props.filter.filter.status);
  const resType = ref(props.filter.filter.resType);
  const domains = ref(props.filter.filter.domains);

  const sortBy = ref(props.filter.sortBy);
  const groupBy = ref(props.filter.groupBy);

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
</script>

<template>
  <modal :is-attached="isAttached">
    <template #header>
      <div class="dialog-header row">
        <span v-text="!isAttached ? 'Filter / Sort / Group' : ''" />
        <button
          class="btn btn-icon btn-attach"
          type="button"
          :title="isAttached ? 'Detach filter from main window' : 'Attach filter to main window'"
          @click="emit('attach')"
        >
          <img
            v-if="isAttached"
            alt="Detach Icon"
            role="none"
            :src="svgPinOff"
          >
          <img
            v-else
            alt="Attach Icon"
            role="none"
            :src="svgPin"
          >
        </button>
      </div>
    </template>
    <form class="column is-unselectable">
      <fieldset class="filter-group">
        <legend>Filter</legend>
        <label for="methods">
          Methods
        </label>
        <input
          id="methods"
          v-model="methods"
          type="text"
          title="Multiple methods can be specified separated by commas. Use ! to exclude methods."
          @keyup.enter="onApply"
        >
        <label for="status">
          Status
        </label>
        <input
          id="status"
          v-model="status"
          type="text"
          title="Multiple status can be specified separated by commas or using ranges. Use ! to exclude status."
          @keyup.enter="onApply"
        >
        <label for="domains">
          Domains
        </label>
        <input
          id="domains"
          v-model="domains"
          type="text"
          title="Multiple domains can be specified separated by commas. Use ! to exclude domains or * as wildcard."
          @keyup.enter="onApply"
        >
        <label for="resource-types">
          Resource Types
        </label>
        <input
          id="resource-types"
          v-model="resType"
          type="text"
          title="Multiple resource types can be specified separated by commas. Use ! to exclude resource types."
          @keyup.enter="onApply"
        >
      </fieldset>
      <div class="sort-group">
        <label for="sort">
          Sort By
        </label>
        <select
          id="sort"
          v-model="sortBy"
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
          <option value="reqSize">
            Request Size (Ascending)
          </option>
          <option value="reqSize-reverse">
            Request Size (Descending)
          </option>
          <option value="resSize">
            Response Size (Ascending)
          </option>
          <option value="resSize-reverse">
            Response Size (Descending)
          </option>
        </select>
        <label for="group">
          Group By
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
        class="btn btn-primary"
        type="button"
        @click="onApply"
      >
        Apply
      </button>
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
        @click="emit('close')"
      >
        Cancel
      </button>
    </template>
  </modal>
</template>

<style
  lang="scss"
  scoped
>
  label {
    font-weight: 600;
  }

  .attached .btn-icon > img {
    filter: var(--filter-background-text);
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
    border-radius: 5px;

    & > input:not(:last-of-type) {
      margin-bottom: .5rem;
    }
  }

  form {
    max-width: 300px;
  }

  .sort-group {
    padding: .5rem;

    & > select:not(:last-of-type) {
      margin-bottom: .5rem;
    }
  }

  input, select {
    margin-top: .1rem;
  }

  .btn.btn-reset {
    background-color: var(--color-background-dark);
    color: var(--color-text);

    &:hover {
      background-color: var(--color-primary-light);
    }
  }

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
</style>
