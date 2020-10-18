<script>
  export default {
    props: {
      timings: {
        type: Object,
        required: true,
      },
    },
    setup() {
      const round = n => Math.round(n);

      return {
        round,
      };
    },
  };
</script>

<template>
  <div>
    <h2>
      Request Times
    </h2>
    <table>
      <tbody>
        <tr>
          <th style="vertical-align: top; text-align: start;">
            Blocked Time
          </th>
          <td v-if="timings.blocked === -1">
            Does not apply
          </td>
          <td
            v-else
            style="overflow-wrap: anywhere;"
          >
            {{ round(timings.blocked) }} ms
          </td>
        </tr>
        <tr>
          <th style="vertical-align: top; text-align: start;">
            DNS Time
          </th>
          <td v-if="timings.dns === -1">
            Does not apply
          </td>
          <td
            v-else
            style="overflow-wrap: anywhere;"
          >
            {{ round(timings.dns) }} ms
          </td>
        </tr>
        <tr>
          <th style="vertical-align: top; text-align: start;">
            Connection Time
          </th>
          <td v-if="timings.connect === -1">
            Does not apply
          </td>
          <td
            v-else
            style="overflow-wrap: anywhere;"
          >
            {{ round(timings.connect) }} ms
          </td>
        </tr>
        <tr>
          <th style="vertical-align: top; text-align: start;">
            Send Time
          </th>
          <td v-if="timings.send === -1">
            Does not apply
          </td>
          <td
            v-else
            style="overflow-wrap: anywhere;"
          >
            {{ round(timings.send) }} ms
          </td>
        </tr>
        <tr>
          <th style="vertical-align: top; text-align: start;">
            Wait Time
          </th>
          <td v-if="timings.wait === -1">
            Does not apply
          </td>
          <td
            v-else
            style="overflow-wrap: anywhere;"
          >
            {{ round(timings.wait) }} ms
          </td>
        </tr>
        <tr>
          <th style="vertical-align: top; text-align: start;">
            Receive Time
          </th>
          <td v-if="timings.receive === -1">
            Does not apply
          </td>
          <td
            v-else
            style="overflow-wrap: anywhere;"
          >
            {{ round(timings.receive) }} ms
          </td>
        </tr>
        <tr>
          <th style="vertical-align: top; text-align: start;">
            SSL Time
          </th>
          <td v-if="timings.ssl === -1">
            Does not apply
          </td>
          <td
            v-else
            style="overflow-wrap: anywhere;"
          >
            {{ round(timings.ssl) }} ms
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
