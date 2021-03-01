<script>
  import { ref, computed, watch } from "vue";
  import Modal from "./Modal";

  export default {
    components: { Modal },
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
      const showPreview = ref(false);

      watch(() => props.response, () => {
        showPreview.value = false;
      });

      const onShowPreview = () => {
        showPreview.value = true;
      };

      const isImage = computed(() => !!props.response.content.text
        && props.response.content.encoding === "base64"
        && props.response.content.mimeType.startsWith("image/"));

      const isText = computed(() => !!props.response.content.text
        && (props.response.content.mimeType.startsWith("text/")
          || props.response.content.mimeType.startsWith("application/")));

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
        isText,
        getImageDate,
        showPreview,
        onDownload,
        onShowPreview,
      };
    },
  };
</script>

<template>
  <div>
    <h2>Response Content</h2>
    <div>
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
      <Modal
        v-if="(isImage || isText) && showPreview"
        @close="showPreview = false"
      >
        <img
          v-if="isImage"
          :src="getImageDate()"
          style="height: 500px; max-width: 100%;"
        >
        <code
          v-if="isText"
          v-text="response.content.text"
        />
      </Modal>
      <button
        v-if="isImage || (isText && response.content.size <= 100000)"
        class="btn-primary"
        style="margin-top: .5em; margin-right: .5em"
        @click="onShowPreview"
      >
        Show Preview
      </button>
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
