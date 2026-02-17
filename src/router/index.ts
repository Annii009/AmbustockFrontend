import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@core/services/api'
import mobileRoutes from '@mobile/router'
import desktopRoutes from '@desktop/router'

// Detectar plataforma
const isMobile = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobileDevice = /android|iphone|ipad|ipod|mobile/.test(userAgent)
  const isSmallScreen = window.innerWidth < 1024
  
  return isMobileDevice || isSmallScreen
}

const routes = isMobile() ? mobileRoutes : desktopRoutes

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})

export default router
