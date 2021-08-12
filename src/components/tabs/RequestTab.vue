<script>
  import { ref } from "vue";

  export default {
    name: "RequestTab",
    props: {
      data: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const filteredHeaders = ref([]);

      filteredHeaders.value = props.data.request.headers
        .filter(h => h.name !== "cookie");

      return {
        filteredHeaders,
      };
    },
  };
</script>

<template>
  <article class="overflow-text">
    <b>Request on {{ data.startedDateTime }}</b>
    <section style="margin-top: .5rem;">
      <h1>General</h1>
      <table>
        <tr>
          <th style="min-width: 140px;">
            Request URL
          </th>
          <td v-text="data.request.url.split('?')[0]" />
        </tr>
        <tr>
          <th>Request Method</th>
          <td v-text="data.request.method" />
        </tr>
        <tr>
          <th>HTTP Version</th>
          <td v-text="data.request.httpVersion" />
        </tr>
        <tr>
          <th>Remote Address</th>
          <td v-text="data.serverIPAddress" />
        </tr>
      </table>
    </section>
    <section>
      <h1>Headers</h1>
      <ul>
        <li
          v-for="h in filteredHeaders"
          :key="h.name"
        >
          <b>{{ h.name }}</b>: {{ h.value }}
        </li>
      </ul>
    </section>
    <section v-if="data.request.queryString.length !== 0">
      <h1>Query Arguments</h1>
      <ul>
        <li
          v-for="q in data.request.queryString"
          :key="q.name"
        >
          <b>{{ q.name }}</b>: {{ q.value }}
        </li>
      </ul>
    </section>
    <section>
      <h1>Size</h1>
      <table>
        <tr>
          <th>Headers</th>
          <td>{{ data.request.headersSize }} bytes</td>
        </tr>
        <tr>
          <th>Body</th>
          <td>{{ data.request.bodySize }} bytes</td>
        </tr>
        <tr>
          <th>Total</th>
          <td>{{ data.request.headersSize + data.request.bodySize }} bytes</td>
        </tr>
      </table>
    </section>
    <section v-if="data._initiator">
      <h1>Initiator</h1>
      <b>Type</b>: {{ data._initiator.type }}<br>
      <div v-if="data._initiator.type === 'parser'">
        <b>Url</b>: {{ data._initiator.url }}<br>
        <b>Line Number</b>: {{ data._initiator.lineNumber }}
      </div>
      <div v-if="data._initiator.type === 'preflight'">
        <b>Url</b>: {{ data._initiator.url }}
      </div>
      <div v-if="data._initiator.type === 'script'">
        <details style="margin-top: .25rem">
          <summary class="is-unselectable">
            Call Stack
          </summary>
          <ul>
            <li
              v-for="(f, i) in data._initiator.stack.callFrames"
              :key="i"
            >
              {{ f.scriptId }}: {{ f.functionName }} ({{ f.lineNumber }}:{{ f.columnNumber }})<br>
              {{ f.url }}
            </li>
          </ul>
        </details>
      </div>
    </section>
  </article>
</template>

<style
  lang="scss"
  scoped
>
  section:not(:last-of-type) {
    margin-bottom: .5rem;
  }
</style>
