<script setup>
  defineProps({
    data: {
      type: Object,
      required: true,
    },
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
          v-for="h in data.response.headers"
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
      <table class="data-table">
        <tbody>
          <tr>
            <th>Headers</th>
            <td>
              <template v-if="data.custom.response.headersSize !== -1">
                {{ data.custom.response.headersSize }} bytes
                <template v-if="data.custom.response.headersSizeComputed">
                  (computed)
                </template>
              </template>
              <template v-else>
                (not available)
              </template>
            </td>
          </tr>
          <tr>
            <th>Body</th>
            <td>
              <template v-if="data.custom.response.bodySize !== -1">
                {{ data.custom.response.bodySize }} bytes
                <template v-if="data.custom.response.bodySizeComputed">
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
              {{ data.custom.response.totalSize }} bytes
              <template v-if="data.custom.response.totalSizeComputed">
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
