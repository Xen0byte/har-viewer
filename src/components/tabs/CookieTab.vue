<script>
  export default {
    name: "CookieTab",
    props: {
      data: {
        type: Object,
        required: true,
      },
    },
  };
</script>

<template>
  <article>
    <section>
      <h1>Sent</h1>
      <ul>
        <li
          v-for="c in data.request.cookies"
          :key="c.name"
        >
          {{ c.name }}: {{ c.value }}
        </li>
      </ul>
    </section>
    <section>
      <h1>Received</h1>
      <ul>
        <li
          v-for="c in data.response.cookies"
          :key="c.name"
        >
          {{ c.name }}: {{ c.value }}
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
