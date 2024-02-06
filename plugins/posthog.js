import posthog from "posthog-js";

export default {
  install(Vue) {
    if (!window.location.href.includes('localhost:8080')) {
      Vue.prototype.$posthog = posthog.init(
        'phc_BSvL6de4HPva0n9vVCSHQQyPpusblaA3JGpn45wy9h9',
        {
          api_host: "https://app.posthog.com"
        }
      );
    }
  }
};
