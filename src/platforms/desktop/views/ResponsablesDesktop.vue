<template>
  <div class="page">
    <div class="page__inner">

      <div class="page__header">
        <div>
          <h1 class="page__title">RESPONSABLES</h1>
          <p class="page__sub">Gestión de técnicos responsables del sistema</p>
        </div>
      </div>

      <div class="filters">
        <div class="filters__search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input v-model="search" type="text" placeholder="Buscar responsable..." />
        </div>
      </div>

      <div v-if="loading" class="empty-state"><div class="spinner" /></div>
      <div v-else-if="filtered.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
        </svg>
        <p>No se encontraron responsables</p>
      </div>

      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Inspecciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in filtered" :key="r.usuarioId" class="table__row">
              <td>
                <div class="user-cell">
                  <div class="user-cell__avatar">{{ initials(r) }}</div>
                  <span class="table__main">{{ r.nombre || r.nombreResponsable }}</span>
                </div>
              </td>
              <td class="table__secondary">{{ r.email || '—' }}</td>
              <td>
                <span class="badge" :class="r.rol === 'Administrador' ? 'badge--admin' : 'badge--inspector'">
                  {{ r.rol }}
                </span>
              </td>
              <td class="table__secondary">{{ r.totalInspecciones ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getListaResponsables } from '@/core/services/api'

const loading    = ref(true)
const responsables = ref<any[]>([])
const search     = ref('')

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return responsables.value.filter(r =>
    !q || (r.nombre || r.nombreResponsable || '').toLowerCase().includes(q) ||
    (r.email || '').toLowerCase().includes(q)
  )
})

const initials = (r: any) =>
  (r.nombre || r.nombreResponsable || '?').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

onMounted(async () => {
  try { responsables.value = await getListaResponsables() }
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
.page__title { font-family: $font-display; font-size: 38px; letter-spacing: $font-display-spacing; color: $text-dark; line-height: 1; margin-bottom: 0.25rem; }
.page__sub { font-family: $font-primary; font-size: 14px; color: $text-gray; }

.filters { margin-bottom: 1rem; }

.filters__search {
  display: flex; align-items: center; gap: 0.625rem; padding: 0 0.875rem;
  background: $white; border: 1.5px solid $border-color; border-radius: 10px;
  max-width: 400px; transition: border-color 0.15s;
  svg { width: 16px; height: 16px; color: $text-gray; flex-shrink: 0; }
  input {
    flex: 1; border: none; outline: none; font-family: $font-primary; font-size: 14px;
    color: $text-dark; padding: 0.625rem 0; background: transparent;
    &::placeholder { color: $placeholder-color; }
  }
  &:focus-within { border-color: $primary-red; }
}

.empty-state {
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  padding: 3rem; color: $text-gray; background: $white; border-radius: 14px;
  border: 1px solid $border-color;
  svg { width: 40px; height: 40px; opacity: 0.3; }
  p { font-family: $font-primary; font-size: 14px; }
}

@keyframes spin { to { transform: rotate(360deg); } }
.spinner { width: 28px; height: 28px; border: 3px solid $border-color; border-top-color: $primary-red; border-radius: 50%; animation: spin 0.8s linear infinite; }

.table-wrap { background: $white; border: 1px solid $border-color; border-radius: 14px; overflow: hidden; }

.table {
  width: 100%; border-collapse: collapse;
  thead tr {
    background: $bg-page;
    th {
      padding: 0.75rem 1rem; text-align: left; font-family: $font-primary; font-size: 11px;
      font-weight: $font-bold; color: $text-gray; letter-spacing: 0.06em; text-transform: uppercase;
      border-bottom: 1px solid $border-color;
    }
  }
}

.table__row {
  border-bottom: 1px solid $border-color; transition: background 0.12s;
  &:last-child { border-bottom: none; }
  &:hover { background: $bg-page; }
  td { padding: 0.875rem 1rem; }
}

.user-cell { display: flex; align-items: center; gap: 0.625rem; }

.user-cell__avatar {
  width: 32px; height: 32px; border-radius: 50%; background: $primary-red;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  font-family: $font-display; color: $white; font-size: 13px;
}

.table__main      { font-family: $font-primary; font-size: 13.5px; font-weight: $font-semibold; color: $text-dark; }
.table__secondary { font-family: $font-primary; font-size: 13px; color: $text-gray; }

.badge {
  display: inline-block; padding: 0.2rem 0.625rem; border-radius: $border-radius-pill;
  font-family: $font-primary; font-size: 11px; font-weight: $font-bold;
  &--admin    { background: rgba($primary-red, 0.1); color: $primary-red; }
  &--inspector{ background: rgba($blue-accent, 0.1); color: $blue-accent; }
}
</style>