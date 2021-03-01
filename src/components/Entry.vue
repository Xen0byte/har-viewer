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
          'tag-unknown': entry.response.status === 0,
          'tag-info': entry.response.status < 200 && entry.response.status != 0,
          'tag-success': entry.response.status > 199 && entry.response.status < 300,
          'tag-info': entry.response.status > 299 && entry.response.status < 400,
          'tag-warning': entry.response.status > 399 && entry.response.status < 500,
          'tag-error': entry.response.status > 499
        }"
      >
        <span v-text="entry.response.status !== 0 ? entry.response.status : entry.response._error || 'unknown'" />
        <span
          v-if="entry.response.statusText"
          style="margin-left: .5em;"
          v-text="entry.response.statusText"
        />
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

    background-color: var(--color-background-card);
    border-color: var(--color-background-card);

    &:hover, &.active {
      background-color: var(--color-background);
      border-color: var(--color-text);
    }
  }
</style>
