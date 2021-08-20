<script setup>
  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });
</script>

<template>
  <div class="tab-content overflow-text">
    <section v-if="props.data.request.cookies.length !== 0">
      <h1>Sent</h1>
      <ul>
        <li
          v-for="c in props.data.request.cookies"
          :key="c.name"
        >
          <b v-text="c.name" />
          <ul>
            <li>Value: {{ c.value }}</li>
            <li v-if="c.domain">
              Domain: {{ c.domain }}
            </li>
            <li>Path: {{ c.path || "/" }}</li>
            <li>Expires: {{ c.expires || "Session" }}</li>
          </ul>
        </li>
      </ul>
    </section>
    <section v-if="props.data.response.cookies.length !== 0">
      <h1>Received</h1>
      <ul>
        <li
          v-for="c in props.data.response.cookies"
          :key="c.name"
        >
          <b v-text="c.name" />
          <ul>
            <li>Value: {{ c.value }}</li>
            <li v-if="c.domain">
              Domain: {{ c.domain }}
            </li>
            <li>Path: {{ c.path || "/" }}</li>
            <li>Expires: {{ c.expires || "Session" }}</li>
          </ul>
        </li>
      </ul>
    </section>
  </div>
</template>
