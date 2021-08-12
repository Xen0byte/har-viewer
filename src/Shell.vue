<script>
  import { ref, onMounted, onBeforeMount } from "vue";
  import svgLoading from "@mdi/svg/svg/loading.svg";
  import svgAlertCircleOutline from "@mdi/svg/svg/alert-circle-outline.svg";

  import AppBar from "./components/AppBar";
  import InfoDialog from "./components/dialogs/InfoDialog";
  import PropDialog from "./components/dialogs/PropDialog";
  import HarViewer from "./components/HarViewer";
  import Footer from "./components/Footer";

  import { parseHarFile, checkHar } from "./utils/har";
  import { getSystemTheme, switchTheme } from "./utils/theme";

  export default {
    name: "Shell",
    components: {
      InfoDialog,
      PropDialog,
      Footer,
      AppBar,
      HarViewer,
    },
    setup() {
      const data = ref(null);
      const file = ref("");
      const isLoading = ref(false);
      const hasError = ref(null);
      const showPropDialog = ref(false);
      const propAttached = ref(false);
      const showInfoDialog = ref(false);
      const propFilter = ref({
        filter: {
          methods: "",
          status: "",
          resType: "",
          domains: "",
        },
        sortBy: "",
        groupBy: "",
      });
      const isStandalone = ref(window.matchMedia("(display-mode: standalone)").matches
        || (window.navigator.standalone)
        || document.referrer.includes("android-app://"));

      onBeforeMount(() => {
        switchTheme(getSystemTheme());
      });

      onMounted(() => {
        // workaround for 100vh on mobile browsers
        window.height = window.innerHeight;
      });

      const onPropApply = filter => {
        propFilter.value = filter;
        showPropDialog.value = false;
      };

      const onPropAttach = () => {
        showPropDialog.value = false;
        propAttached.value = !propAttached.value;
      };

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
            file.value = input.files[0].name;
          } catch (e) {
            data.value = null;
            hasError.value = e.message;
            file.value = "";
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
          file.value = url;
        } catch (e) {
          file.value = "";
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
          case "sort-and-filter":
            showPropDialog.value = true;
            break;
          case "info":
            showInfoDialog.value = true;
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
        file,
        isStandalone,
        showPropDialog,
        onPropApply,
        onPropAttach,
        propFilter,
        propAttached,
        showInfoDialog,
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
  <main
    v-if="isLoading"
    class="loading"
  >
    <img :src="svgLoading">
  </main>
  <main
    v-if="hasError && !isLoading"
    class="error column"
  >
    <img :src="svgAlertCircleOutline">
    <span v-text="hasError" />
  </main>
  <main
    v-if="!isLoading && !hasError && !!data"
    class="row is-unselectable"
  >
    <HarViewer
      :data="data"
      :filter="propFilter"
    />
    <component
      :is="propAttached ? 'aside' : 'div'"
      v-if="showPropDialog || propAttached"
      class="propdialog-container"
    >
      <PropDialog
        v-if="showPropDialog || propAttached"
        :filter="propFilter"
        :is-attached="propAttached"
        @apply="onPropApply"
        @close="showPropDialog = false"
        @attach="onPropAttach"
      />
    </component>
  </main>
  <main v-if="!hasError && !isLoading && !data" />
  <Footer v-if="!isStandalone" />
  <InfoDialog
    v-if="showInfoDialog && data"
    :creator="data.creator"
    :version="data.version"
    @close="showInfoDialog = false"
  />
</template>

<style lang="scss">
  body {
    min-height: 100vh;
    max-height: 100vh;
    overflow: hidden;
  }

  main {
    flex-grow: 1;
    height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .propdialog-container {
    height: 100%;
    border-left: var(--color-background-dark) solid 2px;

    @media (max-width: 475px) {
      border-left: unset;
    }
  }

  .error {
    color: #df7b6e;

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
    & > img {
      filter: invert(57%) sepia(74%) saturate(1464%) hue-rotate(182deg) brightness(98%) contrast(92%);
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
