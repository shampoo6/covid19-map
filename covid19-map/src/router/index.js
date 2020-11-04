import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: Home,
        children: [
            {
                path: '',
                redirect: '/dashboard'
            },
            {
                path: 'dashboard',
                component: () => import('../views/Dashboard/Index.vue')
            },
            {
                path: 'country',
                component: () => import('../views/CountryMap.vue')
            },
            {
                path: 'heat',
                component: () => import('../views/HeatMap.vue')
            },
            {
                path: 'bee',
                component: () => import('../views/BeeMap.vue')
            },
            {
                path: 'world',
                component: () => import('../views/WorldMap.vue')
            },
            {
                path: 'worldHeat',
                component: () => import('../views/WorldHeatMap.vue')
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

export default router
