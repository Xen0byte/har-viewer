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
      <option value="response">
        Response
      </option>
      <option value="response-content">
        Response Content
      </option>
      <option value="cookies">
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
      :class="{ active: currentTab === 'response' }"
      class="btn"
      type="button"
      @click="onChange('response')"
    >
      Response
    </button>
    <button
      :class="{ active: currentTab === 'response-content' }"
      class="btn"
      type="button"
      @click="onChange('response-content')"
    >
      Response Content
    </button>
    <button
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
      margin-right: .5rem;
    }

    & .nav-select {
      padding: .5rem;
      background-color: var(--color-background-2);
      border-color: var(--color-background-2);
      color: var(--color-text);
      width: 100%;
      outline: none;
      appearance: none;
    }

    & .btn {
      background-color: #0359a2;
      border: none;
      color: #ffffff;
      padding: .375rem .75rem;
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
        background-color: #4da4f0;
      }

      &:hover {
        background-color: #4da4f0;
      }
    }
  }
</style>
