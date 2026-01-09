import posthog from "posthog-js";

export default {
  install(Vue) {
    posthog.init(
      'phc_BSvL6de4HPva0n9vVCSHQQyPpusblaA3JGpn45wy9h9',
      {
        api_host: "https://app.posthog.com"
      }
    );
    Vue.prototype.$posthog = posthog;
  }
};
