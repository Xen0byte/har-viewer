<script setup>
  defineProps({
    data: {
      type: Object,
      required: true,
    },
  });
</script>

<template>
  <div
    v-if="data._webSocketMessages"
    class="tab-content overflow-text"
  >
    <section>
      <h1>Send</h1>
      <ul>
        <li
          v-for="(m, i) in data._webSocketMessages.filter(o => o.type === 'send')"
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
    <section>
      <h1>Receive</h1>
      <ul>
        <li
          v-for="(m, i) in data._webSocketMessages.filter(o => o.type === 'receive')"
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
