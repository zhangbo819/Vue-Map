import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/world'
    // component: HomeView,
    // component: () => import(/* webpackChunkName: "china" */ '../views/China')
  },
  {
    path: '/world',
    name: 'world',
    component: () => import(/* webpackChunkName: "world" */ '../views/World')
  },
  {
    path: '/china',
    name: 'China',
    component: () => import(/* webpackChunkName: "china" */ '../views/China')
  },
  {
    path: '/province',
    name: 'province',
    component: () => import(/* webpackChunkName: "china" */ '../views/China/province.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  // base: process.env.BASE_URL,
  routes,
})

export default router
