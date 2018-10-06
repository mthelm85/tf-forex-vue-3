import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

import Oanda from '@/plugins/oanda.js'
import Creds from '@/private/creds.js'

Vue.use(Oanda, {
  credentials: {
    'key': Creds.key,
    'acntId': Creds.acntId
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
