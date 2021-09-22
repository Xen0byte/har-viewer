<script setup>
  import { computed } from "vue";

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });

  const content = computed(() => {
    if (props.data.request.postData.mimeType.includes("application/json")) {
      try {
        const json = JSON.parse(props.data.request.postData.text);
        return JSON.stringify(json, null, 2);
      } catch (_) {
        // ignore - use base case
      }
    }

    return props.data.request.postData.text;
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
    <section v-if="data.request.postData.params.length !== 0">
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
    <section v-else>
      <h1>Content</h1>
      <pre><code v-text="content" /></pre>
    </section>
  </div>
</template>

<style
  lang="scss"
  scoped
>
  pre {
    margin: 0;
  }

  code {
    font-family: monospace;
  }
</style>
