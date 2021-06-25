<script>
  import { ref } from "vue";

  import Modal from "../Modal";

  export default {
    name: "PropDialog",
    components: { Modal },
    emits: ["apply", "close"],
    setup(_, { emit }) {
      const methods = ref("");
      const status = ref("");
      const resType = ref("");

      const sortBy = ref("");
      const groupBy = ref("");

      const onClose = () => emit("close");
      const onApply = () => emit("apply", {
        filter: {
          methods: methods.value,
          status: status.value,
          resType: resType.value,
        },
        sortBy: sortBy.value,
        groupBy: groupBy.value,
      });
      const onReset = () => {
        methods.value = "";
        status.value = "";
        resType.value = "";
        sortBy.value = "";
        groupBy.value = "";
      };

      return {
        methods,
        status,
        resType,
        sortBy,
        groupBy,
        onClose,
        onApply,
        onReset,
      };
    },
  };
</script>

<template>
  <modal>
    <template #header>
      Filter / Sort / Group
    </template>
    <form
      class="form"
      @submit.prevent="onApply"
    >
      <fieldset style="margin-right: .75rem;">
        <legend>Filter</legend>
        <b>Methods</b><br>
        <input
          v-model="methods"
          type="text"
        ><br>
        <b>Status</b><br>
        <input
          v-model="status"
          type="text"
        ><br>
        <b>Resource Type</b><br>
        <input
          v-model="resType"
          type="text"
        >
      </fieldset>
      <div style="min-width: 175px;">
        <b>Sort By</b><br>
        <select v-model="sortBy">
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
        </select><br>
        <b>Group By</b><br>
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
  }

  fieldset {
    border-color: var(--color-background-dark);
    border-radius: .25rem;
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
  }

  .btn {
    &.btn-reset {
      background-color: var(--color-background-dark);
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
