import Vue from 'vue'
import App from './App.vue'
import store from './store/store'

Vue.config.productionTip = false
import  'leaflet/dist/leaflet.css'
new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
