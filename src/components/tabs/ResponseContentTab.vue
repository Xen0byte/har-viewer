<script>
  import { computed } from "vue";

  export default {
    name: "ResponseContentTab",
    props: {
      data: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const hasImage = computed(() => props.data.response.content.encoding === "base64"
        && props.data.response.content.mimeType.startsWith("image/")
        && props.data.response.content.text);

      return {
        hasImage,
      };
    },
  };
</script>

<template>
  <article
    v-if="data.response.content"
    class="overflow-text"
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
            v-if="hasImage"
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
  </article>
</template>

<style
  lang="scss"
  scoped
>
  section:not(:last-of-type) {
    margin-bottom: .5rem;
  }
</style>
