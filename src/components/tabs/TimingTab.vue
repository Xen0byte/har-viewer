<script setup>
  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });
</script>

<template>
  <article class="overflow-text">
    <div class="timing">
      <div
        v-if="props.data.timings.blocked !== -1"
        class="timing-blocked"
        :style="`width: ${(props.data.timings.blocked/props.data.time)*100}%`"
      />
      <div
        v-if="props.data.timings.dns !== -1"
        class="timing-dns"
        :style="`width: ${(props.data.timings.dns/props.data.time)*100}%`"
      />
      <div
        v-if="props.data.timings.connect !== -1"
        class="timing-connect"
        :style="`width: ${(props.data.timings.connect/props.data.time)*100}%`"
      />
      <div
        v-if="props.data.timings.send !== -1"
        class="timing-send"
        :style="`width: ${(props.data.timings.send/props.data.time)*100}%`"
      />
      <div
        v-if="props.data.timings.wait !== -1"
        class="timing-wait"
        :style="`width: ${(props.data.timings.wait/props.data.time)*100}%`"
      />
      <div
        v-if="props.data.timings.receive !== -1"
        class="timing-receive"
        :style="`width: ${(props.data.timings.receive/props.data.time)*100}%`"
      />
      <div
        v-if="props.data.timings.ssl !== -1"
        class="timing-ssl"
        :style="`width: ${(props.data.timings.ssl/props.data.time)*100}%`"
      />
    </div>
    <table class="data-table">
      <tbody>
        <tr>
          <th>Blocked</th>
          <td>
            {{ props.data.timings.blocked !== -1 ? `${Math.round(props.data.timings.blocked)} ms` : "Does not apply" }}
          </td>
        </tr>
        <tr>
          <th>DNS</th>
          <td>
            {{ props.data.timings.dns !== -1 ? `${Math.round(props.data.timings.dns)} ms` : "Does not apply" }}
          </td>
        </tr>
        <tr>
          <th>Connection</th>
          <td>
            {{ props.data.timings.connect !== -1 ? `${Math.round(props.data.timings.connect)} ms` : "Does not apply" }}
          </td>
        </tr>
        <tr>
          <th>Send</th>
          <td>
            {{ props.data.timings.send !== -1 ? `${Math.round(props.data.timings.send)} ms` : "Does not apply" }}
          </td>
        </tr>
        <tr>
          <th>Wait</th>
          <td>
            {{ props.data.timings.wait !== -1 ? `${Math.round(props.data.timings.wait)} ms` : "Does not apply" }}
          </td>
        </tr>
        <tr>
          <th>Receive</th>
          <td>
            {{ props.data.timings.receive !== -1 ? `${Math.round(props.data.timings.receive)} ms` : "Does not apply" }}
          </td>
        </tr>
        <tr>
          <th>SSL</th>
          <td>
            {{ props.data.timings.ssl !== -1 ? `${Math.round(props.data.timings.ssl)} ms` : "Does not apply" }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th>Total</th>
          <td>{{ props.data.time }} ms</td>
        </tr>
      </tfoot>
    </table>
  </article>
</template>

<style
  lang="scss"
  scoped
>
  section:not(:last-of-type) {
    margin-bottom: .5rem;
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
