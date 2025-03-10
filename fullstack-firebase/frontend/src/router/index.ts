import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Home",
        component: () => import("../views/HomeView.vue"),
    },
    {
        path: "/algorithms",
        name: "Algorithms",
        component: () => import("../views/AlgorithmsView.vue"),
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: () => import("../views/DashboardView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/lesson",
        name: "Lesson",
        component: () => import("../views/LessonView.vue"),
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("../views/LoginView.vue"),
    },
    {
        path: "/math-topics",
        name: "MathTopics",
        component: () => import("../views/MathTopicsView.vue"),
    },
    {
        path: "/profile",
        name: "Profile",
        component: () => import("../views/ProfileView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/protected",
        name: "Protected",
        component: () => import("../views/ProtectedView.vue"),
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// ✅ Protect Routes with Firebase Auth
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                next({ name: "Login", query: { redirect: to.fullPath } });
            } else {
                next();
            }
        });
    } else {
        next();
    }
});

export default router;