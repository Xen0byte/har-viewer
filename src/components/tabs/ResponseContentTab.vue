<script setup>
  import { computed } from "vue";

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });

  const content = computed(() => {
    if (props.data.response.content.mimeType.includes("application/json")) {
      try {
        const json = JSON.parse(props.data.response.content.text);
        return JSON.stringify(json, null, 2);
      } catch (_) {
        // ignore - use base case
      }
    }

    return props.data.response.content.text;
  });
</script>

<template>
  <div
    v-if="data.response.content"
    class="tab-content overflow-text"
  >
    <section>
      <h1>Size</h1>
      {{ data.response.content.size }} bytes
    </section>
    <section v-if="data.response.content.encoding">
      <h1>Encoding</h1>
      {{ data.response.content.encoding }}
    </section>
    <section>
      <h1>Mime Type</h1>
      {{ data.response.content.mimeType }}
    </section>
    <section
      v-if="data.response.content.text || data.response.content.comment"
      class="content-section"
    >
      <h1 style="margin-bottom: .5rem;">
        Content
      </h1>
      <span
        v-if="data.response.content.comment"
        v-text="data.response.content.comment"
      />
      <template v-if="data.response.content.text">
        <details>
          <summary class="is-unselectable">
            Show content
          </summary>
          <img
            v-if="data._harviewer.hasImageResponse"
            alt="Response Content"
            :src="`data:${data.response.content.mimeType};base64,${data.response.content.text}`"
          >
          <pre v-else><code v-text="content" /></pre>
        </details>
      </template>
    </section>
  </div>
</template>

<style
  lang="scss"
  scoped
>
  summary {
    margin-bottom: .3rem;
  }

  pre {
    margin: 0;
    overflow: auto;
  }

  code {
    font-family: monospace;
  }
</style>
