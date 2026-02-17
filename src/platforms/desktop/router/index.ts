const desktopRoutes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@desktop/views/LandingView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@mobile/views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@mobile/views/RegisterView.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@desktop/views/DashboardView.vue')
 }
]

export default desktopRoutes
