import { createRouter, createWebHistory } from "vue-router"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import Dashboard from "../views/Dashboard.vue"
import MapView from "../views/MapView.vue"

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/map",
    name: "MapView",
    component: MapView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register"]
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem("user")

  if (authRequired && !loggedIn) {
    next("/login")
  } else {
    next()
  }
})

export default router
