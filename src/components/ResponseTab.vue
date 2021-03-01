<script>
  export default {
    props: {
      response: {
        type: Object,
        required: true,
      },
    },
  };
</script>

<template>
  <div>
    <h2 style="margin-top: 0;">
      General
    </h2>
    <table>
      <tbody>
        <tr>
          <th style="vertical-align: top; text-align: start;">
            HTTP Version
          </th>
          <td
            style="overflow-wrap: anywhere;"
            v-text="response.httpVersion"
          />
        </tr>
        <tr>
          <th style="vertical-align: top; text-align: start;">
            Response Status
          </th>
          <td style="overflow-wrap: anywhere;">
            {{ response.status }} {{ response.statusText }}
          </td>
        </tr>
        <tr v-if="response.redirectURL">
          <th style="vertical-align: top; text-align: start;">
            Redirect URL
          </th>
          <td
            style="overflow-wrap: anywhere;"
            v-text="response.redirectURL"
          />
        </tr>
      </tbody>
    </table>
    <h2>Headers</h2>
    <table>
      <tbody>
        <tr
          v-for="(header, i) in response.headers"
          :key="i"
        >
          <th
            style="vertical-align: top; text-align: start;"
            v-text="header.name"
          />
          <td style="overflow-wrap: anywhere;">
            <span
              :class="{ redacted: header.value === 'redacted' }"
              v-text="header.value"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="response.cookies.length > 0">
      <h2>Cookies</h2>
      <table>
        <tbody>
          <tr
            v-for="(cookie, i) in response.cookies"
            :key="i"
          >
            <th
              style="vertical-align: top; text-align: start;"
              v-text="cookie.name"
            />
            <td style="overflow-wrap: anywhere;">
              <span
                :class="{ redacted: cookie.value === 'redacted' }"
                v-text="cookie.value"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style
  lang="scss"
  scoped
>
  h2 {
    margin-top: 1em;
  }
</style>
