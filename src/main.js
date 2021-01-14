import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from "axios"
import "@/fontAwesomeIcon";
import './plugins/firebase'
import firebase from 'firebase/app'

Vue.config.productionTip = false

Vue.prototype.$axios = axios

let app;
firebase.auth().onAuthStateChanged(user => {
  if(!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})