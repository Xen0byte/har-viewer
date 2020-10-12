<script>
  import { ref } from "vue";

  export default {
    setup() {
      const uploadRef = ref(null);
      const harContent = ref(null);

      const onUpload = () => {
        uploadRef.value.click();
      };

      const onUploadRef = async e => {
        const input = e.target;

        if (!("files" in input && input.files.length > 0)) {
          return;
        }

        const readFile = () => new Promise(((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = event => resolve(event.target.result);
          reader.onerror = error => reject(error);
          reader.readAsText(input.files[0]);
        }));

        const content = await readFile();
        harContent.value = JSON.parse(content);
      };

      return {
        uploadRef,
        onUpload,
        onUploadRef,
        harContent,
      };
    },
  };
</script>

<template>
  <div class="is-flex wrapper">
    <header>
      <nav
        class="navbar is-unselectable is-dark"
        role="navigation"
        aria-label="main navigation"
      >
        <div class="navbar-brand">
          <span class="navbar-item">
            HAR Viewer
          </span>
        </div>
        <div class="navbar-menu">
          <div class="navbar-end">
            <div class="navbar-item">
              <div class="field is-grouped">
                <p class="control">
                  <input
                    ref="uploadRef"
                    type="file"
                    hidden
                    @change="onUploadRef"
                  >
                  <button
                    class="button is-link"
                    type="button"
                    @click="onUpload"
                  >
                    <span class="icon">
                      <i class="mdi mdi-file-upload" />
                    </span>
                    <span>Load HAR File</span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
    <main class="has-background-grey-dark has-text-light">
      {{ harContent }}
    </main>
    <footer class="footer is-unselectable has-background-dark has-text-light">
      <div class="content has-text-centered">
        <p>
          <strong class="has-text-light">HAR Viewer</strong> by
          <a
            target="_blank"
            href="https://github.com/develerik"
          >
            Erik Bender
          </a>.
          The source code is licensed
          <a
            target="_blank"
            href="https://opensource.org/licenses/ISC"
          >
            ISC
          </a>.
        </p>
      </div>
    </footer>
  </div>
</template>

<style
  lang="scss"
  scoped
>
  .wrapper {
    flex-direction: column;
    height: 100vh;

    & main {
      flex-grow: 1;
      overflow: auto;
    }
  }

  .footer {
    padding: 1rem 1.5rem 1rem;
  }
</style>
