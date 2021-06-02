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
      methods: {
        type: Array,
        default: () => [],
      },
    },
    emits: ["selectedType", "selectedStatusCode", "selectedMethod"],
    setup(_, { emit }) {
      const onStatusCodeSelected = e => emit("selectedStatusCode", e.target.value);
      const onTypeSelected = e => emit("selectedType", e.target.value);
      const onMethodSelected = e => emit("selectedMethod", e.target.value);

      return {
        onStatusCodeSelected,
        onTypeSelected,
        onMethodSelected,
      };
    },
  };
</script>

<template>
  <div style="display: flex; flex-direction: row;">
    <div style="margin-right: 1.5em;">
      <label>
        Method:
        <select @change="onMethodSelected">
          <option value="">
            All
          </option>
          <option
            v-for="method in methods"
            :key="method"
            :value="method"
            v-text="method"
          />
        </select>
      </label>
    </div>
    <div style="margin-right: 1.5em;">
      <label>
        Status:
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
