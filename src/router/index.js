import { createWebHistory, createRouter } from 'vue-router'
import { routes, base, routesNames } from '@/config'
import * as pages from '@/components/pages'

export default createRouter({
  history: createWebHistory(base),
  routes: [
    {
      name: routesNames.room,
      path: routes.room,
      component: pages.room,
    },
    {
      name: routesNames.home,
      path: routes.home,
      component: pages.home,
    },
  ],
})
