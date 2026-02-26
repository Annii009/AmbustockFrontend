<template>
  <div class="page">
    <div class="page__inner">

      <button class="back-link" @click="router.push('/principal/historial')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Volver al historial
      </button>

      <div v-if="isLoading" class="loading-state"><div class="spinner" /></div>

      <template v-else-if="reposicionData">

        <div class="page__header">
          <div>
            <h1 class="page__title">{{ reposicionData.nombreAmbulancia }}</h1>
            <p class="page__sub">{{ formatDate(reposicionData.fechaReposicion || reposicionData.fecha) }}</p>
          </div>
          <span class="status-badge" :class="`status-badge--${estadoClass}`">
            {{ reposicionData.estado }}
          </span>
        </div>

        <div class="detail-grid">

          <!-- Info general -->
          <div class="card">
            <h2 class="card__title">INFORMACIÓN GENERAL</h2>
            <div class="info-rows">
              <div class="info-row">
                <span class="info-row__label">Ambulancia</span>
                <span class="info-row__value">{{ reposicionData.nombreAmbulancia }}</span>
              </div>
              <div class="info-row">
                <span class="info-row__label">Matrícula</span>
                <span class="info-row__value">{{ reposicionData.matricula || '—' }}</span>
              </div>
              <div class="info-row">
                <span class="info-row__label">Responsable</span>
                <span class="info-row__value">{{ reposicionData.nombreResponsable || '—' }}</span>
              </div>
              <div class="info-row">
                <span class="info-row__label">Fecha</span>
                <span class="info-row__value">{{ formatDate(reposicionData.fechaReposicion || reposicionData.fecha) }}</span>
              </div>
              <div class="info-row info-row--last">
                <span class="info-row__label">Origen</span>
                <span class="info-row__value">{{ reposicionData.origen || 'revision' }}</span>
              </div>
            </div>
          </div>

          <!-- Materiales -->
          <div class="card">
            <div class="card__header-row">
              <h2 class="card__title">MATERIALES ({{ totalMateriales }})</h2>
              <span class="card__badge">{{ reposicionData.estado }}</span>
            </div>

            <div v-if="materiales.length === 0" class="empty-msg">Sin materiales registrados</div>

            <div v-else class="materials-list">
              <div v-for="(mat, i) in materiales" :key="i" class="material-row">
                <div class="material-row__info">
                  <span class="material-row__name">{{ mat.nombreProducto || mat.nombre }}</span>
                  <span class="material-row__sub">Faltante: {{ mat.cantidadFaltante ?? mat.cantidad ?? 0 }}</span>
                </div>
                <template v-if="reposicionData.estado === 'pendiente'">
                  <div class="material-row__controls">
                    <button class="qty-btn" @click="cambiarCantidad(i, -1)">−</button>
                    <span class="qty-val">{{ getCantidad(i) }}</span>
                    <button class="qty-btn" @click="cambiarCantidad(i, 1)">+</button>
                  </div>
                </template>
                <template v-else>
                  <span class="material-row__done">✓ Repuesto</span>
                </template>
              </div>
            </div>

            <div v-if="reposicionData.estado === 'pendiente'" class="card__footer">
              <button class="btn-confirm" @click="confirmar">
                Confirmar Reposición
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </button>
            </div>
          </div>

        </div>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getReposicionById, confirmarReposicion, formatearFecha, type ReposicionDetalle } from '@core/services/api'

const router = useRouter()
const route  = useRoute()

const reposicionData      = ref<ReposicionDetalle | null>(null)
const materialesModificados = ref<Record<number, number>>({})
const isLoading           = ref(true)

const estadoClass = computed(() => (reposicionData.value?.estado || 'pendiente').toLowerCase())
const materiales  = computed(() => reposicionData.value?.materiales || reposicionData.value?.materialesFaltantes || [])
const totalMateriales = computed(() => materiales.value.length)

const getCantidad      = (i: number) => materialesModificados.value[i] ?? 0
const cambiarCantidad  = (i: number, delta: number) => {
  const actual = getCantidad(i)
  materialesModificados.value[i] = Math.max(0, actual + delta)
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const confirmar = async () => {
  if (!reposicionData.value) return
  if (!confirm('¿Confirmar esta reposición?')) return
  try {
    const id = reposicionData.value.id || reposicionData.value.idReposicion
    await confirmarReposicion(id, materialesModificados.value)
    reposicionData.value.estado = 'completada'
  } catch { alert('Error al confirmar') }
}

onMounted(async () => {
  try {
    const id = parseInt(route.params.id as string)
    reposicionData.value = await getReposicionById(id)
  } catch { router.push('/principal/historial') }
  finally { isLoading.value = false }
})
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.page { padding: 1.75rem 2rem; min-height: 100vh; background: $bg-page; }
.page__inner { max-width: 1100px; margin: 0 auto; }

.back-link {
  display: inline-flex; align-items: center; gap: 0.375rem; margin-bottom: 1.25rem;
  background: none; border: none; font-family: $font-primary; font-size: 13.5px;
  font-weight: $font-semibold; color: $text-gray; cursor: pointer;
  transition: color 0.15s;
  svg { width: 16px; height: 16px; }
  &:hover { color: $primary-red; }
}

.loading-state { display: flex; justify-content: center; padding: 4rem; }

@keyframes spin { to { transform: rotate(360deg); } }
.spinner { width: 28px; height: 28px; border: 3px solid $border-color; border-top-color: $primary-red; border-radius: 50%; animation: spin 0.8s linear infinite; }

.page__header {
  @include flex-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;
  align-items: flex-start;
}

.page__title { font-family: $font-display; font-size: 38px; letter-spacing: $font-display-spacing; color: $text-dark; line-height: 1; margin-bottom: 4px; }
.page__sub { font-family: $font-primary; font-size: 14px; color: $text-gray; }

.status-badge {
  padding: 0.375rem 0.875rem; border-radius: $border-radius-pill;
  font-family: $font-primary; font-size: 13px; font-weight: $font-bold; text-transform: capitalize;
  &--pendiente   { background: rgba(#F59E0B, 0.12); color: #C27D00; }
  &--completada  { background: rgba($green-accent, 0.12); color: $green-accent; }
  &--urgente     { background: rgba($primary-red, 0.1);  color: $primary-red; }
}

.detail-grid {
  display: grid; grid-template-columns: 1fr 1.5fr; gap: 1.25rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
}

.card { background: $white; border: 1px solid $border-color; border-radius: 14px; padding: 1.5rem; }
.card__title { font-family: $font-display; font-size: 22px; letter-spacing: $font-display-spacing; color: $text-dark; line-height: 1; margin-bottom: 1.25rem; }

.card__header-row { @include flex-between; margin-bottom: 1.25rem; align-items: center; }

.card__badge {
  font-family: $font-primary; font-size: 11px; font-weight: $font-bold;
  padding: 0.175rem 0.5rem; border-radius: $border-radius-pill;
  background: $bg-page; color: $text-gray; text-transform: capitalize;
}

.info-rows { border: 1px solid $border-color; border-radius: 10px; overflow: hidden; }

.info-row {
  display: flex; flex-direction: column; gap: 2px;
  padding: 0.625rem 0.875rem; border-bottom: 1px solid $border-color;
  &--last { border-bottom: none; }
}

.info-row__label { font-family: $font-primary; font-size: 11px; color: $text-gray; }
.info-row__value { font-family: $font-primary; font-size: 13.5px; font-weight: $font-semibold; color: $text-dark; }

.empty-msg { font-family: $font-primary; font-size: 14px; color: $text-gray; text-align: center; padding: 2rem 0; }

.materials-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }

.material-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.625rem 0.75rem; border-radius: 9px; border: 1px solid $border-color;
  transition: background 0.12s;
  &:hover { background: $bg-page; }
}

.material-row__info { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.material-row__name { font-family: $font-primary; font-size: 13.5px; font-weight: $font-semibold; color: $text-dark; }
.material-row__sub  { font-family: $font-primary; font-size: 11.5px; color: $text-gray; }
.material-row__done { font-family: $font-primary; font-size: 12.5px; font-weight: $font-bold; color: $green-accent; }

.material-row__controls { display: flex; align-items: center; gap: 0.375rem; }

.qty-btn {
  width: 26px; height: 26px; border-radius: 6px; border: 1.5px solid $border-color;
  background: $white; cursor: pointer; font-size: 15px; font-weight: bold;
  display: flex; align-items: center; justify-content: center; transition: border-color 0.15s;
  &:hover { border-color: $primary-red; color: $primary-red; }
}

.qty-val { min-width: 28px; text-align: center; font-family: $font-display; font-size: 18px; color: $text-dark; }

.card__footer { padding-top: 1rem; border-top: 1px solid $border-color; }

.btn-confirm {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%;
  padding: 0.75rem; background: $green-accent; color: $white; border: none; border-radius: 10px;
  font-family: $font-primary; font-size: 14px; font-weight: $font-semibold; cursor: pointer;
  transition: filter 0.15s;
  svg { width: 16px; height: 16px; }
  &:hover { filter: brightness(0.9); }
}
</style>