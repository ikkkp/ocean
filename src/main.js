import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import './plugins/vant.js'
import store from './store';
import axiosPlugin from '@/axios/axiosPlugin';
import {
  baseURL
} from '@/config.js'

Vue.use(axiosPlugin);

Vue.config.productionTip = false

new Vue({
  store,
  vuetify,
  router,
  render: h => h(App),
  data: function () {
    return {
      businessServer: baseURL + "/",
      devicesFlag: navigator.userAgent.indexOf("Html5Plus") > -1,
    }
  },
}).$mount('#app')