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
    <div class="timing">
      <div
        v-if="data.timings.blocked !== -1"
        class="timing-blocked"
        :style="`width: ${(data.timings.blocked/data.time)*100}%`"
      />
      <div
        v-if="data.timings.dns !== -1"
        class="timing-dns"
        :style="`width: ${(data.timings.dns/data.time)*100}%`"
      />
      <div
        v-if="data.timings.connect !== -1"
        class="timing-connect"
        :style="`width: ${(data.timings.connect/data.time)*100}%`"
      />
      <div
        v-if="data.timings.send !== -1"
        class="timing-send"
        :style="`width: ${(data.timings.send/data.time)*100}%`"
      />
      <div
        v-if="data.timings.wait !== -1"
        class="timing-wait"
        :style="`width: ${(data.timings.wait/data.time)*100}%`"
      />
      <div
        v-if="data.timings.receive !== -1"
        class="timing-receive"
        :style="`width: ${(data.timings.receive/data.time)*100}%`"
      />
      <div
        v-if="data.timings.ssl !== -1"
        class="timing-ssl"
        :style="`width: ${(data.timings.ssl/data.time)*100}%`"
      />
    </div>
    <b>Blocked</b>: {{ round(data.timings.blocked) }} ms<br>
    <b>DNS</b>: {{ round(data.timings.dns) }} ms<br>
    <b>Connection</b>: {{ round(data.timings.connect) }} ms<br>
    <b>Send</b>: {{ round(data.timings.send) }} ms<br>
    <b>Wait</b>: {{ round(data.timings.wait) }} ms<br>
    <b>Receive</b>: {{ round(data.timings.receive) }} ms<br>
    <b>SSL</b>: {{ round(data.timings.ssl) }} ms
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

  .timing {
    width: 100%;
    height: 35px;
    margin-bottom: .5rem;
    display: flex;

    & > div {
      height: 100%;
    }
  }

  .timing-blocked {
    background-color: var(--color-timing-blocked);
  }

  .timing-dns {
    background-color: var(--color-timing-dns);
  }

  .timing-connect {
    background-color: var(--color-timing-connect);
  }

  .timing-send {
    background-color: var(--color-timing-send);
  }

  .timing-wait {
    background-color: var(--color-timing-wait);
  }

  .timing-receive {
    background-color: var(--color-timing-receive);
  }

  .timing-ssl {
    background-color: var(--color-timing-ssl);
  }
</style>
