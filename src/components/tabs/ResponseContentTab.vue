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
  <article v-if="data.response.content">
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
      <div v-if="hasImage">
        <img :src="`data:${data.response.content.mimeType};base64,${data.response.content.text}`">
      </div>
      <div v-else>
        <details v-if="data.response.content.text">
          <summary style="user-select: none;">
            Show content
          </summary>
          <code style="font-family: monospace;">
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
  article {
    overflow-wrap: anywhere;
    user-select: text;

    & section:not(:last-of-type) {
      margin-bottom: .5rem;
    }
  }
</style>
