<script>
  export default {
    name: "FilterControl",
    props: {
      statusCodes: {
        type: Array,
        default: () => [],
      },
      types: {
        type: Array,
        default: () => [],
      },
    },
    emits: ["selectedType", "selectedStatusCode"],
    setup(_, { emit }) {
      const onStatusCodeSelected = e => emit("selectedStatusCode", e.target.value);
      const onTypeSelected = e => emit("selectedType", e.target.value);

      return {
        onStatusCodeSelected,
        onTypeSelected,
      };
    },
  };
</script>

<template>
  <div style="display: flex; flex-direction: row;">
    <div style="margin-right: 1.5em;">
      <label>
        Status Code:
        <select @change="onStatusCodeSelected">
          <option value="">
            All
          </option>
          <option
            v-for="statusCode in statusCodes"
            :key="statusCode"
            :value="statusCode"
            v-text="statusCode === 0 ? 'Unknown' : statusCode"
          />
        </select>
      </label>
    </div>
    <div>
      <label>
        Type:
        <select @change="onTypeSelected">
          <option value="">
            All
          </option>
          <option
            v-for="type in types"
            :key="type"
            :value="type"
            v-text="type"
          />
        </select>
      </label>
    </div>
  </div>
</template>
