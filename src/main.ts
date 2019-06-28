import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/iview.js'

Vue.config.productionTip = false;

const app = new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')


app.$router.push('/')
