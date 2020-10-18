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
      const round = n => Math.round(n);

      return {
        onSelect,
        round,
      };
    },
  };
</script>

<template>
  <div
    class="entry column is-unselectable"
    @click="onSelect"
  >
    <div class="summary">
      <b
        style="margin-right: 1em;"
        v-text="entry.request.method"
      />
      <div
        style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;"
        v-text="entry.request.url.split('?')[0]"
      />
    </div>
    <div
      class="row"
      style="align-items: center; margin-top: 1em;"
    >
      <div
        class="tag"
        :class="{
          'tag-info': entry.response.status < 200,
          'tag-success': entry.response.status > 199 && entry.response.status < 300,
          'tag-info': entry.response.status > 299 && entry.response.status < 400,
          'tag-warning': entry.response.status > 399 && entry.response.status < 500,
          'tag-error': entry.response.status > 499
        }"
      >
        <span
          style="margin-right: .5em;"
          v-text="entry.response.status"
        />
        <span v-text="entry.response.statusText" />
      </div>
      <span style="margin-left: 1em;">
        {{ round(entry.time) }} ms
      </span>
    </div>
  </div>
</template>

<style
  lang="scss"
  scoped
>
  @use "sass:map";
  @import "../styles/colors";

  .summary {
    overflow-wrap: anywhere;
  }

  .entry {
    padding: .75em;
    border-radius: 5px;
    cursor: pointer;
    border-width: 1px;
    border-style: dashed;
    margin-right: .75em;

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
