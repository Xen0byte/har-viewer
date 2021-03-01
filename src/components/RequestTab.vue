<script>
  export default {
    props: {
      timestamp: {
        type: String,
        required: true,
      },
      remoteAddress: {
        type: String,
        required: true,
      },
      request: {
        type: Object,
        required: true,
      },
    },
  };
</script>

<template>
  <div>
    Request on <span v-text="timestamp" />
    <h2>General</h2>
    <table>
      <tbody>
        <tr>
          <th style="vertical-align: top; text-align: start;">
            HTTP Version
          </th>
          <td
            style="overflow-wrap: anywhere;"
            v-text="request.httpVersion"
          />
        </tr>
        <tr>
          <th style="vertical-align: top; text-align: start;">
            Request Method
          </th>
          <td
            style="overflow-wrap: anywhere;"
            v-text="request.method"
          />
        </tr>
        <tr>
          <th style="vertical-align: top; text-align: start;">
            Request URL
          </th>
          <td
            style="overflow-wrap: anywhere;"
            v-text="request.url.split('?')[0]"
          />
        </tr>
        <tr>
          <th style="vertical-align: top; text-align: start;">
            Remote Address
          </th>
          <td
            style="overflow-wrap: anywhere;"
            v-text="remoteAddress"
          />
        </tr>
      </tbody>
    </table>
    <div v-if="request.postData">
      <h2>Post Data</h2>
      <div>
        <b>Body Size:</b> {{ request.bodySize }} bytes<br>
        <b>Data Size:</b> {{ request.postData.size }}<br>
        <b>Mime Type:</b> {{ request.postData.mimeType }}
        <h3>Parameters</h3>
        <div
          v-for="(param, i) in request.postData.params"
          :key="i"
        >
          <b>{{ param.name }}:</b>
          <span
            :class="{ redacted: param.value === 'redacted' }"
            v-text="` ${param.value}`"
          />
        </div>
      </div>
    </div>
    <h2>Headers</h2>
    <table>
      <tbody>
        <tr
          v-for="(header, i) in request.headers"
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
    <div v-if="request.cookies.length > 0">
      <h2>Cookies</h2>
      <table>
        <tbody>
          <tr
            v-for="(cookie, i) in request.cookies"
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
    <div v-if="request.queryString.length > 0">
      <h2>Query Parameters</h2>
      <table>
        <tbody>
          <tr
            v-for="(queryParam, i) in request.queryString"
            :key="i"
          >
            <th
              style="vertical-align: top; text-align: start;"
              v-text="queryParam.name"
            />
            <td
              style="overflow-wrap: anywhere;"
              v-text="queryParam.value"
            />
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
