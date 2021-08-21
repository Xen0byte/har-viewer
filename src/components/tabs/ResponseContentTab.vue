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
    <section>
      <h1 style="margin-bottom: .5rem;">
        Content
      </h1>
      <span
        v-if="data.response.content.comment"
        v-text="data.response.content.comment"
      />
      <div v-if="data.response.content.text">
        <details>
          <summary class="is-unselectable">
            Show content
          </summary>
          <img
            v-if="data.custom.hasImageResponse"
            alt="Response Content"
            :src="`data:${data.response.content.mimeType};base64,${data.response.content.text}`"
          >
          <code
            v-else
            style="font-family: monospace;"
          >
            {{ data.response.content.text.replace(")]}'\n", "") }}
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
