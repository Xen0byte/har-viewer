<script setup>
  import { ref, onMounted, onBeforeMount } from "vue";
  import svgLoading from "@mdi/svg/svg/loading.svg";
  import svgAlertCircleOutline from "@mdi/svg/svg/alert-circle-outline.svg";

  import AppBar from "./components/AppBar";
  import InfoDialog from "./components/dialogs/InfoDialog";
  import OpenDialog from "./components/dialogs/OpenDialog";
  import PropDialog from "./components/dialogs/PropDialog";
  import HarViewer from "./components/HarViewer";
  import Footer from "./components/Footer";

  import { getSystemTheme, switchTheme, isPWA } from "./utils/theme";

  const data = ref(null);
  const file = ref("");
  const isLoading = ref(false);
  const hasError = ref(null);
  const showPropDialog = ref(false);
  const propAttached = ref(false);
  const showInfoDialog = ref(false);
  const showOpenDialog = ref(false);
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
  const isStandalone = isPWA();

  onBeforeMount(() => switchTheme(getSystemTheme()));
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

  const onOpenFile = async payload => {
    showOpenDialog.value = false;
    isLoading.value = true;

    file.value = payload.src;

    try {
      data.value = payload.data;
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
      case "open":
        showOpenDialog.value = true;
        break;
      case "sort-and-filter":
        showPropDialog.value = true;
        break;
      case "sort-and-filter_attached":
        onPropAttach();
        showPropDialog.value = true;
        break;
      case "info":
        showInfoDialog.value = true;
        break;
      default:
        break;
    }
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
    class="spinner"
  >
    <img
      alt="Loading..."
      :src="svgLoading"
    >
  </main>
  <main
    v-if="hasError && !isLoading"
    class="error column"
  >
    <img
      alt="Error Symbol"
      role="none"
      :src="svgAlertCircleOutline"
    >
    <span v-text="hasError" />
    <span v-text="file" />
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
  <OpenDialog
    v-if="showOpenDialog"
    @open="onOpenFile"
    @close="showOpenDialog = false"
  />
</template>

<style
  lang="scss"
  scoped
>
  .propdialog-container {
    height: 100%;
    border-left: var(--color-background-dark) solid 2px;

    @media (max-width: 475px) {
      border-left: unset;
    }
  }

  .error {
    color: var(--color-background-error);

    & > span {
      font-weight: 600;
      font-size: 1.2rem;
    }

    & > img {
      filter: var(--filter-background-error);
      height: 128px;
      width: 128px;
    }
  }

  .spinner > img {
    height: 64px;
    width: 64px;
  }
</style>
