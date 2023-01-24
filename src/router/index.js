import {createRouter, createWebHashHistory} from 'vue-router'
import {base, routes, routesNames} from '@/config'
import * as pages from '@/components/pages'

export default createRouter({
  history: createWebHashHistory(base),
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
