<template>
  <div v-if="!loading && user" class="dashboard-page">
    <div class="dashboard-container">
      <div class="header">
        <h1 class="title">Bienvenido, {{ firstName }}</h1>
        <p class="subtitle">Panel de control de AmbuStock</p>
      </div>

      <div class="quick-actions">
        <button @click="navigateTo('/principal/revision')" class="action-card action-red">
          <div class="action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <h3 class="action-title">Nueva Revisión</h3>
          <p class="action-text">Iniciar revisión completa de ambulancia</p>
        </button>

        <button @click="navigateTo('/principal/reposicion')" class="action-card action-gray">
          <div class="action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <h3 class="action-title">Reposición</h3>
          <p class="action-text">Gestionar material gastado y pedidos</p>
        </button>

        <button @click="navigateTo('/principal/history')" class="action-card action-green">
          <div class="action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v5h5"/>
              <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/>
            </svg>
          </div>
          <h3 class="action-title">Historial</h3>
          <p class="action-text">Ver inspecciones y reportes anteriores</p>
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="stat-icon green">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span class="stat-badge green">Este mes</span>
          </div>
          <div class="stat-value">{{ totalInspecciones }}</div>
          <div class="stat-label">Inspecciones este mes</div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="stat-icon green">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span class="stat-badge green">{{ porcentajeAprobadas }}%</span>
          </div>
          <div class="stat-value">{{ inspeccionesAprobadas }}</div>
          <div class="stat-label">Aprobadas</div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="stat-icon red">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span class="stat-badge red">Atención</span>
          </div>
          <div class="stat-value">{{ alertasPendientes }}</div>
          <div class="stat-label">Alertas pendientes</div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="stat-icon gray">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-value">{{ tiempoPromedio }}</div>
          <div class="stat-label">Tiempo promedio</div>
        </div>
      </div>

      <div class="content-grid">
        <div class="content-card">
          <h2 class="content-title">Actividad Reciente</h2>
          <div v-if="activities.length > 0" class="activity-list">
            <div v-for="activity in activities" :key="activity.id" class="activity-item">
              <div class="activity-info">
                <div class="activity-badge" :style="{ backgroundColor: activity.color + '1a' }">
                  <span :style="{ color: activity.color }">{{ activity.id.split('-')[1] }}</span>
                </div>
                <div>
                  <p class="activity-id">{{ activity.nombreAmbulancia }}</p>
                  <p class="activity-time">{{ activity.time }}</p>
                </div>
              </div>
              <div class="activity-status" :style="{ backgroundColor: activity.color + '1a', color: activity.color }">
                {{ activity.status }}
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No hay actividad reciente</p>
          </div>
        </div>

        <div class="content-card">
          <h2 class="content-title">Mi Perfil</h2>
          <div class="profile-content">
            <div class="profile-header">
              <div class="profile-avatar">
                <span>{{ initials }}</span>
              </div>
              <div>
                <h3 class="profile-name">{{ user.nombreResponsable || user.nombre }}</h3>
                <p class="profile-role">{{ user.rol }}</p>
              </div>
            </div>

            <div class="profile-details">
              <div class="profile-detail">
                <p class="detail-label">Correo Electrónico</p>
                <p class="detail-value">{{ user.email }}</p>
              </div>

              <div class="profile-detail">
                <p class="detail-label">Rol</p>
                <p class="detail-value">{{ user.rol }}</p>
              </div>

              <div class="profile-detail no-border">
                <p class="detail-label">ID Usuario</p>
                <p class="detail-value">#{{ user.usuarioId }}</p>
              </div>
            </div>

            <button class="edit-profile-btn">Editar Perfil</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getUsuario,
  getHistorialRevisiones,
  obtenerEstadoRevision,
  type Usuario,
  type Revision
} from '@/core/services/api'

interface Activity {
  id: string
  nombreAmbulancia: string
  status: string
  time: string
  color: string
  clase: string
}

const router = useRouter()
const user = ref<Usuario | null>(null)
const activities = ref<Activity[]>([])
const loading = ref(true)
const statsLoading = ref(true)

const totalInspecciones = ref(0)
const inspeccionesAprobadas = ref(0)
const alertasPendientes = ref(0)
const tiempoPromedio = ref('18min')

const firstName = computed(() => {
  if (!user.value) return ''
  const nombre = user.value.nombreResponsable || user.value.nombre || ''
  return nombre.split(' ')[0]
})

const initials = computed(() => {
  if (!user.value) return ''
  const nombre = user.value.nombreResponsable || user.value.nombre || ''
  return nombre.split(' ').map(n => n[0]).join('').toUpperCase()
})

const porcentajeAprobadas = computed(() => {
  if (totalInspecciones.value === 0) return 0
  return Math.round((inspeccionesAprobadas.value / totalInspecciones.value) * 100)
})

const navigateTo = (path: string) => {
  router.push(path)
}

const getColorFromEstado = (clase: string): string => {
  const colores: Record<string, string> = {
    'completada': '#71b48d',
    'pendiente': '#f59e0b',
    'urgente': '#891d1a',
    'sin-realizar': '#5e657b'
  }
  return colores[clase] || '#5e657b'
}

const calcularTiempoTranscurrido = (fechaISO: string): string => {
  const fecha = new Date(fechaISO)
  const ahora = new Date()
  const diff = ahora.getTime() - fecha.getTime()

  const minutos = Math.floor(diff / 60000)
  const horas = Math.floor(minutos / 60)
  const dias = Math.floor(horas / 24)

  if (dias > 0) return `Hace ${dias} día${dias > 1 ? 's' : ''}`
  if (horas > 0) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`
  if (minutos > 0) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`
  return 'Hace un momento'
}

const cargarActividades = async () => {
  try {
    const revisiones = await getHistorialRevisiones()
    const ultimasRevisiones = revisiones.slice(0, 5)

    activities.value = ultimasRevisiones.map((revision: Revision) => {
      const estado = obtenerEstadoRevision(revision)
      return {
        id: `AMB-${String(revision.idRevision).padStart(3, '0')}`,
        nombreAmbulancia: revision.nombreAmbulancia || revision.matricula,
        status: estado.texto,
        time: calcularTiempoTranscurrido(revision.fechaRevision),
        color: getColorFromEstado(estado.clase),
        clase: estado.clase
      }
    })
  } catch (error) {
    console.error('Error cargando actividades:', error)
    activities.value = []
  }
}

const cargarEstadisticas = async () => {
  try {
    statsLoading.value = true
    const revisiones = await getHistorialRevisiones()

    const ahora = new Date()
    const mesActual = ahora.getMonth()
    const añoActual = ahora.getFullYear()

    const revisionesMes = revisiones.filter((r: Revision) => {
      const fecha = new Date(r.fechaRevision)
      return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual
    })

    totalInspecciones.value = revisionesMes.length

    inspeccionesAprobadas.value = revisionesMes.filter((r: Revision) => {
      const estado = obtenerEstadoRevision(r)
      return estado.clase === 'completada'
    }).length

    alertasPendientes.value = revisionesMes.filter((r: Revision) => {
      const estado = obtenerEstadoRevision(r)
      return estado.clase === 'urgente' || estado.clase === 'pendiente'
    }).length

  } catch (error) {
    console.error('Error cargando estadísticas:', error)
  } finally {
    statsLoading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  user.value = getUsuario()

  await Promise.all([
    cargarActividades(),
    cargarEstadisticas()
  ])

  loading.value = false
})
</script>

<style scoped lang="scss">
.dashboard-page {
  padding: 3rem;
  min-height: 100vh;
  background: #f8f9fa;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  margin-bottom: 3rem;
}

.title {
  font-family: 'Bebas Neue', sans-serif;
  color: #210706;
  font-size: 56px;
  line-height: 1;
  margin-bottom: 0.75rem;
}

.subtitle {
  font-size: 20px;
  color: #210706cc;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.action-card {
  border-radius: 20px;
  padding: 2rem;
  color: white;
  text-align: left;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    transform: scale(1.02);
  }

  &.action-red {
    background: linear-gradient(135deg, #891d1a, #6b1515);
  }

  &.action-gray {
    background: linear-gradient(135deg, #5e657b, #4a5061);
  }

  &.action-green {
    background: linear-gradient(135deg, #71b48d, #5a9371);
  }
}

.action-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;

  svg {
    width: 32px;
    height: 32px;
    color: white;
  }
}

.action-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 32px;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.action-text {
  font-size: 15px;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #00050033;
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.stat-icon {
  width: 32px;
  height: 32px;

  &.green { color: #71b48d; }
  &.red   { color: #891d1a; }
  &.gray  { color: #5e657b; }
}

.stat-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;

  &.green {
    color: #71b48d;
    background: #71b48d0d;
  }

  &.red {
    color: #891d1a;
    background: #891d1a0d;
  }
}

.stat-value {
  font-family: 'Bebas Neue', sans-serif;
  color: #210706;
  font-size: 42px;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 14px;
  color: #210706;
  opacity: 0.6;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.content-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid #00050033;
}

.content-title {
  font-family: 'Bebas Neue', sans-serif;
  color: #210706;
  font-size: 32px;
  line-height: 1;
  margin-bottom: 1.5rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #00050033;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
}

.activity-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.activity-badge {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 16px;
  }
}

.activity-id {
  font-size: 15px;
  font-weight: 600;
  color: #210706;
}

.activity-time {
  font-size: 13px;
  color: #210706;
  opacity: 0.6;
}

.activity-status {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.empty-state {
  padding: 3rem 1rem;
  text-align: center;
  color: #210706;
  opacity: 0.5;
  font-size: 15px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  background: #891d1a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-family: 'Bebas Neue', sans-serif;
    color: white;
    font-size: 32px;
  }
}

.profile-name {
  font-size: 20px;
  font-weight: 600;
  color: #210706;
  margin-bottom: 0.25rem;
}

.profile-role {
  font-size: 14px;
  color: #210706;
  opacity: 0.6;
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-detail {
  padding-bottom: 1rem;
  border-bottom: 1px solid #00050033;

  &.no-border {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.detail-label {
  font-size: 13px;
  color: #210706;
  opacity: 0.6;
  margin-bottom: 0.25rem;
}

.detail-value {
  font-size: 15px;
  color: #210706;
  font-weight: 500;
}

.edit-profile-btn {
  width: 100%;
  padding: 0.75rem;
  background: #891d1a0d;
  color: #891d1a;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.5rem;

  &:hover {
    background: #891d1a;
    color: white;
  }
}
</style>
