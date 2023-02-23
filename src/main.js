import Vue from 'vue'
import App from './App'
import $api from './request/api/api.js'
import $utils from './utils/utils.js'
Vue.config.productionTip = false

Vue.prototype.$api = $api
Vue.prototype.$utils = $utils
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
