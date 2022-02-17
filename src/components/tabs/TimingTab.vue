<script setup>
  import { computed } from "vue";

  import { roundTo } from "../../utils/helpers";

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });

  const round = roundTo;

  const timingConnect = computed(() => {
    if (props.data.timings.ssl > 0
      && props.data.timings.connect > 0
      && props.data.timings.connect > props.data.timings.ssl) {
      return props.data.timings.connect - props.data.timings.ssl;
    }

    return props.data.timings.connect;
  });
</script>

<template>
  <div class="tab-content overflow-text">
    <div
      v-if="data.time"
      class="timing"
    >
      <div
        v-if="data.timings.blocked > 0"
        class="timing-blocked"
        :style="`width: ${(data.timings.blocked/data.time)*100}%`"
      />
      <div
        v-if="data.timings.dns > 0"
        class="timing-dns"
        :style="`width: ${(data.timings.dns/data.time)*100}%`"
      />
      <div
        v-if="data.timings.connect > 0"
        class="timing-connect"
        :style="`width: ${(timingConnect/data.time)*100}%`"
      />
      <div
        v-if="data.timings.send > 0"
        class="timing-send"
        :style="`width: ${(data.timings.send/data.time)*100}%`"
      />
      <div
        v-if="data.timings.wait > 0"
        class="timing-wait"
        :style="`width: ${(data.timings.wait/data.time)*100}%`"
      />
      <div
        v-if="data.timings.receive > 0"
        class="timing-receive"
        :style="`width: ${(data.timings.receive/data.time)*100}%`"
      />
      <div
        v-if="data.timings.ssl > 0"
        class="timing-ssl"
        :style="`width: ${(data.timings.ssl/data.time)*100}%`"
      />
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th colspan="3">
            Connection Start
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="timing-blocked" />
          <th>Stalled</th>
          <td>
            {{ data.timings.blocked > 0 ? `${round(data.timings.blocked)} ms` : "Does not apply" }}
          </td>
        </tr>
        <tr>
          <td class="timing-dns" />
          <th>DNS Lookup</th>
          <td>
            {{ data.timings.dns > 0 ? `${round(data.timings.dns)} ms` : "Does not apply" }}
          </td>
        </tr>
        <tr>
          <td class="timing-ssl" />
          <th>SSL</th>
          <td>
            {{ data.timings.ssl > 0 ? `${round(data.timings.ssl)} ms` : "Does not apply" }}
          </td>
        </tr>
        <tr>
          <td class="timing-connect" />
          <th>Initial Connection</th>
          <td>
            {{ data.timings.connect > 0 ? `${round(timingConnect)} ms` : "Does not apply" }}
          </td>
        </tr>
      </tbody>
      <thead>
        <tr>
          <th
            colspan="3"
            class="total"
          >
            Request/Response
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="timing-send" />
          <th>Request Sent</th>
          <td>
            {{ data.timings.send > 0 ? `${round(data.timings.send)} ms` : "Does not apply" }}
          </td>
        </tr>
        <tr>
          <td class="timing-wait" />
          <th>Waiting (TTFB)</th>
          <td>
            {{ data.timings.wait > 0 ? `${round(data.timings.wait)} ms` : "Does not apply" }}
          </td>
        </tr>
        <tr>
          <td class="timing-receive" />
          <th>Content Downloaded</th>
          <td>
            {{ data.timings.receive > 0 ? `${round(data.timings.receive)} ms` : "Does not apply" }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="2">
            Total time
          </th>
          <td>{{ round(data.time) }} ms</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style
  lang="scss"
  scoped
>
  .timing {
    width: 100%;
    height: 35px;
    display: flex;
    padding-bottom: 1rem;
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

  .data-table {
    width: max-content;

    & tbody td:first-child {
      width: .25rem;
    }

    & tbody th {
      font-weight: 400;
      padding-left: .5rem;
    }

    & thead:nth-of-type(2) th,
    & tfoot th,
    & tfoot td {
      padding-top: 1rem;
    }
  }
</style>
