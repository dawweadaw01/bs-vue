import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'index',
            component: () => import('@/views/Index.vue'),
            redirect(to) {
                return {path: '/index'}
            },
            children: [
                {
                    path: '/home',
                    name: 'home',
                    component: () => import('@/views/home/HomeView.vue'),
                    children: [
                        {
                            path: '/order',
                            name: 'order',
                            component: () => import('@/views/home/Order.vue'),
                            children: []
                        },
                        {
                            path: '/collection',
                            name: 'collection',
                            component: () => import('@/views/home/Collection.vue'),
                            children: []
                        },

                    ]
                },
                {
                    path: '/index',
                    name: 'index',
                    component: () => import('@/views/index/Index.vue'),
                    children: []
                },
                {
                    path: '/setting',
                    name: 'setting',
                    component: () => import('@/views/home/Setting.vue'),
                    children: []
                },
                {
                    path: '/catCategories',
                    name: 'catCategories',
                    component: () => import('@/views/cat/UserCatCategories.vue'),
                    children: []
                },
                {
                    path: '/shop',
                    name: 'shop',
                    component: () => import('@/views/shop/Shop.vue'),
                    children: []
                },
                {
                    path: '/shopDetails',
                    name: 'shopDetails',
                    component: () => import('@/views/shop/ShopDetails.vue'),
                    children: []
                },
                {
                    path: '/search',
                    name: 'search',
                    component: () => import('@/views/search/Search.vue'),
                    children: []
                },

            ]
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('@/views/AdminView.vue'),
            redirect(to) {
                return {path: '/admin/index'}
            },
            children: [
                {
                    path: 'index',
                    name: 'adminIndex',
                    component: () => import('@/views/admin/Index.vue')
                },
                {
                    path: 'user',
                    name: 'adminUser',
                    component: () => import('@/views/SysRolePermission/AdminUser.vue'),
                },
                {
                    path: 'role',
                    name: 'adminRole',
                    component: () => import('@/views/SysRolePermission/AdminRole.vue')
                },

                {
                    path: 'permission',
                    name: 'adminPermission',
                    component: () => import('@/views/SysRolePermission/AdminPermission.vue')
                },
                {
                    path: 'cat',
                    name: 'adminCat',
                    component: () => import('@/views/cat/CatCategories.vue')
                },
                {
                    path: 'shopCat',
                    name: 'shopCat',
                    component: () => import('@/views/shop/shopCat.vue')
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/login/Login.vue')
        }
    ]
})

export function resetRouter() {
    // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
    try {
        router.getRoutes().forEach((route) => {
            const {name, meta} = route
            if (name && meta.roles?.length) {
                router.hasRoute(name) && router.removeRoute(name)
            }
        })
    } catch {
        // 强制刷新浏览器也行，只是交互体验不是很好
        window.location.reload()
    }
}

export default router
