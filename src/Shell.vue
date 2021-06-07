<script>
  import { ref, onMounted } from "vue";
  import svgLoading from "@mdi/svg/svg/loading.svg";
  import svgAlertCircleOutline from "@mdi/svg/svg/alert-circle-outline.svg";

  import AppBar from "./components/AppBar";
  import { parseHarFile, checkHar } from "./utils/har";

  export default {
    name: "Shell",
    components: { AppBar },
    setup() {
      const data = ref(null);
      const isLoading = ref(false);
      const hasError = ref(null);

      onMounted(() => {
        // workaround for 100vh on mobile browsers
        window.height = window.innerHeight;
      });

      const openFile = () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".har";

        fileInput.onchange = async ({ target: input }) => {
          if (!input.files || input.files.length !== 1) {
            return;
          }

          isLoading.value = true;

          try {
            data.value = await parseHarFile(input.files[0]);
            hasError.value = null;
          } catch (e) {
            data.value = null;
            hasError.value = e.message;
          } finally {
            isLoading.value = false;
          }
        };

        fileInput.click();
      };

      const loadUrl = async () => {
        // eslint-disable-next-line no-alert
        const url = window.prompt("Enter the URL of the HAR file to load:");

        if (!url) {
          return;
        }

        isLoading.value = true;

        try {
          const res = await window.fetch(url);
          const resData = await res.json();

          data.value = checkHar(resData);
          hasError.value = null;
        } catch (e) {
          data.value = null;
          hasError.value = e.message;
        } finally {
          isLoading.value = false;
        }
      };

      const onAction = async action => {
        switch (action) {
          case "openFile":
            openFile();
            break;
          case "loadUrl":
            await loadUrl();
            break;
          default:
            // eslint-disable-next-line no-console
            console.error(`unsupported action: ${action}`);
            break;
        }
      };

      return {
        data,
        isLoading,
        hasError,
        onAction,
        svgLoading,
        svgAlertCircleOutline,
      };
    },
  };
</script>

<template>
  <app-bar
    :is-loaded="!!data"
    @action="onAction"
  >
    <h1>HTTP Archive Viewer</h1>
  </app-bar>
  <main>
    <div
      v-if="isLoading"
      class="loading"
    >
      <img :src="svgLoading">
    </div>
    <div
      v-if="hasError && !isLoading"
      class="error"
    >
      <img :src="svgAlertCircleOutline">
      <span v-text="hasError" />
    </div>
  </main>
</template>

<style lang="scss">
  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-height: 100vh;
    overflow: hidden;
  }

  main {
    flex-grow: 1;
    height: 0;
  }

  .error {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    user-select: none;
    color: #DF7B6E;
    flex-direction: column;

    & > span {
      font-weight: 600;
      font-size: 1.2rem;
    }

    & > img {
      filter: invert(71%) sepia(36%) saturate(1149%) hue-rotate(309deg) brightness(89%) contrast(95%);
      height: 128px;
      width: 128px;
    }
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    user-select: none;

    & > img {
      filter: invert(12%) sepia(39%) saturate(6592%) hue-rotate(196deg) brightness(96%) contrast(98%);
      animation: spin 1s linear infinite;
      height: 64px;
      width: 64px;
    }

    @keyframes spin {
      100% {
        transform: rotate(360deg);
      }
    }
  }
</style>
