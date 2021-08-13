<script setup>
  import { computed } from "vue";

  const props = defineProps({
    currentTab: {
      type: String,
      default: "request",
    },
    asDialog: {
      type: Boolean,
      default: false,
    },
    hasPostData: {
      type: Boolean,
      default: false,
    },
    hasResponseContent: {
      type: Boolean,
      default: false,
    },
    hasWebsocket: {
      type: Boolean,
      default: false,
    },
    hasCookies: {
      type: Boolean,
      default: false,
    },
    hasTimings: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(["change"]);

  const isActive = tab => props.currentTab === tab;
  const onChange = tab => emit("change", tab);

  // TODO: move outside of component
  const availableTabs = [
    { name: "request", displayName: "Request" },
    { name: "post-data", displayName: "Post Data" },
    { name: "response", displayName: "Response" },
    { name: "response-content", displayName: "Response Content" },
    { name: "websocket", displayName: "Websocket" },
    { name: "cookies", displayName: "Cookies" },
    { name: "timing", displayName: "Timing" },
  ];

  // TODO: use map
  const enabledTabs = computed(() => availableTabs.filter(tab => (
    !(tab.name === "post-data" && !props.hasPostData)
    && !(tab.name === "response-content" && !props.hasResponseContent)
    && !(tab.name === "websocket" && !props.hasWebsocket)
    && !(tab.name === "cookies" && !props.hasCookies)
    && !(tab.name === "timings" && !props.hasTimings)
  )));
</script>

<template>
  <nav
    class="tabbar"
    :role="props.asDialog ? null : 'tablist'"
  >
    <template v-if="props.asDialog">
      <select
        :value="props.currentTab"
        @change="e => onChange(e.target.value)"
      >
        <option
          v-for="tab in enabledTabs"
          :key="tab.name"
          :value="tab.name"
          v-text="tab.displayName"
        />
      </select>
    </template>
    <template v-else>
      <button
        v-for="tab in enabledTabs"
        :key="tab.name"
        :class="{ active: isActive(tab.name) }"
        class="btn btn-dark"
        type="button"
        role="tab"
        @click="onChange(tab.name)"
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
  }

  button:not(:last-of-type) {
    margin-right: .35rem;
  }
</style>
