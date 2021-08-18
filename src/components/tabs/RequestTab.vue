<script setup>
  import { ref } from "vue";

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });

  const filteredHeaders = ref(props.data.request.headers
    .filter(h => h.name.toLowerCase() !== "cookie"));
</script>

<template>
  <div class="tab-content overflow-text">
    <i>Request on <time>{{ data.startedDateTime }}</time></i>
    <section>
      <h1>General</h1>
      <table class="data-table">
        <tbody>
          <tr>
            <th>
              Request URL
            </th>
            <td v-text="data.request.url.split('?')[0]" />
          </tr>
          <tr>
            <th>Request Method</th>
            <td v-text="data.request.method" />
          </tr>
          <tr v-if="data.request.httpVersion">
            <th>HTTP Version</th>
            <td v-text="data.request.httpVersion" />
          </tr>
          <tr v-if="data.serverIPAddress">
            <th>Remote Address</th>
            <td v-text="data.serverIPAddress" />
          </tr>
        </tbody>
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
      <div v-if="data._initiator.type === 'script' && data._initiator.stack.callFrames.length > 0">
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
  </div>
</template>
