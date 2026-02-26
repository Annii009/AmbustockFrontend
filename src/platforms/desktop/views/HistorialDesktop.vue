<template>
  <div class="page">
    <div class="page__inner">

      <div class="page__header">
        <div>
          <h1 class="page__title">HISTORIAL</h1>
          <p class="page__sub">Registro de todas las inspecciones realizadas</p>
        </div>
        <button class="btn-primary" @click="router.push('/principal/seleccion-ambulancia')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nueva Inspección
        </button>
      </div>

      <!-- Filtros -->
      <div class="filters">
        <div class="filters__search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input v-model="search" type="text" placeholder="Buscar ambulancia, responsable..." />
        </div>
        <select v-model="filterEstado" class="filters__select">
          <option value="">Todos los estados</option>
          <option value="completada">Completada</option>
          <option value="pendiente">Pendiente</option>
          <option value="urgente">Urgente</option>
          <option value="sin-realizar">Sin realizar</option>
        </select>
      </div>

      <!-- Tabla -->
      <div class="table-wrap">
        <div v-if="loading" class="table-empty">
          <div class="spinner" />
        </div>
        <div v-else-if="filtered.length === 0" class="table-empty">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/>
          </svg>
          <p>No se encontraron revisiones</p>
        </div>
        <table v-else class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ambulancia</th>
              <th>Responsable</th>
              <th>Servicio</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in filtered" :key="r.idRevision" class="table__row">
              <td class="table__id">#{{ String(r.idRevision).padStart(3, '0') }}</td>
              <td class="table__main">{{ r.nombreAmbulancia || r.matricula }}</td>
              <td class="table__secondary">{{ r.nombreResponsable || '—' }}</td>
              <td class="table__secondary">{{ r.nombreServicio || '—' }}</td>
              <td class="table__secondary">{{ formatDate(r.fechaRevision) }}</td>
              <td>
                <span class="badge" :class="`badge--${getEstado(r).clase}`">{{ getEstado(r).texto }}</span>
              </td>
              <td>
                <button class="table__action" @click="router.push(`/principal/detalle-reposicion/${r.idRevision}`)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
const search   = ref('')
const filterEstado = ref('')

const getEstado = (r: Revision) => obtenerEstadoRevision(r)

const filtered = computed(() => {
  return revisiones.value.filter(r => {
    const q = search.value.toLowerCase()
    const matchSearch = !q ||
      (r.nombreAmbulancia || r.matricula || '').toLowerCase().includes(q) ||
      (r.nombreResponsable || '').toLowerCase().includes(q)
    const matchEstado = !filterEstado.value || getEstado(r).clase === filterEstado.value
    return matchSearch && matchEstado
  })
})

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('es-ES', {
  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
})

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

.page__header {
  @include flex-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page__title {
  font-family: $font-display;
  font-size: 38px;
  letter-spacing: $font-display-spacing;
  color: $text-dark;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.page__sub { font-family: $font-primary; font-size: 14px; color: $text-gray; }

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: $primary-red;
  color: $white;
  border: none;
  border-radius: 10px;
  font-family: $font-primary;
  font-size: 14px;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: filter 0.15s;
  svg { width: 16px; height: 16px; }
  &:hover { filter: brightness(0.9); }
}

.filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.filters__search {
  flex: 1;
  min-width: 220px;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0 0.875rem;
  background: $white;
  border: 1.5px solid $border-color;
  border-radius: 10px;
  transition: border-color 0.15s;
  svg { width: 16px; height: 16px; color: $text-gray; flex-shrink: 0; }
  input {
    flex: 1;
    border: none;
    outline: none;
    font-family: $font-primary;
    font-size: 14px;
    color: $text-dark;
    padding: 0.625rem 0;
    background: transparent;
    &::placeholder { color: $placeholder-color; }
  }
  &:focus-within { border-color: $primary-red; }
}

.filters__select {
  padding: 0.625rem 2rem 0.625rem 0.875rem;
  background: $white;
  border: 1.5px solid $border-color;
  border-radius: 10px;
  font-family: $font-primary;
  font-size: 13.5px;
  color: $text-dark;
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23555' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  &:focus { outline: none; border-color: $primary-red; }
}

.table-wrap {
  background: $white;
  border: 1px solid $border-color;
  border-radius: 14px;
  overflow: hidden;
}

.table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem;
  color: $text-gray;
  svg { width: 40px; height: 40px; opacity: 0.3; }
  p { font-family: $font-primary; font-size: 14px; }
}

@keyframes spin { to { transform: rotate(360deg); } }
.spinner {
  width: 28px; height: 28px;
  border: 3px solid $border-color; border-top-color: $primary-red;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}

.table {
  width: 100%;
  border-collapse: collapse;

  thead tr {
    background: $bg-page;
    th {
      padding: 0.75rem 1rem;
      text-align: left;
      font-family: $font-primary;
      font-size: 11px;
      font-weight: $font-bold;
      color: $text-gray;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      border-bottom: 1px solid $border-color;
    }
  }
}

.table__row {
  border-bottom: 1px solid $border-color;
  transition: background 0.12s;
  &:last-child { border-bottom: none; }
  &:hover { background: $bg-page; }
  td { padding: 0.875rem 1rem; }
}

.table__id       { font-family: $font-primary; font-size: 13px; font-weight: $font-bold; color: $text-gray; }
.table__main     { font-family: $font-primary; font-size: 13.5px; font-weight: $font-semibold; color: $text-dark; }
.table__secondary{ font-family: $font-primary; font-size: 13px; color: $text-gray; }

.badge {
  display: inline-block;
  padding: 0.2rem 0.625rem;
  border-radius: $border-radius-pill;
  font-family: $font-primary;
  font-size: 11px;
  font-weight: $font-bold;
  white-space: nowrap;

  &--completada   { background: rgba($green-accent, 0.12); color: $green-accent; }
  &--pendiente    { background: rgba(#F59E0B, 0.12); color: #C27D00; }
  &--urgente      { background: rgba($primary-red, 0.1);  color: $primary-red; }
  &--sin-realizar { background: rgba($blue-accent, 0.1);  color: $blue-accent; }
}

.table__action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  background: transparent;
  border: 1px solid $border-color;
  cursor: pointer;
  color: $text-gray;
  transition: background 0.15s, color 0.15s;
  svg { width: 14px; height: 14px; }
  &:hover { background: $primary-red; color: $white; border-color: $primary-red; }
}
</style>