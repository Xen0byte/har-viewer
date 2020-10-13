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
  <div v-text="JSON.stringify(entry)" />
</template>
