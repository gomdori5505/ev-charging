import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app'

Vue.use(VueRouter)

const rejectAuthUser = (to, from, next) => {
  if(firebase.auth().currentUser) {
    next({name: 'home'})
  } else {
    next()
  }
}

const onlyAuthUser = (to, from, next) => {
  if(firebase.auth().currentUser) {
    next()
  } else {
    next({name: 'login'})
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/login',
    name: 'login',
    beforeEnter: rejectAuthUser,
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    beforeEnter: rejectAuthUser,
    component: () => import(/* webpackChunkName: "signup" */ '../views/Signup.vue')
  },
  {
    path: '/mypage/:page',
    name: 'mypage',
    beforeEnter: onlyAuthUser,
    component: () => import(/* webpackChunkName: "mypage" */ '../views/Mypage.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
