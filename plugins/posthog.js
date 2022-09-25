import posthog from "posthog-js";

export default {
  install(Vue) {
		if (!window.location.href.includes('localhost:8080')) {
			Vue.prototype.$posthog = posthog.init(
				'phc_QlwgYexW2lCA7CGMbqLoaP9kcFogYgUo4WEC0gWLbyt',
				{
					api_host: "https://app.posthog.com"
				}
			);
		}
  }
};
