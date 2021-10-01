<script setup>
  defineProps({
    data: {
      type: Object,
      required: true,
    },
  });
</script>

<template>
  <div class="tab-content overflow-text">
    <i>Request on
      <time>{{ data.startedDateTime }}</time>
    </i>
    <section>
      <h1>General</h1>
      <table class="data-table no-align">
        <tbody>
          <tr>
            <th style="vertical-align: top;">
              Request URL
            </th>
            <td v-text="data.request.url.split('?')[0]" />
          </tr>
          <tr>
            <th>Request Method</th>
            <td v-text="data.request.method" />
          </tr>
          <tr v-if="data.request.httpVersion">
            <th>HTTP Version</th>
            <td v-text="data.request.httpVersion" />
          </tr>
          <tr v-if="data.serverIPAddress">
            <th style="min-width: 131px;">
              Remote Address
            </th>
            <td v-text="data.serverIPAddress" />
          </tr>
        </tbody>
      </table>
    </section>
    <section>
      <h1>Headers</h1>
      <ul>
        <li
          v-for="h in data.request.headers"
          :key="h.name"
        >
          <b>{{ h.name }}</b>: {{ h.value }}
        </li>
      </ul>
    </section>
    <section v-if="data.request.queryString.length !== 0">
      <h1>Query Arguments</h1>
      <ul>
        <li
          v-for="q in data.request.queryString"
          :key="q.name"
        >
          <b>{{ q.name }}</b>: {{ q.value }}
        </li>
      </ul>
    </section>
    <section>
      <h1>Size</h1>
      <table class="data-table">
        <tbody>
          <tr>
            <th>Headers</th>
            <td>
              <template v-if="data._harviewer.request.headersSize !== -1">
                {{ data._harviewer.request.headersSize }} bytes
                <template v-if="data._harviewer.request.headersSizeComputed">
                  (computed)
                </template>
              </template>
              <template v-else>
                (not available)
              </template>
            </td>
          </tr>
          <tr>
            <th>Body</th>
            <td>
              <template v-if="data._harviewer.request.bodySize !== -1">
                {{ data._harviewer.request.bodySize }} bytes
                <template v-if="data._harviewer.request.bodySizeComputed">
                  (computed)
                </template>
              </template>
              <template v-else>
                (not available)
              </template>
            </td>
          </tr>
          <tr>
            <th>Total</th>
            <td>
              {{ data._harviewer.request.totalSize }} bytes
              <template v-if="data._harviewer.request.totalSizeComputed">
                (computed)
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <section v-if="data._initiator">
      <h1>Initiator</h1>
      <table class="data-table no-align">
        <tbody>
          <tr>
            <th>Type</th>
            <td v-text="data._initiator.type" />
          </tr>
          <tr v-if="data._initiator.type === 'parser' || data._initiator.type === 'preflight'">
            <th>Url</th>
            <td v-text="data._initiator.url" />
          </tr>
          <tr v-if="data._initiator.type === 'parser'">
            <th>Line Number</th>
            <td v-text="data._initiator.lineNumber" />
          </tr>
        </tbody>
      </table>
      <div v-if="data._initiator.type === 'script' && data._initiator.stack.callFrames.length > 0">
        <details style="margin-top: .25rem">
          <summary class="is-unselectable">
            Call Stack
          </summary>
          <ul>
            <li
              v-for="(f, i) in data._initiator.stack.callFrames"
              :key="i"
            >
              {{ f.scriptId }}: {{ f.functionName }} ({{ f.lineNumber }}:{{ f.columnNumber }})<br>
              {{ f.url }}
            </li>
          </ul>
        </details>
      </div>
    </section>
  </div>
</template>
