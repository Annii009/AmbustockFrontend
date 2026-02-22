const desktopRoutes = [
  {
    path: '/',
    name: 'Welcome',
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
  // En tu archivo de rutas desktop
{
  path: '/principal',
  component: () => import('@desktop/layouts/DashboardLayout.vue'),
  children: [
    {
      path: '',
      name: 'principal',
      component: () => import('@desktop/views/DashboardView.vue')
    },
    {
      path: 'revision',
      name: 'revision-desktop',
      component: () => import('@desktop/views/RevisionDesktopView.vue')
    }
  ]
}
]

export default desktopRoutes
