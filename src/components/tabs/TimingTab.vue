<script>
  export default {
    name: "TimingTab",
    props: {
      data: {
        type: Object,
        required: true,
      },
    },
    setup() {
      return {
        round: Math.round,
      };
    },
  };
</script>

<template>
  <article>
    <b>Blocked</b>: {{ round(data.timings.blocked) }}<br>
    <b>DNS</b>: {{ round(data.timings.dns) }}<br>
    <b>Connection</b>: {{ round(data.timings.connect) }}<br>
    <b>Send</b>: {{ round(data.timings.send) }}<br>
    <b>Wait</b>: {{ round(data.timings.wait) }}<br>
    <b>Receive</b>: {{ round(data.timings.receive) }}<br>
    <b>SSL</b>: {{ round(data.timings.ssl) }}
  </article>
</template>

<style
  lang="scss"
  scoped
>
  article {
    overflow-wrap: anywhere;
    user-select: text;

    & section:not(:last-of-type) {
      margin-bottom: .5rem;
    }
  }
</style>
