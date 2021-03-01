<script>
  import { ref, computed } from "vue";

  import RequestTab from "./RequestTab";
  import ResponseContentTab from "./ResponseContentTab";
  import ResponseTab from "./ResponseTab";
  import TimingTab from "./TimingTab";

  export default {
    components: {
      ResponseContentTab,
      TimingTab,
      ResponseTab,
      RequestTab,
    },
    props: {
      entry: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const selectedTab = ref("request");
      const filename = computed(() => {
        const fn = props.entry.request.url
          .substring(props.entry.request.url.lastIndexOf("/") + 1);

        if (/^.*\?.*$/.test(fn)) {
          const n = fn.split("?")[0];
          let ext = props.entry.response.content.mimeType.split("/")[1];

          if (ext === "javascript") {
            ext = "js";
          } else if (ext === "plain") {
            ext = "txt";
          }

          return `${n}.${ext}`;
        }

        return fn;
      });

      return {
        selectedTab,
        filename,
      };
    },
  };
</script>

<template>
  <div class="column details">
    <div class="row tab-bar is-unselectable">
      <span
        :class="{ active: selectedTab === 'request' }"
        @click="selectedTab = 'request'"
      >
        Request
      </span>
      <span
        :class="{ active: selectedTab === 'response' }"
        @click="selectedTab = 'response'"
      >
        Response
      </span>
      <span
        v-if="entry.response.content.size"
        :class="{ active: selectedTab === 'response-content' }"
        @click="selectedTab = 'response-content'"
      >
        Response Content
      </span>
      <span
        :class="{ active: selectedTab === 'timing' }"
        @click="selectedTab = 'timing'"
      >
        Timing
      </span>
    </div>
    <RequestTab
      v-if="selectedTab === 'request'"
      :request="entry.request"
      :remote-address="entry.serverIPAddress"
      :timestamp="entry.startedDateTime"
    />
    <ResponseTab
      v-if="selectedTab === 'response'"
      :response="entry.response"
    />
    <ResponseContentTab
      v-if="entry.response.content.size && selectedTab === 'response-content'"
      :response="entry.response"
      :filename="filename"
    />
    <TimingTab
      v-if="selectedTab === 'timing'"
      :timings="entry.timings"
    />
  </div>
</template>

<style
  lang="scss"
  scoped
>
  .details {
    padding-left: .75em;
    padding-right: .75em;
  }

  .tab-bar {
    margin-bottom: 1em;

    span {
      background-color: var(--color-primary-500);
      color: #fff;
      border-radius: 5px;
      cursor: pointer;
      padding: .4em .8em;

      &:hover, &.active {
        background-color: var(--color-primary-600);
      }
    }

    span:not(:last-of-type) {
      margin-right: .75em;
    }
  }

  .redacted {
    color: var(--color-text);
  }
</style>
