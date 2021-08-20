<script setup>
  import { computed } from "vue";

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });

  const hasImage = computed(() => props.data.response.content.encoding === "base64"
    && props.data.response.content.mimeType.startsWith("image/")
    && props.data.response.content.text);
</script>

<template>
  <div
    v-if="props.data.response.content"
    class="tab-content overflow-text"
  >
    <section>
      <h1>Size</h1>
      {{ props.data.response.content.size }} bytes
    </section>
    <section v-if="props.data.response.content.encoding">
      <h1>Encoding</h1>
      {{ props.data.response.content.encoding }}
    </section>
    <section>
      <h1>Mime Type</h1>
      {{ props.data.response.content.mimeType }}
    </section>
    <section>
      <h1 style="margin-bottom: .5rem;">
        Content
      </h1>
      <span
        v-if="props.data.response.content.comment"
        v-text="props.data.response.content.comment"
      />
      <div v-if="props.data.response.content.text">
        <details>
          <summary class="is-unselectable">
            Show content
          </summary>
          <img
            v-if="hasImage"
            alt="Response Content"
            :src="`data:${props.data.response.content.mimeType};base64,${props.data.response.content.text}`"
          >
          <code
            v-else
            style="font-family: monospace;"
          >
            {{ props.data.response.content.text.replace(")]}'\n", "") }}
          </code>
        </details>
      </div>
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
</style>
