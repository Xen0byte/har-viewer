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
    <section v-if="data.request.cookies.length !== 0">
      <h1>Sent</h1>
      <ul>
        <li
          v-for="c in data.request.cookies"
          :key="c.name"
        >
          <b>{{ c.name }}</b>: {{ c.value }}
        </li>
      </ul>
    </section>
    <section v-if="data.response.cookies.length !== 0">
      <h1>Received</h1>
      <ul>
        <li
          v-for="c in data.response.cookies"
          :key="c.name"
        >
          <b>{{ c.name }}</b>: {{ c.value }}
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
