import posthog from "posthog-js";

export default {
  install(app) {
    posthog.init(
      'phc_BSvL6de4HPva0n9vVCSHQQyPpusblaA3JGpn45wy9h9',
      {
        api_host: "https://app.posthog.com"
      }
    );
    app.config.globalProperties.$posthog = posthog;
  }
};
