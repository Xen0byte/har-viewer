<script setup>
  import { ref, computed } from "vue";

  import { compare } from "../../utils/array";

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });

  const filteredHeaders = ref(props.data.response.headers
    .filter(h => h.name.toLowerCase() !== "cookie")
    .sort((a, b) => compare(a.name, b.name)));

  const headerSize = computed(() => props.data.response.headersSize || -1);
  const bodySize = computed(() => (props.data.response.bodySize === -1
    ? (props.data.response.content.size || -1)
    : props.data.response.bodySize));

  const bodyComputed = computed(() => props.data.response.bodySize === -1 && !!props.data.response.content.size);

  const totalResponseSize = computed(() => {
    let sum = 0;

    if (headerSize.value !== -1) {
      sum += headerSize.value;
    }

    if (bodySize.value !== -1) {
      sum += bodySize.value;
    }

    return sum;
  });
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
            <td>
              <template v-if="headerSize !== -1">
                {{ headerSize }} bytes
              </template>
              <template v-else>
                (not available)
              </template>
            </td>
          </tr>
          <tr>
            <th>Body</th>
            <td>
              <template v-if="bodySize !== -1">
                {{ bodySize }} bytes<template v-if="bodyComputed">
                  (computed)
                </template>
              </template>
              <template v-else>
                (not available)
              </template>
            </td>
          </tr>
          <tr>
            <th>Total</th>
            <td>
              {{ totalResponseSize }} bytes<template v-if="bodyComputed">
                (computed)
              </template>
            </td>
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
