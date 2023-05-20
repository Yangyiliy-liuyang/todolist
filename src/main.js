import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

import { library } from '@fortawesome/fontawesome-svg-core'
import { faEllipsisV, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faEllipsisV, faEdit, faTimes)

Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
