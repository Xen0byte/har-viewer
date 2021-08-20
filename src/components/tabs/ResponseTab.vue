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

  const headerSize = computed(() => props.data.response.headersSize || 0);
  const bodySize = computed(() => (props.data.response.bodySize === -1 ? 0 : props.data.response.bodySize || 0));

  const totalResponseSize = computed(() => headerSize.value + bodySize.value);
</script>

<template>
  <div class="tab-content overflow-text">
    <i v-if="data.response.status !== 0">
      {{ data.response.status }} {{ data.response.statusText }} {{ data.response.httpVersion }}
    </i>
    <section
      v-if="data.response._error"
      class="error"
    >
      <b v-text="data.response._error" />
    </section>
    <section v-if="data.response.status !== 0">
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
            <td>{{ headerSize }} bytes</td>
          </tr>
          <tr>
            <th>Body</th>
            <td>{{ bodySize }} bytes</td>
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
