<script>
  export default {
    name: "TabBar",
    props: {
      currentTab: {
        type: String,
        default: "request",
      },
      asDialog: {
        type: Boolean,
        default: false,
      },
      hasPostData: {
        type: Boolean,
        default: false,
      },
      hasResponseContent: {
        type: Boolean,
        default: false,
      },
      hasCookies: {
        type: Boolean,
        default: false,
      },
      hasTimings: {
        type: Boolean,
        default: false,
      },
    },
    emits: ["change"],
    setup(_, { emit }) {
      const onChange = tab => emit("change", tab);

      return {
        onChange,
      };
    },
  };
</script>

<template>
  <nav
    v-if="asDialog"
    class="tabbar"
  >
    <select
      :value="currentTab"
      @change="e => onChange(e.target.value)"
    >
      <option value="request">
        Request
      </option>
      <option
        v-if="hasPostData"
        value="post-data"
      >
        Post Data
      </option>
      <option value="response">
        Response
      </option>
      <option
        v-if="hasResponseContent"
        value="response-content"
      >
        Response Content
      </option>
      <option
        v-if="hasCookies"
        value="cookies"
      >
        Cookies
      </option>
      <option
        v-if="hasTimings"
        value="timing"
      >
        Timing
      </option>
    </select>
  </nav>
  <nav
    v-else
    class="tabbar"
    role="tablist"
  >
    <button
      :class="{ active: currentTab === 'request' }"
      class="btn btn-dark"
      type="button"
      role="tab"
      @click="onChange('request')"
    >
      Request
    </button>
    <button
      v-if="hasPostData"
      :class="{ active: currentTab === 'post-data' }"
      class="btn btn-dark"
      type="button"
      role="tab"
      @click="onChange('post-data')"
    >
      Post Data
    </button>
    <button
      :class="{ active: currentTab === 'response' }"
      class="btn btn-dark"
      type="button"
      role="tab"
      @click="onChange('response')"
    >
      Response
    </button>
    <button
      v-if="hasResponseContent"
      :class="{ active: currentTab === 'response-content' }"
      class="btn btn-dark"
      type="button"
      role="tab"
      @click="onChange('response-content')"
    >
      Response Content
    </button>
    <button
      v-if="hasCookies"
      :class="{ active: currentTab === 'cookies' }"
      class="btn btn-dark"
      type="button"
      role="tab"
      @click="onChange('cookies')"
    >
      Cookies
    </button>
    <button
      v-if="hasTimings"
      :class="{ active: currentTab === 'timing' }"
      class="btn btn-dark"
      type="button"
      role="tab"
      @click="onChange('timing')"
    >
      Timings
    </button>
  </nav>
</template>

<style
  lang="scss"
  scoped
>
  .tabbar {
    display: flex;

    & button:not(:last-of-type) {
      margin-right: .35rem;
    }

    & .btn.active {
      background-color: var(--color-active);
      color: #f8f9fa;

      &:hover {
        background-color: var(--color-active);
      }
    }
  }
</style>
