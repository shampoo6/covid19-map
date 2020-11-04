import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/heatMap',
        component: () => import('../views/HeatMap.vue')
    },
    {
        path: '/countryMap',
        component: () => import('../views/CountryMap.vue')
    },
    {
        path: '/beeMap',
        component: () => import('../views/BeeMap.vue')
    },
    {
        path: '/worldMap',
        component: () => import('../views/WorldMap.vue')
    },
    {
        path: '/worldHeatMap',
        component: () => import('../views/WorldHeatMap.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router
