<script>
  export default {
    props: {
      browser: {
        type: Object,
        default: null,
      },
      creator: {
        type: Object,
        required: true,
      },
      version: {
        type: String,
        required: true,
      },
      pages: {
        type: Array,
        default: () => [],
      },
    },
    emits: [
      "select-page",
    ],
    setup(props, { emit }) {
      const onChangePage = page => {
        emit("select-page", page);
      };

      return {
        onChangePage,
      };
    },
  };
</script>

<template>
  <div class="viewer-header">
    <div>
      <b>Version: </b>
      {{ version }}
    </div>
    <div
      v-if="browser"
      style="margin-left: 1em;"
    >
      <b>Browser: </b>
      {{ browser.name }}
      ({{ browser.version }})
    </div>
    <div style="margin-left: 1em;">
      <b>Creator: </b>
      {{ creator.name }}
      ({{ creator.version }})
    </div>
    <div
      v-if="pages.length > 1"
      class="select"
      style="margin-left: auto;"
    >
      <select @change="onChangePage">
        <option
          v-for="page in pages"
          :key="page.id"
          :value="page.id"
        >
          {{ page.title }}
        </option>
      </select>
    </div>
  </div>
</template>
