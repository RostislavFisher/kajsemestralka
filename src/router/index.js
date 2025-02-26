import { createRouter, createWebHistory } from 'vue-router'
import Main from "@/Pages/Main.vue";
import Settings from "@/Pages/Settings.vue";

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
    ]
})

export default router
