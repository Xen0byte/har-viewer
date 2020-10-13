<script>
  export default {
    props: {
      entry: {
        type: Object,
        required: true,
      },
    },
  };
</script>

<template>
  <div
    style="white-space: pre;"
    v-text="JSON.stringify(entry, null, 2)"
  />
</template>
