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
  <article>
    <b>Request on {{ data.startedDateTime }}</b>
    <section style="margin-top: .5rem;">
      <h1>General</h1>
      <b>Request URL</b>: {{ data.request.url.split("?")[0] }}<br>
      <b>Version</b>: {{ data.request.httpVersion }}<br>
      <b>Request method</b>: {{ data.request.method }}<br>
      <b>Remote Address</b>: {{ data.serverIPAddress }}
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
      <b>Headers</b>: {{ data.request.headersSize }} bytes<br>
      <b>Body</b>: {{ data.request.bodySize }} bytes<br>
      <b>Total</b>: {{ data.request.headersSize + data.request.bodySize }} bytes
    </section>
    <section>
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
          <summary style="user-select: none;">
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
  article {
    overflow-wrap: anywhere;
    user-select: text;

    & section:not(:last-of-type) {
      margin-bottom: .5rem;
    }
  }
</style>
