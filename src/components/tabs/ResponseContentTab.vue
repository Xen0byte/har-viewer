<script>
  export default {
    name: "ResponseContentTab",
    props: {
      data: {
        type: Object,
        required: true,
      },
    },
  };
</script>

<template>
  <article v-if="data.response.content">
    <section>
      <h1>Size</h1>
      {{ data.response.content.size }}
    </section>
    <section v-if="data.response.content.encodind">
      <h1>Encoding</h1>
      {{ data.response.content.encodind }}
    </section>
    <section>
      <h1>Mime Type</h1>
      {{ data.response.content.mimeType }}
    </section>
    <section>
      <h1>Content</h1>
      {{ data.response.content.text }}
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
