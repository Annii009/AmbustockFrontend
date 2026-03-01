<template>
  <div v-if="!loading && user" class="dash">
    <div class="dash__inner">

      <p class="dash__subtitle">Panel de control de AmbuStock</p>

      <!-- Acciones rápidas -->
      <div class="dash__actions">
        <button @click="go('/principal/seleccion-ambulancia')" class="action action--red">
          <div class="action__icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h3 class="action__title">NUEVA REVISIÓN</h3>
          <p class="action__text">Iniciar revisión completa de ambulancia</p>
        </button>
        <button @click="go('/principal/reposicion')" class="action action--blue">
          <div class="action__icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <path
                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h3 class="action__title">MATERIAL GASTADO</h3>
          <p class="action__text">Gestionar material gastado y pedidos</p>
        </button>
        <button @click="go('/principal/historial')" class="action action--green">
          <div class="action__icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <path d="M3 3v5h5" />
              <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
            </svg>
          </div>
          <h3 class="action__title">HISTORIAL</h3>
          <p class="action__text">Ver reposiciones y reportes anteriores</p>
        </button>
      </div>

      <!-- Stats -->
      <div class="dash__stats">
        <div class="stat">
          <div class="stat__top">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" class="stat__icon stat__icon--green">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span class="stat__badge stat__badge--green">Este mes</span>
          </div>
          <div class="stat__value">{{ totalRevisiones }}</div>
          <div class="stat__label">Revisiones este mes</div>
        </div>
        <div class="stat">
          <div class="stat__top">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" class="stat__icon stat__icon--green">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span class="stat__badge stat__badge--green">{{ porcentajeAprobadas }}%</span>
          </div>
          <div class="stat__value">{{ revisionesAprobadas }}</div>
          <div class="stat__label">Completadas</div>
        </div>
        <div class="stat">
          <div class="stat__top">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" class="stat__icon stat__icon--red">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span class="stat__badge stat__badge--red">Atención</span>
          </div>
          <div class="stat__value">{{ alertasPendientes }}</div>
          <div class="stat__label">Alertas pendientes</div>
        </div>
      </div>

      <!--SECCIÓN GRÁFICAS -->
      <div class="dash__charts-header">
        <h2 class="section-title">ANÁLISIS</h2>
        <!-- Filtro de fechas y categoría -->
        <div class="charts-filters">
          <select v-model="filtroPeriodo" class="filter-select">
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 3 meses</option>
            <option value="365">Este año</option>
          </select>
          <select v-model="filtroCategoria" class="filter-select">
            <option value="todas">Todos los estados</option>
            <option value="completada">Completadas</option>
            <option value="pendiente">Pendientes</option>
            <option value="urgente">Urgentes</option>
            <option value="sin-realizar">Sin realizar</option>
          </select>
        </div>
      </div>

      <div class="dash__charts">

        <!-- Gráfica 1: Línea — revisiones por día -->
        <div class="chart-card chart-card--wide">
          <h3 class="chart-card__title">Revisiones por día</h3>
          <div class="chart-wrap">
            <canvas ref="lineChartRef" />
          </div>
        </div>

        <!-- Gráfica 2: Barras — revisiones por ambulancia -->
        <div class="chart-card">
          <h3 class="chart-card__title">Por ambulancia</h3>
          <div class="chart-wrap">
            <canvas ref="barChartRef" />
          </div>
        </div>

        <!-- Gráfica 3: Doughnut — distribución por estado -->
        <div class="chart-card">
          <h3 class="chart-card__title">Distribución por estado</h3>
          <div class="chart-wrap chart-wrap--donut">
            <canvas ref="donutChartRef" />
          </div>
          <!-- Leyenda del donut -->
          <div class="donut-legend">
            <div v-for="item in donutLegend" :key="item.label" class="donut-legend__item">
              <span class="donut-legend__dot" :style="{ background: item.color }" />
              <span class="donut-legend__label">{{ item.label }}</span>
              <span class="donut-legend__value">{{ item.value }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom: actividad + perfil -->
      <div class="dash__bottom">
        <div class="card">
          <h2 class="card__title">ACTIVIDAD RECIENTE</h2>
          <div v-if="activities.length > 0" class="activity">
            <div v-for="act in activities" :key="act.id" class="activity__row">
              <div class="activity__left">
                <div class="activity__badge" :style="{ background: act.color + '18' }">
                  <span :style="{ color: act.color }">{{ act.id.split('-')[1] }}</span>
                </div>
                <div>
                  <p class="activity__name">{{ act.nombreAmbulancia }}</p>
                  <p class="activity__time">{{ act.time }}</p>
                </div>
              </div>
              <span class="activity__status" :style="{ background: act.color + '18', color: act.color }">
                {{ act.status }}
              </span>
            </div>
          </div>
          <div v-else class="card__empty">No hay actividad reciente</div>
        </div>

        <div class="card">
          <h2 class="card__title">MI PERFIL</h2>
          <div class="profile">
            <div class="profile__head">
              <div class="profile__avatar"><span>{{ initials }}</span></div>
              <div>
                <p class="profile__name">{{ (user.nombreResponsable || user.nombre || '').toUpperCase() }}</p>
                <p class="profile__role">{{ user.rol }}</p>
              </div>
            </div>
            <div class="profile__rows">
              <div class="profile__row">
                <span class="profile__label">Correo Electrónico</span>
                <span class="profile__value">{{ user.email }}</span>
              </div>
              <div class="profile__row">
                <span class="profile__label">Rol</span>
                <span class="profile__value">{{ user.rol }}</span>
              </div>
              <div class="profile__row profile__row--last">
                <span class="profile__label">ID Usuario</span>
                <span class="profile__value">#{{ user.usuarioId }}</span>
              </div>
            </div>
            <button class="profile__edit" @click="go('/principal/perfil')">Editar Perfil</button>
            <template v-if="isAdmin">
              <div class="profile__admin-sep" />
              <p class="profile__admin-label">Panel de Administración</p>
              <div class="profile__admin-actions">
                <button class="profile__admin-btn" @click="go('/principal/responsables')">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                  Responsables
                </button>
                <button class="profile__admin-btn" @click="go('/principal/ambulancias')">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2">
                    <rect x="1" y="3" width="15" height="13" rx="1" />
                    <path d="M16 8h4l3 3v5h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  Ambulancias
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>

    </div>
  </div>

  <div v-else-if="loading" class="dash-loading">
    <div class="spinner" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  getUsuario, getHistorialRevisiones, obtenerEstadoRevision,
  type Usuario, type Revision
} from '@/core/services/api'
import {
  Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale,
  BarController, BarElement, DoughnutController, ArcElement,
  Tooltip, Legend, Filler
} from 'chart.js'

Chart.register(
  LineController, LineElement, PointElement, LinearScale, CategoryScale,
  BarController, BarElement, DoughnutController, ArcElement,
  Tooltip, Legend, Filler
)

interface Activity {
  id: string; nombreAmbulancia: string; status: string; time: string; color: string
}

const router = useRouter()
const user = ref<Usuario | null>(null)
const activities = ref<Activity[]>([])
const loading = ref(true)
const todasLasRevisiones = ref<Revision[]>([])

// Filtros
const filtroPeriodo = ref('30')   // días
const filtroCategoria = ref('todas')

//Canvas refs 
const lineChartRef = ref<HTMLCanvasElement | null>(null)
const barChartRef = ref<HTMLCanvasElement | null>(null)
const donutChartRef = ref<HTMLCanvasElement | null>(null)

let lineChart: Chart | null = null
let barChart: Chart | null = null
let donutChart: Chart | null = null

// KPIs 
const totalRevisiones = ref(0)
const revisionesAprobadas = ref(0)
const alertasPendientes = ref(0)

const isAdmin = computed(() => user.value?.rol === 'Administrador')
const initials = computed(() =>
  (user.value?.nombreResponsable || user.value?.nombre || '')
    .split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
)
const porcentajeAprobadas = computed(() =>
  totalRevisiones.value === 0 ? 0
    : Math.round(revisionesAprobadas.value / totalRevisiones.value * 100)
)

const go = (path: string) => router.push(path)

const colorFromClase = (c: string) => ({
  completada: '#71B48D', pendiente: '#F59E0B',
  urgente: '#891D1A', 'sin-realizar': '#5E657B'
}[c] || '#5E657B')

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000), h = Math.floor(m / 60), d = Math.floor(h / 24)
  if (d > 0) return `Hace ${d} día${d > 1 ? 's' : ''}`
  if (h > 0) return `Hace ${h} hora${h > 1 ? 's' : ''}`
  if (m > 0) return `Hace ${m} minuto${m > 1 ? 's' : ''}`
  return 'Hace un momento'
}

//  Revisiones filtradas por periodo y categoría 
const revisionesFiltradas = computed(() => {
  const dias = Number(filtroPeriodo.value)
  const desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000)
  return todasLasRevisiones.value.filter(r => {
    const fecha = new Date(r.fechaRevision)
    if (fecha < desde) return false
    if (filtroCategoria.value === 'todas') return true
    return obtenerEstadoRevision(r).clase === filtroCategoria.value
  })
})

// Leyenda del donut 
const donutLegend = computed(() => {
  const estados = ['completada', 'pendiente', 'urgente', 'sin-realizar']
  const labels = ['Completadas', 'Pendientes', 'Urgentes', 'Sin realizar']
  const colores = ['#71B48D', '#F59E0B', '#891D1A', '#5E657B']
  return estados.map((e, i) => ({
    label: labels[i],
    color: colores[i],
    value: revisionesFiltradas.value.filter(r => obtenerEstadoRevision(r).clase === e).length
  })).filter(x => x.value > 0)
})

// Construir datos para gráfica de línea 
const buildLineData = () => {
  const dias = Number(filtroPeriodo.value)
  const labels: string[] = []
  const counts: number[] = []

  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().split('T')[0]
    labels.push(dias <= 14 ? key.slice(5) : key.slice(5))  // MM-DD
    counts.push(
      revisionesFiltradas.value.filter(r => r.fechaRevision?.startsWith(key)).length
    )
  }
  return { labels, counts }
}

//Construir datos para gráfica de barras
const buildBarData = () => {
  const map = new Map<string, number>()
  revisionesFiltradas.value.forEach(r => {
    const nombre = r.nombreAmbulancia || r.matricula || 'N/A'
    map.set(nombre, (map.get(nombre) || 0) + 1)
  })
  const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
  return { labels: sorted.map(x => x[0]), counts: sorted.map(x => x[1]) }
}

// Construir datos para donut
const buildDonutData = () => {
  const estados = ['completada', 'pendiente', 'urgente', 'sin-realizar']
  const labels = ['Completadas', 'Pendientes', 'Urgentes', 'Sin realizar']
  const colores = ['#71B48D', '#F59E0B', '#891D1A', '#5E657B']
  const counts = estados.map(e =>
    revisionesFiltradas.value.filter(r => obtenerEstadoRevision(r).clase === e).length
  )
  return { labels, counts, colores }
}

// Crear o actualizar gráficas
const renderCharts = async () => {
  await nextTick()

  const lineData = buildLineData()
  const barData = buildBarData()
  const donutData = buildDonutData()

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  }

  // Línea
  if (lineChartRef.value) {
    lineChart?.destroy()
    lineChart = new Chart(lineChartRef.value, {
      type: 'line',
      data: {
        labels: lineData.labels,
        datasets: [{
          label: 'Revisiones',
          data: lineData.counts,
          borderColor: '#891D1A',
          backgroundColor: 'rgba(137,29,26,0.08)',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#891D1A',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        ...baseOptions,
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 }, maxTicksLimit: 10 } },
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } }
        }
      }
    })
  }

  // Barras
  if (barChartRef.value) {
    barChart?.destroy()
    barChart = new Chart(barChartRef.value, {
      type: 'bar',
      data: {
        labels: barData.labels,
        datasets: [{
          label: 'Revisiones',
          data: barData.counts,
          backgroundColor: 'rgba(137,29,26,0.75)',
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        ...baseOptions,
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } }
        }
      }
    })
  }

  //  Donut
  if (donutChartRef.value) {
    donutChart?.destroy()
    donutChart = new Chart(donutChartRef.value, {
      type: 'doughnut',
      data: {
        labels: donutData.labels,
        datasets: [{
          data: donutData.counts,
          backgroundColor: donutData.colores,
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        ...baseOptions,
        cutout: '68%',
        plugins: { legend: { display: false }, tooltip: { enabled: true } }
      }
    })
  }
}

// Redibujar cuando cambian los filtros
watch([filtroPeriodo, filtroCategoria], renderCharts)

onMounted(async () => {
  user.value = getUsuario()
  try {
    const revisiones = await getHistorialRevisiones()
    todasLasRevisiones.value = revisiones

    activities.value = revisiones.slice(0, 5).map((r: Revision) => {
      const estado = obtenerEstadoRevision(r)
      return {
        id: `AMB-${String(r.idRevision).padStart(3, '0')}`,
        nombreAmbulancia: r.nombreAmbulancia || r.matricula,
        status: estado.texto,
        time: timeAgo(r.fechaRevision),
        color: colorFromClase(estado.clase)
      }
    })

    const ahora = new Date()
    const mes = revisiones.filter((r: Revision) => {
      const f = new Date(r.fechaRevision)
      return f.getMonth() === ahora.getMonth() && f.getFullYear() === ahora.getFullYear()
    })
    totalRevisiones.value = mes.length
    revisionesAprobadas.value = mes.filter((r: Revision) => obtenerEstadoRevision(r).clase === 'completada').length
    alertasPendientes.value = mes.filter((r: Revision) => ['urgente', 'pendiente'].includes(obtenerEstadoRevision(r).clase)).length

    await renderCharts()
  } catch { }
  loading.value = false
  await nextTick() 
  await renderCharts()
})
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.dash {
  padding: 1.75rem 2rem;
  min-height: 100vh;
  background: $bg-page;
}

.dash__inner {
  max-width: 1400px;
  margin: 0 auto;
}

.dash__subtitle {
  font-family: $font-primary;
  font-size: 14px;
  color: $text-gray;
  margin-bottom: 1.5rem;
}

// Acciones
.dash__actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.action {
  border-radius: 16px;
  padding: 1.625rem;
  color: $white;
  text-align: left;
  border: none;
  cursor: pointer;
  transition: filter 0.2s;

  &:hover {
    filter: brightness(0.92);
  }

  &--red {
    background: linear-gradient(140deg, #891D1A, #6b1515);
  }

  &--blue {
    background: linear-gradient(140deg, #5E657B, #474e61);
  }

  &--green {
    background: linear-gradient(140deg, #71B48D, #559970);
  }
}

.action__icon-wrap {
  width: 52px;
  height: 52px;
  background: rgba($white, 0.18);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;

  svg {
    width: 26px;
    height: 26px;
  }
}

.action__title {
  font-family: $font-display;
  font-size: 26px;
  letter-spacing: $font-display-spacing;
  line-height: 1;
  margin-bottom: 0.375rem;
  color: $white;
}

.action__text {
  font-family: $font-primary;
  font-size: 13px;
  opacity: 0.88;
  color: $white;
}

// Stats
.dash__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.stat {
  background: $white;
  border-radius: 14px;
  padding: 1.25rem 1.375rem;
  border: 1px solid $border-color;
}

.stat__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.875rem;
}

.stat__icon {
  width: 26px;
  height: 26px;

  &--green {
    color: $green-accent;
  }

  &--red {
    color: $primary-red;
  }
}

.stat__badge {
  font-family: $font-primary;
  font-size: 10.5px;
  font-weight: $font-bold;
  padding: 0.175rem 0.5rem;
  border-radius: $border-radius-pill;

  &--green {
    color: $green-accent;
    background: rgba($green-accent, 0.1);
  }

  &--red {
    color: $primary-red;
    background: rgba($primary-red, 0.08);
  }
}

.stat__value {
  font-family: $font-display;
  color: $text-dark;
  font-size: 38px;
  letter-spacing: $font-display-spacing;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat__label {
  font-family: $font-primary;
  font-size: 13px;
  color: $text-gray;
}

// ── Gráficas ──────────────────────────────────────────────────
.dash__charts-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.section-title {
  font-family: $font-display;
  font-size: 28px;
  letter-spacing: $font-display-spacing;
  color: $text-dark;
  line-height: 1;
}

.charts-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.4rem 0.75rem;
  border: 1.5px solid $border-color;
  border-radius: 9px;
  background: $white;
  font-family: $font-primary;
  font-size: 13px;
  color: $text-dark;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;

  &:focus {
    border-color: $primary-red;
  }
}

.dash__charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: $white;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  border: 1px solid $border-color;

  // La gráfica de línea ocupa toda la fila superior
  &--wide {
    grid-column: 1 / -1;
  }
}

.chart-card__title {
  font-family: $font-primary;
  font-size: 13px;
  font-weight: $font-bold;
  color: $text-gray;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 1rem;
}

.chart-wrap {
  height: 200px;
  position: relative;

  &--donut {
    height: 160px;
  }
}

// Leyenda donut
.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 0.875rem;
}

.donut-legend__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: $font-primary;
  font-size: 12.5px;
}

.donut-legend__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.donut-legend__label {
  flex: 1;
  color: $text-dark;
}

.donut-legend__value {
  font-weight: $font-bold;
  color: $text-dark;
}

// Bottom
.dash__bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.card {
  background: $white;
  border-radius: 16px;
  padding: 1.5rem 1.75rem;
  border: 1px solid $border-color;
}

.card__title {
  font-family: $font-display;
  font-size: 26px;
  letter-spacing: $font-display-spacing;
  color: $text-dark;
  line-height: 1;
  margin-bottom: 1.25rem;
}

.card__empty {
  font-family: $font-primary;
  font-size: 14px;
  color: $text-gray;
  text-align: center;
  padding: 2rem 0;
}

.activity {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.activity__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0.875rem;
  border-radius: 10px;
  border: 1px solid $border-color;
  transition: background 0.15s;

  &:hover {
    background: $bg-page;
  }
}

.activity__left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.activity__badge {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  span {
    font-family: $font-display;
    font-size: 13px;
  }
}

.activity__name {
  font-family: $font-primary;
  font-size: 13.5px;
  font-weight: $font-semibold;
  color: $text-dark;
}

.activity__time {
  font-family: $font-primary;
  font-size: 11.5px;
  color: $text-gray;
  margin-top: 1px;
}

.activity__status {
  font-family: $font-primary;
  font-size: 11px;
  font-weight: $font-bold;
  padding: 0.2rem 0.625rem;
  border-radius: $border-radius-pill;
  white-space: nowrap;
}

.profile {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile__head {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.profile__avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: $primary-red;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  span {
    font-family: $font-display;
    color: $white;
    font-size: 22px;
    letter-spacing: 0.04em;
  }
}

.profile__name {
  font-family: $font-display;
  font-size: 20px;
  letter-spacing: $font-display-spacing;
  color: $text-dark;
  line-height: 1;
}

.profile__role {
  font-family: $font-primary;
  font-size: 12px;
  color: $text-gray;
  margin-top: 3px;
}

.profile__rows {
  border: 1px solid $border-color;
  border-radius: 10px;
  overflow: hidden;
}

.profile__row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0.625rem 0.875rem;
  border-bottom: 1px solid $border-color;

  &--last {
    border-bottom: none;
  }
}

.profile__label {
  font-family: $font-primary;
  font-size: 11px;
  color: $text-gray;
}

.profile__value {
  font-family: $font-primary;
  font-size: 13.5px;
  font-weight: $font-semibold;
  color: $text-dark;
}

.profile__edit {
  width: 100%;
  padding: 0.625rem;
  background: rgba($primary-red, 0.06);
  color: $primary-red;
  border-radius: 10px;
  font-family: $font-primary;
  font-size: 14px;
  font-weight: $font-semibold;
  border: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: $primary-red;
    color: $white;
  }
}

.profile__admin-sep {
  height: 1px;
  background: $border-color;
}

.profile__admin-label {
  font-family: $font-primary;
  font-size: 11px;
  font-weight: $font-bold;
  letter-spacing: 0.06em;
  color: $text-gray;
  text-transform: uppercase;
}

.profile__admin-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.profile__admin-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: $bg-page;
  border: 1px solid $border-color;
  border-radius: 9px;
  font-family: $font-primary;
  font-size: 13px;
  font-weight: $font-semibold;
  color: $text-dark;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  svg {
    width: 15px;
    height: 15px;
    opacity: 0.5;
    flex-shrink: 0;
  }

  &:hover {
    border-color: $primary-red;
    color: $primary-red;
    background: rgba($primary-red, 0.04);

    svg {
      opacity: 1;
    }
  }
}

.dash-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: $bg-page;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid $border-color;
  border-top-color: $primary-red;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
</style>