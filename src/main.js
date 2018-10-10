import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'

import Oanda from '@/plugins/oanda.js'
import Creds from '@/private/creds.js'
import Model from '@/plugins/tf.js'

Vue.use(Oanda, {
  credentials: {
    key: Creds.key,
    acntId: Creds.acntId
  }
})

Vue.use(Model, {
  modelSettings: {
    learningRate: 0.1,
    numInputs: 15,
    numOutputs: 1,
    numNeurons: 256,
    batchSize: 32,
    epochs: 75
  }
})

Vue.use(VueChartkick, { adapter: Chart })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
