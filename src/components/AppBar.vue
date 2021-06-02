<script>
  export default {
    name: "AppBar",
    emits: ["action"],
    setup(_, { emit }) {
      // do nothing
    },
  };
</script>

<template>
  <header class="appbar">
    <h1 class="brand brand-long">
      HTTP Archive Viewer
    </h1>
    <h1 class="brand brand-short">
      HAR Viewer
    </h1>
  </header>
</template>

<style
  lang="scss"
  scoped
>
  .appbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    background: #0359a2;
    padding: .5rem .75rem;
  }

  .brand {
    color: white;
    font-size: 1.25rem;
    font-weight: 400;
    line-height: 1.5;
    user-select: none;
  }

  .brand-short {
    display: none;
  }

  @media (max-width: 415px) {
    .brand-short {
      display: unset;
    }
    .brand-long {
      display: none;
    }
  }
</style>
