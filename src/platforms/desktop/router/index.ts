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
  }
]

export default desktopRoutes
