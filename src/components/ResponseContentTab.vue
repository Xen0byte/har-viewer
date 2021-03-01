<script>
  import { ref } from "vue";

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

      // eslint-disable-next-line max-len
      const getImageDate = () => `data:${props.response.content.mimeType};${props.response.content.encoding}, ${props.response.content.text}`;

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
        getImageDate,
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
  .comment {
    color: var(--color-text);
  }
</style>
