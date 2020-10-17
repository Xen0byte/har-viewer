<script>
  import { onMounted, onUpdated } from "vue";
  import Prism from "prismjs";

  export default {
    props: {
      entry: {
        type: Object,
        required: true,
      },
    },
    setup() {
      const isImage = content => !!content.text
        && content.encoding === "base64"
        && content.mimeType.startsWith("image/");

      const isText = content => !!content.text
        && (content.mimeType.startsWith("text/") || content.mimeType.startsWith("application/"));

      const getImageDate = content => `data:${content.mimeType};${content.encoding}, ${content.text}`;

      const getHighlightingClass = mimeType => `language-${mimeType.split("/")[1].split(";")[0]}`;

      onMounted(() => Prism.highlightAll());
      onUpdated(() => Prism.highlightAll());

      return {
        isImage,
        isText,
        getImageDate,
        getHighlightingClass,
      };
    },
  };
</script>

<template>
  <div class="details">
    <h1>General</h1>
    <b>Started:</b> <span v-text="(new Date(entry.startedDateTime).toUTCString())" /><br>
    <b>Time:</b> <span v-text="`${entry.time}ms`" />
    <hr class="divider">
    <h1>Request</h1>
    <b>HTTP Version:</b> <span v-text="entry.request.httpVersion" /><br>
    <b>Method:</b> <span v-text="entry.request.method" /><br>
    <b>URL:</b> <span v-text="entry.request.url.split('?')[0]" />
    <div v-if="entry.request.postData">
      <h2>Post Data</h2>
      <div>
        <b>Body Size:</b> {{ entry.request.bodySize }} bytes<br>
        <b>Data Size:</b> {{ entry.request.postData.size }}
        <b>Mime Type:</b> {{ entry.request.postData.mimeType }}
        <h3>Parameters</h3>
        <div
          v-for="(param, i) in entry.request.postData.params"
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
    <div style="margin-bottom: 1em;">
      <b>Size:</b> {{ entry.request.headersSize }} bytes
    </div>
    <div
      v-for="(header, i) in entry.request.headers"
      :key="i"
    >
      <b>{{ header.name }}: </b>
      <span
        :class="{ redacted: header.value === 'redacted' }"
        v-text="header.value"
      />
    </div>
    <div v-if="entry.request.cookies.length > 0">
      <h2>Cookies</h2>
      <div
        v-for="(cookie, i) in entry.request.cookies"
        :key="i"
      >
        <b>{{ cookie.name }}: </b>
        <span
          :class="{ redacted: cookie.value === 'redacted' }"
          v-text="cookie.value"
        />
      </div>
    </div>
    <div v-if="entry.request.queryString.length > 0">
      <h2>Query Parameters</h2>
      <div
        v-for="(queryParam, i) in entry.request.queryString"
        :key="i"
      >
        <b>{{ queryParam.name }}:</b> <span v-text="queryParam.value" />
      </div>
    </div>
    <hr class="divider">
    <h1>Response</h1>
    <b>HTTP Version:</b> <span v-text="entry.response.httpVersion" /><br>
    <b>Status:</b> {{ entry.response.status }} {{ entry.response.statusText }}
    <div v-if="entry.response.redirectURL">
      <b>Redirect URL:</b>
      <span
        style="word-break: break-all;"
        v-text="entry.response.redirectURL"
      />
    </div>
    <h2>Headers</h2>
    <div style="margin-bottom: 1em;">
      <b>Size:</b> {{ entry.response.headersSize }} bytes
    </div>
    <div
      v-for="(header, i) in entry.response.headers"
      :key="i"
    >
      <b>{{ header.name }}: </b>
      <span
        :class="{ redacted: header.value === 'redacted' }"
        v-text="header.value"
      />
    </div>
    <div v-if="entry.response.cookies.length > 0">
      <h2>Cookies</h2>
      <div
        v-for="(cookie, i) in entry.response.cookies"
        :key="i"
      >
        <b>{{ cookie.name }}: </b>
        <span
          :class="{ redacted: cookie.value === 'redacted' }"
          v-text="cookie.value"
        />
      </div>
    </div>
    <div v-if="entry.response.content">
      <h2>Body</h2>
      <div style="padding-bottom: 1em;">
        <b>Body Size:</b> {{ entry.response.bodySize }} bytes<br>
        <b>Content Size:</b> {{ entry.response.content.size }} bytes<br>
        <b>Mime Type:</b> {{ entry.response.content.mimeType }}
        <div v-if="entry.response.content.comment">
          <br>
          <span
            class="comment"
            v-text="entry.response.content.comment"
          />
        </div>
        <br>
        <div v-if="entry.response.content.encoding">
          <b>Encoding:</b> {{ entry.response.content.encoding }}
        </div>
        <!--TODO: add download button for preview and content-->
        <div v-if="isImage(entry.response.content)">
          <h3>Preview</h3>
          <img :src="getImageDate(entry.response.content)">
        </div>
        <div v-if="isText(entry.response.content)">
          <h3>Content</h3>
          <div class="code">
            <pre><code
              :class="getHighlightingClass(entry.response.content.mimeType)"
              v-text="entry.response.content.text"
            /></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  lang="scss"
  scoped
>
  @use "sass:map";
  @import "../styles/colors";

  .details {
    padding-left: .75em;
    padding-right: .75em;
  }

  .comment, .redacted {
    @media (prefers-color-scheme: dark) {
      color: map.get($colors-dark, "text.secondary");
    }

    @media (prefers-color-scheme: light) {
      color: map.get($colors-light, "text.secondary");
    }
  }

  .code {
    & > pre {
      overflow: hidden;
    }

    & > pre,
    & > pre > code {
      max-height: 400px;
    }
  }

  .divider {
    @media (prefers-color-scheme: dark) {
      border-color: map.get($colors-dark, "divider");
    }

    @media (prefers-color-scheme: light) {
      border-color: map.get($colors-light, "divider");
    }
  }
</style>
