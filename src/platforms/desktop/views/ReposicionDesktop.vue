<template>
  <div class="page">
    <div class="page__inner">

      <div class="page__header">
        <div>
          <h1 class="page__title">REVISIÓN MATERIAL</h1>
          <p class="page__sub">Gestiona el material gastado y los pedidos de revisión</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button v-for="tab in tabs" :key="tab.id"
          class="tabs__btn" :class="{ 'tabs__btn--active': activeTab === tab.id }"
          @click="activeTab = tab.id">
          {{ tab.label }}
        </button>
      </div>

      <!-- Pendientes -->
      <div v-if="activeTab === 'pendientes'">
        <div v-if="loading" class="empty-state"><div class="spinner" /></div>
        <div v-else-if="reposicionesPendientes.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          <p>No hay reposiciones pendientes</p>
        </div>
        <div v-else class="cards-grid">
          <div v-for="r in reposicionesPendientes" :key="r.idRevision" class="repo-card">
            <div class="repo-card__header">
              <div class="repo-card__amb">{{ r.nombreAmbulancia || r.matricula }}</div>
              <span class="badge badge--pendiente">Pendiente</span>
            </div>
            <div class="repo-card__info">
              <span>{{ formatDate(r.fechaRevision) }}</span>
              <span v-if="r.nombreResponsable">· {{ r.nombreResponsable }}</span>
            </div>
            <button class="repo-card__btn" @click="router.push(`/principal/detalle-reposicion/${r.idRevision}`)">
              Ver detalle →
            </button>
          </div>
        </div>
      </div>

      <!-- Completadas -->
      <div v-if="activeTab === 'completadas'">
        <div v-if="reposicionesCompletadas.length === 0" class="empty-state">
          <p>No hay reposiciones completadas</p>
        </div>
        <div v-else class="cards-grid">
          <div v-for="r in reposicionesCompletadas" :key="r.idRevision" class="repo-card repo-card--done">
            <div class="repo-card__header">
              <div class="repo-card__amb">{{ r.nombreAmbulancia || r.matricula }}</div>
              <span class="badge badge--completada">Completada</span>
            </div>
            <div class="repo-card__info">
              <span>{{ formatDate(r.fechaRevision) }}</span>
            </div>
            <button class="repo-card__btn" @click="router.push(`/principal/detalle-reposicion/${r.idRevision}`)">
              Ver detalle →
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getHistorialRevisiones, obtenerEstadoRevision, type Revision } from '@/core/services/api'

const router   = useRouter()
const loading  = ref(true)
const revisiones = ref<Revision[]>([])
const activeTab  = ref('pendientes')

const tabs = [
  { id: 'pendientes',  label: 'Pendientes' },
  { id: 'completadas', label: 'Completadas' }
]

const reposicionesPendientes = computed(() =>
  revisiones.value.filter(r => ['pendiente', 'urgente'].includes(obtenerEstadoRevision(r).clase))
)
const reposicionesCompletadas = computed(() =>
  revisiones.value.filter(r => obtenerEstadoRevision(r).clase === 'completada')
)

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })

onMounted(async () => {
  try { revisiones.value = await getHistorialRevisiones() }
  catch { /* silencioso */ }
  finally { loading.value = false }
})
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.page { padding: 1.75rem 2rem; min-height: 100vh; background: $bg-page; }
.page__inner { max-width: 1400px; margin: 0 auto; }

.page__header { @include flex-between; margin-bottom: 1.5rem; }

.page__title {
  font-family: $font-display;
  font-size: 38px;
  letter-spacing: $font-display-spacing;
  color: $text-dark;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.page__sub { font-family: $font-primary; font-size: 14px; color: $text-gray; }

.tabs {
  display: flex;
  gap: 4px;
  background: $white;
  border: 1px solid $border-color;
  border-radius: 11px;
  padding: 4px;
  width: fit-content;
  margin-bottom: 1.25rem;
}

.tabs__btn {
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-family: $font-primary;
  font-size: 13.5px;
  font-weight: $font-semibold;
  color: $text-gray;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  &--active { background: $primary-red; color: $white; }
  &:not(.tabs__btn--active):hover { background: $bg-page; color: $text-dark; }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem;
  color: $text-gray;
  background: $white;
  border-radius: 14px;
  border: 1px solid $border-color;
  svg { width: 40px; height: 40px; opacity: 0.3; }
  p { font-family: $font-primary; font-size: 14px; }
}

@keyframes spin { to { transform: rotate(360deg); } }
.spinner {
  width: 28px; height: 28px;
  border: 3px solid $border-color; border-top-color: $primary-red;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.repo-card {
  background: $white;
  border: 1px solid $border-color;
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: box-shadow 0.15s;
  &:hover { box-shadow: $shadow-card; }
  &--done { opacity: 0.8; }
}

.repo-card__header { @include flex-between; }

.repo-card__amb {
  font-family: $font-primary;
  font-size: 14px;
  font-weight: $font-bold;
  color: $text-dark;
}

.repo-card__info {
  font-family: $font-primary;
  font-size: 12.5px;
  color: $text-gray;
}

.repo-card__btn {
  align-self: flex-end;
  background: none;
  border: none;
  font-family: $font-primary;
  font-size: 13px;
  font-weight: $font-semibold;
  color: $primary-red;
  cursor: pointer;
  padding: 0;
  &:hover { text-decoration: underline; }
}

.badge {
  display: inline-block;
  padding: 0.175rem 0.5rem;
  border-radius: $border-radius-pill;
  font-family: $font-primary;
  font-size: 11px;
  font-weight: $font-bold;
  &--pendiente  { background: rgba(#F59E0B, 0.12); color: #C27D00; }
  &--completada { background: rgba($green-accent, 0.12); color: $green-accent; }
  &--urgente    { background: rgba($primary-red, 0.1);  color: $primary-red; }
}
</style>