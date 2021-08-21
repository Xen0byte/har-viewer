<script setup>
  defineProps({
    currentTab: {
      type: String,
      default: "request",
    },
    asDialog: {
      type: Boolean,
      default: false,
    },
    tabs: {
      type: Array,
      default: () => ([]),
    },
  });

  const emit = defineEmits(["change"]);
</script>

<template>
  <nav
    class="tabbar"
    :role="asDialog ? null : 'tablist'"
  >
    <template v-if="asDialog">
      <select
        :value="currentTab"
        @change="e => emit('change', e.target.value)"
      >
        <option
          v-for="tab in tabs"
          :key="tab.name"
          :value="tab.name"
          v-text="tab.displayName"
        />
      </select>
    </template>
    <template v-else>
      <button
        v-for="tab in tabs"
        :key="tab.name"
        :class="{ active: currentTab === tab.name }"
        class="btn btn-dark"
        type="button"
        role="tab"
        @click="emit('change', tab.name)"
        v-text="tab.displayName"
      />
    </template>
  </nav>
</template>

<style
  lang="scss"
  scoped
>
  .tabbar {
    display: flex;
    gap: .35rem;
  }
</style>
