<script>
  export default {
    props: {
      entry: {
        type: Object,
        required: true,
      },
    },
    emits: [
      "select",
    ],
    setup(props, { emit }) {
      const onSelect = () => emit("select");

      return {
        onSelect,
      };
    },
  };
</script>

<template>
  <div
    class="entry"
    @click="onSelect"
  >
    <div>
      <b
        style="margin-right: 1em;"
        v-text="entry.request.method"
      />
      <span v-text="entry.request.url.split('?')[0]" />
    </div>
    <div style="margin-top: 1em;">
      <span
        style="margin-right: .5em;"
        v-text="entry.response.status"
      />
      <span v-text="entry.response.statusText" />
    </div>
  </div>
</template>

<style
  lang="scss"
  scoped
>
  @use "sass:map";
  @import "../styles/colors";

  .entry {
    display: flex;
    flex-direction: column;
    padding: 1em;
    border-radius: 5px;
    cursor: pointer;
    border-width: 1px;
    border-style: dashed;

    @media (prefers-color-scheme: dark) {
      border-color: map.get($colors-dark, "background.paper");
      background-color: map.get($colors-dark, "background.paper");

      &:hover, &.active {
        border-color: map.get($colors-dark, "text.secondary");
        background-color: map.get($colors-dark, "background.default");
      }
    }

    @media (prefers-color-scheme: light) {
      border-color: map.get($colors-light, "background.default");
      background-color: map.get($colors-light, "background.default");

      &:hover, &.active {
        border-color: map.get($colors-light, "text.secondary");
        background-color: map.get($colors-light, "background.paper");
      }
    }
  }
</style>
