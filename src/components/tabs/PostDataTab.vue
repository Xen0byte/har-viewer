<script>
  export default {
    name: "PostDataTab",
    props: {
      data: {
        type: Object,
        required: true,
      },
    },
  };
</script>

<template>
  <article v-if="data.request.postData">
    <section>
      <h1>Type</h1>
      {{ data.request.postData.mimeType }}
    </section>
    <section v-if="data.request.postData.params">
      <h1>Parameters</h1>
      <ul>
        <li
          v-for="p in data.request.postData.params"
          :key="p.name"
        >
          <b>{{ p.name }}</b>: {{ p.value }}
        </li>
      </ul>
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
