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
  {
    path: '/principal',
    component: () => import('@desktop/layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'principal',
        component: () => import('@desktop/views/DashboardView.vue')
      },

      // ── Flujo Nueva Inspección ──────────────────────────────
      {
        path: 'seleccion-ambulancia',
        name: 'seleccion-ambulancia',
        component: () => import('@desktop/views/SeleccionAmbulanciaDesktop.vue')
      },
      {
        path: 'tipo-servicio',
        name: 'tipo-servicio',
        component: () => import('@desktop/views/TipoServicioDesktop.vue')
      },
      {
        path: 'nombre-responsable',
        name: 'nombre-responsable',
        component: () => import('@desktop/views/NombreResponsableDesktop.vue')
      }

      // // ── Resto (crear las vistas cuando toque) ──────────────
      // {
      //   path: 'reposicion',
      //   name: 'reposicion-desktop',
      //   component: () => import('@desktop/views/ReposicionDesktopView.vue')
      // },
      // {
      //   path: 'historial',
      //   name: 'historial-desktop',
      //   component: () => import('@desktop/views/HistorialDesktopView.vue')
      // }
    ]
  }
]

export default desktopRoutes
