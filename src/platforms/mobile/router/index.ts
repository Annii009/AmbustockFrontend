const BREAKPOINT = 768
const isDesktop = (): boolean => window.innerWidth > BREAKPOINT

function adaptive(
    mobileFn: () => Promise<unknown>,
    desktopFn: () => Promise<unknown>
) {
    return () => (isDesktop() ? desktopFn() : mobileFn())
}

const routes = [

    // ── Públicas ─────────────────────────────────────────────────────────────
    {
        path: '/',
        name: 'welcome',
        component: adaptive(
            () => import('@mobile/views/WelcomeView.vue'),
            () => import('@desktop/views/LandingView.vue')
        )
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

    // ── Área privada ──────────────────────────────────────────────────────────
    {
        path: '/principal',
        component: adaptive(
            () => import('@mobile/layouts/MobilePassThrough.vue'),  // ← corregido
            () => import('@desktop/layouts/DashboardLayout.vue')
        ),
        children: [

            {
                path: '',
                name: 'principal',
                meta: { requiresAuth: true },
                component: adaptive(
                    () => import('@mobile/views/PrincipalView.vue'),
                    () => import('@desktop/views/DashboardView.vue')
                )
            },

            // ── Flujo Nueva Inspección ────────────────────────────────────────────
            {
                path: 'seleccion-ambulancia',
                name: 'seleccion-ambulancia',
                meta: { requiresAuth: true },
                component: adaptive(
                    () => import('@mobile/views/SeleccionAmbulanciaView.vue'),
                    () => import('@desktop/views/SeleccionAmbulanciaDesktop.vue')
                )
            },
            {
                path: 'tipo-servicio',
                name: 'tipo-servicio',
                meta: { requiresAuth: true },
                component: adaptive(
                    () => import('@mobile/views/TipoServicioView.vue'),
                    () => import('@desktop/views/TipoServicioDesktop.vue')
                )
            },
            {
                path: 'nombre-responsable',
                name: 'nombre-responsable',
                meta: { requiresAuth: true },
                component: adaptive(
                    () => import('@mobile/views/NombreResponsableView.vue'),
                    () => import('@desktop/views/NombreResponsableDesktop.vue')
                )
            },
            {
                path: 'revision',
                name: 'revision',
                meta: { requiresAuth: true },
                component: adaptive(
                    () => import('@mobile/views/RevisionView.vue'),
                    () => import('@desktop/views/RevisionDesktop.vue')
                )
            },
            {
                path: 'materiales-faltantes',
                name: 'materiales-faltantes',
                meta: { requiresAuth: true },
                component: adaptive(
                    () => import('@mobile/views/MaterialesFaltantesView.vue'),
                    () => import('@desktop/views/MaterialesFaltantesDesktop.vue')
                )
            },
            {
                path: 'mision-cumplida',
                name: 'mision-cumplida',
                meta: { requiresAuth: true },
                component: adaptive(
                    () => import('@mobile/views/MisionCumplidaView.vue'),
                    () => import('@desktop/views/MisionCumplidaDesktop.vue')
                )
            },

            // ── Material / Reposición ─────────────────────────────────────────────
            {
                path: 'material-gastado',
                name: 'material-gastado',
                meta: { requiresAuth: true },
                component: adaptive(
                    () => import('@mobile/views/MaterialGastadoView.vue'),
                    () => import('@desktop/views/MaterialGastadoDesktop.vue')
                )
            },
            {
                path: 'sugerencias',
                name: 'sugerencias',
                meta: { requiresAuth: true },
                component: adaptive(
                    () => import('@mobile/views/SugerenciasView.vue'),
                    () => import('@desktop/views/SugerenciasDesktop.vue')
                )
            },
            {
                path: 'todo-listo',
                name: 'todo-listo',
                meta: { requiresAuth: true },
                component: adaptive(
                    () => import('@mobile/views/TodoListoView.vue'),
                    () => import('@desktop/views/TodoListoDesktop.vue')
                )
            },
            {
                path: 'reposicion',
                name: 'reposicion',
                meta: { requiresAuth: true },
                component: adaptive(
                    () => import('@mobile/views/MaterialGastadoView.vue'),
                    () => import('@desktop/views/ReposicionDesktop.vue')
                )
            },

            // ── Historial ─────────────────────────────────────────────────────────
            {
                path: 'historial',
                name: 'historial-reposiciones',
                meta: { requiresAuth: true },
                component: adaptive(
                    () => import('@mobile/views/HistorialReposicionesView.vue'),
                    () => import('@desktop/views/HistorialDesktop.vue')
                )
            },
            {
                path: 'ver-revisiones',
                name: 'ver-revisiones',
                meta: { requiresAuth: true },
                component: adaptive(
                    () => import('@mobile/views/HistorialRevisionesView.vue'),      // ← corregido
                    () => import('@desktop/views/HistorialRevisionesDesktop.vue')   // ← corregido
                )
            },

            // ── Perfil ────────────────────────────────────────────────────────────
            {
                path: 'perfil',
                name: 'perfil',
                meta: { requiresAuth: true },
                component: adaptive(
                    () => import('@mobile/views/PerfilView.vue'),
                    () => import('@desktop/views/PerfilDesktop.vue')
                )
            },
            {
                path: 'editar-perfil',
                name: 'editar-perfil',
                meta: { requiresAuth: true },
                component: adaptive(
                    () => import('@mobile/views/EditarPerfilView.vue'),
                    () => import('@desktop/views/EditarPerfilDesktop.vue')
                )
            },


            // ── Admin only ────────────────────────────────────────────────────────
            {
                path: 'perfil-admin',
                name: 'perfil-admin',
                meta: { requiresAuth: true, requiresAdmin: true },
                component: adaptive(
                    () => import('@mobile/views/PerfilAdminView.vue'),
                    () => import('@desktop/views/PerfilAdminDesktop.vue')
                )
            },
            {
                path: 'responsables',
                name: 'lista-responsables',
                meta: { requiresAuth: true, requiresAdmin: true },
                component: adaptive(
                    () => import('@mobile/views/ListaResponsablesView.vue'),
                    () => import('@desktop/views/ResponsablesDesktop.vue')
                )
            },
            {
                path: 'ambulancias',
                name: 'ambulancias',
                meta: { requiresAuth: true, requiresAdmin: true },
                component: adaptive(
                    () => import('@mobile/views/AmbulanciasView.vue'),
                    () => import('@desktop/views/AmbulanciasDesktop.vue')
                )
            },
            {
                path: 'ambulancia-editor/:id?',
                name: 'ambulancia-editor',
                meta: { requiresAuth: true, requiresAdmin: true },
                component: adaptive(
                    () => import('@mobile/views/AmbulanciaEditorView.vue'),
                    () => import('@desktop/views/AmbulanciasDesktop.vue')  // desktop ya lo gestiona todo en uno
                )
            },
        ]
    },

    // ── Redirects legacy ──────────────────────────────────────────────────────
    { path: '/seleccion-ambulancia', redirect: '/principal/seleccion-ambulancia' },
    { path: '/tipo-servicio', redirect: '/principal/tipo-servicio' },
    { path: '/nombre-responsable', redirect: '/principal/nombre-responsable' },
    { path: '/revision', redirect: '/principal/revision' },
    { path: '/materiales-faltantes', redirect: '/principal/materiales-faltantes' },
    { path: '/mision-cumplida', redirect: '/principal/mision-cumplida' },
    { path: '/material-gastado', redirect: '/principal/material-gastado' },
    { path: '/sugerencias', redirect: '/principal/sugerencias' },
    { path: '/todo-listo', redirect: '/principal/todo-listo' },
    { path: '/perfil', redirect: '/principal/perfil' },
    { path: '/editar-perfil', redirect: '/principal/editar-perfil' },
    { path: '/perfil-admin', redirect: '/principal/perfil-admin' },
    { path: '/lista-responsables', redirect: '/principal/responsables' },
    { path: '/historial-reposiciones', redirect: '/principal/historial' },
    { path: '/ver-revisiones', redirect: '/principal/ver-revisiones' },
    {
        path: '/detalle-reposicion/:id',
        redirect: (to: any) => `/principal/detalle-reposicion/${to.params.id}`
    },

    // ── 404 ───────────────────────────────────────────────────────────────────
    { path: '/:pathMatch(.*)*', redirect: '/' }
]

export default routes
