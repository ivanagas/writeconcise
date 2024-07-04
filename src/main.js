import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import App from './App.vue'
import posthogPlugin from '../plugins/posthog'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import mixpanel from 'mixpanel-browser';
 
mixpanel.init('31b097940e889b5d09a63961d808645c', {debug: true, track_pageview: true, persistence: 'localStorage'});

Vue.config.productionTip = false
Vue.use(BootstrapVue);
Vue.use(posthogPlugin);

new Vue({
  render: h => h(App),
}).$mount('#app')
