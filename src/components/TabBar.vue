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
      class="nav-select"
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
      <option value="timing">
        Timing
      </option>
    </select>
  </nav>
  <nav
    v-else
    class="tabbar"
  >
    <button
      :class="{ active: currentTab === 'request' }"
      class="btn"
      type="button"
      @click="onChange('request')"
    >
      Request
    </button>
    <button
      v-if="hasPostData"
      :class="{ active: currentTab === 'post-data' }"
      class="btn"
      type="button"
      @click="onChange('post-data')"
    >
      Post Data
    </button>
    <button
      :class="{ active: currentTab === 'response' }"
      class="btn"
      type="button"
      @click="onChange('response')"
    >
      Response
    </button>
    <button
      v-if="hasResponseContent"
      :class="{ active: currentTab === 'response-content' }"
      class="btn"
      type="button"
      @click="onChange('response-content')"
    >
      Response Content
    </button>
    <button
      v-if="hasCookies"
      :class="{ active: currentTab === 'cookies' }"
      class="btn"
      type="button"
      @click="onChange('cookies')"
    >
      Cookies
    </button>
    <button
      :class="{ active: currentTab === 'timing' }"
      class="btn"
      type="button"
      @click="onChange('timing')"
    >
      Timing
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

    & .nav-select {
      padding: .5rem;
      background-color: var(--color-background-dark);
      border-color: var(--color-background-dark);
      color: var(--color-text);
      width: 100%;
      outline: none;
      appearance: none;
    }

    & .btn {
      background-color: var(--color-background-dark);
      border: none;
      color: #f8f9fa;
      padding: .375rem .5rem;
      cursor: pointer;
      font-size: 1rem;
      line-height: 1.5;
      font-weight: 400;
      border-radius: .25rem;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: center;

      transition: background-color .15s ease-in-out;

      &.active {
        background-color: var(--color-active);
        color: #f8f9fa;
      }

      &:hover {
        background-color: var(--color-primary-light);
      }
    }
  }
</style>
