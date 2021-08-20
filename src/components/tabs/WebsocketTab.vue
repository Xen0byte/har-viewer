<script setup>
  import { computed } from "vue";

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });

  // eslint-disable-next-line no-underscore-dangle
  const receive = computed(() => props.data._webSocketMessages.filter(o => o.type === "receive"));
  // TODO: implement send
</script>

<template>
  <div
    v-if="props.data._webSocketMessages"
    class="tab-content overflow-text"
  >
    <section>
      <h1>Receive</h1>
      <ul>
        <li
          v-for="(m, i) in receive"
          :key="i"
        >
          <b>Time: {{ m.time }}</b>
          <ul>
            <li>OP Code: {{ m.opcode }}</li>
            <li>Data: <code v-text="m.data" /></li>
          </ul>
        </li>
      </ul>
    </section>
  </div>
</template>
