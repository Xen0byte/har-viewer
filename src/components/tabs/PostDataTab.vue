<script setup>
  defineProps({
    data: {
      type: Object,
      required: true,
    },
  });
</script>

<template>
  <div
    v-if="data.request.postData"
    class="tab-content overflow-text"
  >
    <section>
      <h1>Type</h1>
      <span v-text="data.request.postData.mimeType" />
    </section>
    <section v-if="data.request.postData.params">
      <h1>Parameters</h1>
      <ul>
        <li
          v-for="p in data.request.postData.params"
          :key="p.name"
        >
          <template v-if="p.value">
            <b>{{ p.name }}</b>: {{ p.value }}
          </template>
          <template v-else>
            <b>{{ p.name }}</b>
          </template>
        </li>
      </ul>
    </section>
  </div>
</template>
