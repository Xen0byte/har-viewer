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
    <div style="width: 100%; height: 35px; margin-bottom: .5rem; display: flex;">
      <div
        v-if="data.timings.blocked !== -1"
        :style="`background-color: gray; height: 100%; width: ${(data.timings.blocked/data.time)*100}%`"
      />
      <div
        v-if="data.timings.dns !== -1"
        :style="`background-color: green; height: 100%; width: ${(data.timings.dns/data.time)*100}%`"
      />
      <div
        v-if="data.timings.connect !== -1"
        :style="`background-color: orange; height: 100%; width: ${(data.timings.connect/data.time)*100}%`"
      />
      <div
        v-if="data.timings.send !== -1"
        :style="`background-color: grey; height: 100%; width: ${(data.timings.send/data.time)*100}%`"
      />
      <div
        v-if="data.timings.wait !== -1"
        :style="`background-color: green; height: 100%; width: ${(data.timings.wait/data.time)*100}%`"
      />
      <div
        v-if="data.timings.receive !== -1"
        :style="`background-color: blue; height: 100%; width: ${(data.timings.receive/data.time)*100}%`"
      />
      <div
        v-if="data.timings.ssl !== -1"
        :style="`background-color: purple; height: 100%; width: ${(data.timings.ssl/data.time)*100}%`"
      />
    </div>
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
