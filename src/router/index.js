import { createRouter, createWebHistory } from 'vue-router'
import Main from "@/Pages/Main.vue";
import Settings from "@/Pages/Settings.vue";
import ActiveModules from "@/Pages/ActiveModules.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Main
        },
        {
            path: '/settings',
            name: 'settings',
            component: Settings
        },
        {
            path: '/activemodules',
            name: 'activemodules',
            component: ActiveModules
        },
    ]
})

export default router
