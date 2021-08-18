<script setup>
  import { ref, computed } from "vue";

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });

  const filteredHeaders = ref(props.data.response.headers
    .filter(h => h.name.toLowerCase() !== "cookie"));

  const totalResponseSize = computed(() => props.data.response.headersSize + (props.data.response.bodySize === -1
    ? props.data.response.content.size
    : props.data.response.bodySize));
</script>

<template>
  <div class="tab-content overflow-text">
    <div v-if="data.response.status !== 0">
      <i> {{ data.response.status }} {{ data.response.statusText }} {{ data.response.httpVersion }}</i>
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
    <section>
      <h1>Size</h1>
      <table>
        <tbody>
          <tr>
            <th>Headers</th>
            <td>{{ data.response.headersSize }} bytes</td>
          </tr>
          <tr>
            <th>Body</th>
            <td>{{ data.response.bodySize === -1 ? data.response.content.size : data.response.bodySize }} bytes</td>
          </tr>
          <tr>
            <th>Total</th>
            <td>{{ totalResponseSize }} bytes</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style
  lang="scss"
  scoped
>
  .error {
    padding: 1rem;
    background-color: var(--color-error);
    color: var(--color-error-text);
    border-radius: 5px;
  }
</style>
