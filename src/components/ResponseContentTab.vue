<script>
  import { ref, computed } from "vue";
  import Prism from "prismjs";

  import "../styles/prism.scss";

  export default {
    props: {
      response: {
        type: Object,
        required: true,
      },
      filename: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const showContent = ref(false);

      const isImage = () => !!props.response.content.text
        && props.response.content.encoding === "base64"
        && props.response.content.mimeType.startsWith("image/");

      const isText = () => !!props.response.content.text
        && (props.response.content.mimeType.startsWith("text/")
          || props.response.content.mimeType.startsWith("application/"));

      // eslint-disable-next-line max-len
      const getImageDate = () => `data:${props.response.content.mimeType};${props.response.content.encoding}, ${props.response.content.text}`;

      const getLanguage = () => props.response.content.mimeType
        .split("/")[1].split(";")[0];

      const highlightedCode = computed(() => {
        if (isText(props.response.content)) {
          const lang = getLanguage();
          const grammar = Prism.languages[lang];

          if (!grammar) {
            return props.response.content.text;
          }

          return Prism.highlight(props.response.content.text, Prism.languages[lang], lang);
        }

        return null;
      });

      const onDownload = () => {
        // eslint-disable-next-line max-len
        let url = `data:${props.response.content.mimeType};charset=utf-8,${encodeURIComponent(props.response.content.text)}`;

        if (props.response.content.encoding === "base64") {
          url = `data:application/octet-stream;base64,${props.response.content.text}`;
        }

        const element = document.createElement("a");
        element.setAttribute("href", url);
        element.setAttribute("download", props.filename);

        element.style.display = "none";
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      };

      return {
        isImage,
        isText,
        getImageDate,
        highlightedCode,
        showContent,
        onDownload,
      };
    },
  };
</script>

<template>
  <div>
    <h2>Response Content</h2>
    <div style="padding-bottom: 1em;">
      <b>Body Size:</b> {{ response.bodySize }} bytes<br>
      <b>Content Size:</b> {{ response.content.size }} bytes<br>
      <b>Mime Type:</b> {{ response.content.mimeType }}
      <div v-if="response.content.comment">
        <br>
        <span
          class="comment"
          v-text="response.content.comment"
        />
      </div>
      <br>
      <div v-if="response.content.encoding">
        <b>Encoding:</b> {{ response.content.encoding }}
      </div>
      <!--TODO: add download button for preview and content-->
      <div v-if="isImage()">
        <h3>Preview</h3>
        <img
          :src="getImageDate()"
          alt="Content Preview"
        >
      </div>
      <div v-if="isText()">
        <h3>Content</h3>
        <button
          class="btn-primary"
          @click="showContent = !showContent"
        >
          {{ showContent ? "Hide Content" : "Show Content" }}
        </button>
        <div
          v-if="showContent"
          class="code"
        >
          <pre><code v-html="highlightedCode" /></pre>
        </div>
      </div>
      <button
        class="btn-primary"
        style="margin-top: .5em;"
        @click="onDownload"
      >
        Download
      </button>
    </div>
  </div>
</template>

<style
  lang="scss"
  scoped
>
  @use "sass:map";
  @import "../styles/colors";

  .code {
    border-radius: 5px;

    @media (prefers-color-scheme: dark) {
      background-color: map.get($colors-dark, "background.paper");
    }

    @media (prefers-color-scheme: light) {
      background-color: map.get($colors-light, "background.default");
    }

    & > pre {
      overflow: hidden;
      padding: 1em;

      & > code {
        overflow-wrap: break-word;
        white-space: pre-wrap;
      }
    }

    & > pre,
    & > pre > code {
      max-height: 400px;
    }
  }

  .comment {
    @media (prefers-color-scheme: dark) {
      color: map.get($colors-dark, "text.secondary");
    }

    @media (prefers-color-scheme: light) {
      color: map.get($colors-light, "text.secondary");
    }
  }
</style>
