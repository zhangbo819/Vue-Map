import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    redirect: "/world",
    // component: HomeView,
    // component: () => import(/* webpackChunkName: "china" */ '../views/China')
  },
  {
    path: "/world",
    name: "world",
    component: () => import("@/views/World/index.vue"),
  },
  {
    path: "/china",
    name: "China",
    component: () => import("@/views/China/index.vue"),
  },
  {
    path: "/province",
    name: "province",
    component: () => import("@/views/China/province.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
