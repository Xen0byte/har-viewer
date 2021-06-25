<script>
  import { ref } from "vue";

  export default {
    name: "ResponseTab",
    props: {
      data: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const filteredHeaders = ref([]);

      filteredHeaders.value = props.data.response.headers
        .filter(h => h.name !== "set-cookie");

      return {
        filteredHeaders,
      };
    },
  };
</script>

<template>
  <article>
    <div v-if="data.response.status !== 0">
      <b> {{ data.response.status }} {{ data.response.statusText }} {{ data.response.httpVersion }}</b>
    </div>
    <section
      v-if="data.response._error"
      class="error"
    >
      <b v-text="data.response._error" />
    </section>
    <section
      v-if="data.response.status !== 0"
      style="margin-top: .5rem;"
    >
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
    <section v-if="data.cache && Object.keys(data.cache).length !== 0">
      <h1>Cache</h1>
      {{ data.cache }}
    </section>
    <section v-if="data.response.status !== 0">
      <h1>Size</h1>
      <b>Headers</b>: {{ data.response.headersSize }} bytes<br>
      <b>Body</b>: {{ data.response.bodySize }} bytes<br>
      <b>Total</b>: {{ data.response._transferSize }} bytes
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

    & .error {
      padding: 1rem;
      background-color: var(--color-error);
      color: var(--color-error-text);
      border-radius: .25rem;
    }
  }
</style>
