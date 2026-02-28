<template>
  <DesktopInspectionLayout :current-step="3" :progress="90" :ambulancia-label="ambulanciaNombre || '—'">
    <div class="page">

      <div class="page__header">
        <div class="page__icon page__icon--warning">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div>
          <h1 class="page__title">MATERIAL PARA REPONER</h1>
          <p class="page__sub">
            Se encontraron <strong>{{ cantidadFaltantes }}</strong> deficiencia{{ cantidadFaltantes !== 1 ? 's' : '' }} en la revisión del vehículo
          </p>
        </div>
      </div>

      <!-- Sin faltantes -->
      <div v-if="materialesFaltantes.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <p>¡Todos los materiales están completos!</p>
      </div>

      <!-- Tabla con campos reales: nombreProducto, cantidadFaltante, ubicacion -->
      <div v-else class="faltantes-table">
        <div class="faltantes-table__head">
          <span>Material</span>
          <span>Ubicación</span>
          <span>Cantidad faltante</span>
        </div>
        <div
          v-for="(material, index) in materialesFaltantes"
          :key="index"
          class="faltantes-table__row"
        >
          <div class="faltantes-table__material">
            <div class="faltantes-table__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <span class="faltantes-table__name">{{ material.nombreProducto }}</span>
          </div>
          <span class="faltantes-table__ubicacion">{{ material.ubicacion || '—' }}</span>
          <span class="faltantes-table__diff">Falta: {{ material.cantidadFaltante }}</span>
        </div>
      </div>

      <div class="page__footer">
        <button class="btn-back" @click="router.push('/principal/revision')">Atrás</button>
        <button class="btn-next" @click="finalizar">
          Finalizado y repuesto
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

    </div>
  </DesktopInspectionLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getMaterialesFaltantes,
  getAmbulanciaById,
  getAmbulanciaSeleccionada,
  getNombreResponsable,
  guardarReposicion,
  guardarReposicionEnHistorial,
  limpiarDatosRevision,
  type MaterialFaltante,
  type Reposicion
} from '@core/services/api'
import DesktopInspectionLayout from '../layouts/DesktopInspectionLayout.vue'

const router              = useRouter()
const materialesFaltantes = ref<MaterialFaltante[]>([])
const ambulanciaNombre    = ref('')

const cantidadFaltantes = computed(() => materialesFaltantes.value.length)

onMounted(async () => {
  const faltantes = getMaterialesFaltantes()
  if (!faltantes) { router.push('/principal'); return }
  materialesFaltantes.value = faltantes

  const ambulanciaId = getAmbulanciaSeleccionada()
  if (ambulanciaId) {
    const amb = await getAmbulanciaById(ambulanciaId).catch(() => null)
    ambulanciaNombre.value = amb?.nombre || amb?.matricula || ''
  }
})

// Idéntico al mobile: guardar Revisión y luego navegar
const finalizar = async () => {
  try {
    if (materialesFaltantes.value.length > 0) {
      const ambulanciaId      = getAmbulanciaSeleccionada()
      const nombreResponsable = getNombreResponsable()

      if (ambulanciaId) {
        const ambulancia = await getAmbulanciaById(ambulanciaId).catch(() => null)

        const reposicion: Reposicion = {
          id:                 Date.now(),
          idReposicion:       Date.now(),
          idAmbulancia:       ambulanciaId,
          nombreAmbulancia:   ambulancia?.nombre || 'N/A',
          matricula:          ambulancia?.matricula || 'N/A',
          nombreResponsable:  nombreResponsable || 'Sin responsable',
          fechaReposicion:    new Date().toISOString(),
          fecha:              new Date().toISOString(),
          estado:             'pendiente',
          origen:             'revision',
          materiales: materialesFaltantes.value.map(m => ({
            nombreProducto:   m.nombreProducto,
            cantidad:         m.cantidadFaltante,
            cantidadFaltante: m.cantidadFaltante,
            stockActual:      0,
            ubicacion:        m.ubicacion
          })),
          materialesFaltantes: materialesFaltantes.value
        }

        try {
          await guardarReposicion(reposicion)
        } catch {
          console.log('Backend no disponible, guardando solo en localStorage')
        }

        guardarReposicionEnHistorial(reposicion)
      }
    }
  } catch (error) {
    console.error('Error al guardar revisión:', error)
  }

  limpiarDatosRevision()
  router.push('/principal/mision-cumplida')
}
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.page { display: flex; flex-direction: column; gap: 1.25rem; }

.page__header { display: flex; align-items: center; gap: 1rem; }

.page__icon {
  width: 52px; height: 52px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  svg { width: 24px; height: 24px; }
  &--warning { background: $alert-icon-bg; }
}

.page__title {
  font-family: $font-display; font-size: 32px; letter-spacing: $font-display-spacing;
  color: $text-dark; line-height: 1; margin-bottom: 4px;
}
.page__sub {
  font-family: $font-primary; font-size: 14px; color: $text-gray;
  strong { color: $primary-red; }
}

.empty-state {
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  padding: 3rem; background: $white; border: 1px solid $border-color; border-radius: 14px;
  svg { width: 48px; height: 48px; color: $green-accent; }
  p { font-family: $font-primary; font-size: 15px; color: $text-dark; font-weight: $font-semibold; }
}

.faltantes-table {
  background: $white; border: 1px solid $border-color; border-radius: 14px; overflow: hidden;
}

.faltantes-table__head {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr;
  padding: 0.75rem 1.25rem;
  background: $bg-page;
  border-bottom: 1px solid $border-color;
  font-family: $font-primary; font-size: 11px; font-weight: $font-bold;
  color: $text-gray; letter-spacing: 0.06em; text-transform: uppercase;
}

.faltantes-table__row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid $border-color;
  align-items: center;
  transition: background 0.12s;
  &:last-child { border-bottom: none; }
  &:hover { background: $bg-page; }
}

// Celda material: icono + nombre
.faltantes-table__material {
  display: flex; align-items: center; gap: 0.75rem;
}

.faltantes-table__icon {
  width: 36px; height: 36px; border-radius: 8px;
  background: $material-faltante-icon-bg;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  svg { width: 18px; height: 18px; color: $primary-red; }
}

.faltantes-table__name {
  font-family: $font-primary; font-size: 13.5px; font-weight: $font-semibold; color: $text-dark;
}

.faltantes-table__ubicacion {
  font-family: $font-primary; font-size: 13px; color: $text-gray;
}

.faltantes-table__diff {
  font-family: $font-primary; font-size: 13.5px; font-weight: $font-bold; color: $primary-red;
}

.page__footer { display: flex; justify-content: flex-end; gap: 0.75rem; }

.btn-back {
  padding: 0.75rem 1.5rem; background: $white; color: $primary-red;
  border: 1.5px solid $primary-red; border-radius: 10px;
  font-family: $font-primary; font-size: 14px; font-weight: $font-semibold;
  cursor: pointer; transition: background 0.15s;
  &:hover { background: rgba($primary-red, 0.04); }
}

.btn-next {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1.5rem; background: $primary-red; color: $white;
  border: none; border-radius: 10px;
  font-family: $font-primary; font-size: 14px; font-weight: $font-semibold;
  cursor: pointer; transition: filter 0.15s;
  svg { width: 16px; height: 16px; }
  &:hover { filter: brightness(0.9); }
}
</style>