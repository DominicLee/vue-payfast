import Vue from 'vue'
import App from './App.vue'
import store from './store'
import LoadScript from 'vue-plugin-load-script';
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify);
Vue.use(LoadScript);
Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount('#app');
