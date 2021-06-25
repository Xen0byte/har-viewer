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
      Request URL: {{ data.request.url.split("?")[0] }}<br>
      Version: {{ data.request.httpVersion }}<br>
      Request method: {{ data.request.method }}<br>
      Remote Address: {{ data.serverIPAddress }}<br>
      Initiated by: {{ data._initiator }}
    </section>
    <section>
      <h1>Headers</h1>
      <ul>
        <li
          v-for="h in filteredHeaders"
          :key="h.name"
        >
          {{ h.name }}: {{ h.value }}
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
          {{ q.name }}: {{ q.value }}
        </li>
      </ul>
    </section>
    <section>
      <h1>Size</h1>
      Headers: {{ data.request.headersSize }} bytes<br>
      Body: {{ data.request.bodySize }} bytes<br>
      Total: {{ data.request.headersSize + data.request.bodySize }} bytes
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
