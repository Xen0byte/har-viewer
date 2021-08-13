<script>
  export default {
    name: "WebsocketTab",
    props: {
      data: {
        type: Object,
        required: true,
      },
    },
  };
</script>

<template>
  <article
    class="overflow-text"
    v-text="data._webSocketMessages"
  />
</template>
