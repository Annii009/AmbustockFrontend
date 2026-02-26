<template>
  <DesktopInspectionLayout
    :current-step="3"
    :ambulancia-label="ambulanciaNombre || ambulanciaMatricula || '—'"
    :progress="progreso"
    @guardar="guardarYContinuar"
  >
    <div class="revision">

      <!-- Error -->
      <div v-if="error" class="alert alert--error">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ error }}
      </div>

      <!-- Loading -->
      <div v-else-if="isLoading" class="loading-state">
        <div class="spinner" />
        <p>Cargando revisión...</p>
      </div>

      <template v-else-if="revisionData">

        <!-- Cabecera de progreso -->
        <div class="revision__summary">
          <div class="summary-stat">
            <span class="summary-stat__value">{{ contarMaterialesRevisados(revisionData) }}</span>
            <span class="summary-stat__label">Revisados</span>
          </div>
          <div class="summary-stat">
            <span class="summary-stat__value">{{ contarTotalMateriales(revisionData) }}</span>
            <span class="summary-stat__label">Total</span>
          </div>
          <div class="summary-stat">
            <span class="summary-stat__value summary-stat__value--red">{{ faltantes }}</span>
            <span class="summary-stat__label">Faltantes</span>
          </div>
          <div class="summary-stat">
            <span class="summary-stat__value">{{ revisionData.zonas.length }}</span>
            <span class="summary-stat__label">Zonas</span>
          </div>
        </div>

        <!-- Grid de zonas -->
        <div class="zones-grid">
          <div
            v-for="(zona, zi) in zonasPaginadas"
            :key="zi"
            class="zone-card"
          >
            <button class="zone-card__header" @click="toggleZona(zi)">
              <div class="zone-card__header-left">
                <span class="zone-card__name">{{ zona.nombre }}</span>
                <span class="zone-card__count">{{ zona.cajones?.length || 0 }} cajones</span>
              </div>
              <svg class="zone-card__chevron" :class="{ 'zone-card__chevron--open': zonaExpandida(zi) }"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            <div v-if="zonaExpandida(zi)" class="zone-card__body">
              <div
                v-for="(cajon, ci) in zona.cajones"
                :key="ci"
                class="cajon"
              >
                <button class="cajon__header" @click="toggleCajon(indexRealZona(zi), ci)">
                  <span class="cajon__name">{{ cajon.nombre }}</span>
                  <div class="cajon__header-right">
                    <span class="cajon__count">{{ cajon.materiales?.length || 0 }} materiales</span>
                    <svg :class="['cajon__chevron', { 'cajon__chevron--open': isCajonExpandido(indexRealZona(zi), ci) }]"
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </button>

                <div v-if="isCajonExpandido(indexRealZona(zi), ci)" class="cajon__materials">
                  <div v-for="(mat, mi) in cajon.materiales" :key="mi" class="material-row">
                    <div class="material-row__info">
                      <span class="material-row__name">{{ mat.nombre }}</span>
                      <span v-if="mat.cantidadMinima" class="material-row__min">Mín: {{ mat.cantidadMinima }}</span>
                    </div>
                    <div class="material-row__controls">
                      <button class="qty-btn" @click="decrementar(indexRealZona(zi), ci, mi)">−</button>
                      <span class="qty-value" :class="{ 'qty-value--low': (mat.cantidadRevisada ?? mat.cantidadMinima ?? 0) < (mat.cantidadMinima ?? 0) }">
                        {{ mat.cantidadRevisada ?? mat.cantidadMinima ?? 0 }}
                      </span>
                      <button class="qty-btn" @click="incrementar(indexRealZona(zi), ci, mi)">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <div v-if="totalPaginas > 1" class="pagination">
          <button class="pagination__btn" :disabled="paginaActual === 1" @click="irAPagina(paginaActual - 1)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button
            v-for="p in totalPaginas"
            :key="p"
            class="pagination__page"
            :class="{ 'pagination__page--active': p === paginaActual }"
            @click="irAPagina(p)"
          >{{ p }}</button>
          <button class="pagination__btn" :disabled="paginaActual === totalPaginas" @click="irAPagina(paginaActual + 1)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        <!-- Botón continuar -->
        <div class="revision__footer">
          <button class="btn-back" @click="router.push('/principal/nombre-responsable')">Atrás</button>
          <button class="btn-next" @click="guardarYContinuar">
            Finalizar Revisión
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

      </template>
    </div>
  </DesktopInspectionLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  getRevisionAmbulancia, guardarRevision, guardarEstadoRevision, cargarEstadoRevision,
  limpiarEstadoRevision, guardarMaterialesFaltantes, getAmbulanciaSeleccionada,
  getServicioSeleccionado, getNombreResponsable, getAmbulanciaById,
  type RevisionData, type Zona, ApiError
} from '@core/services/api'
import { useRevision } from '@core/composables/useRevision'
import DesktopInspectionLayout from '../layouts/DesktopInspectionLayout.vue'

const router = useRouter()
const { contarTotalMateriales, contarMaterialesRevisados, obtenerMaterialesFaltantes } = useRevision()

const revisionData       = ref<RevisionData | null>(null)
const ambulanciaNombre   = ref('')
const ambulanciaMatricula = ref('')
const isLoading          = ref(true)
const error              = ref<string | null>(null)
const paginaActual       = ref(1)
const ZONAS_POR_PAGINA   = 6 // más en desktop

const zonasExpandidas    = ref<Record<number, boolean>>({})
const cajonesExpandidos  = ref<Record<string, boolean>>({})

const totalPaginas = computed(() =>
  revisionData.value ? Math.ceil(revisionData.value.zonas.length / ZONAS_POR_PAGINA) : 1
)

const zonasPaginadas = computed(() => {
  if (!revisionData.value) return []
  const inicio = (paginaActual.value - 1) * ZONAS_POR_PAGINA
  return revisionData.value.zonas.slice(inicio, inicio + ZONAS_POR_PAGINA)
})

const indexRealZona = (i: number) => (paginaActual.value - 1) * ZONAS_POR_PAGINA + i

const faltantes = computed(() =>
  revisionData.value ? obtenerMaterialesFaltantes(revisionData.value).length : 0
)

const progreso = computed(() => {
  if (!revisionData.value) return 0
  const total    = contarTotalMateriales(revisionData.value)
  const revisados = contarMaterialesRevisados(revisionData.value)
  return total === 0 ? 0 : Math.round(revisados / total * 100)
})

const toggleZona    = (i: number) => { zonasExpandidas.value[i] = !zonasExpandidas.value[i] }
const zonaExpandida = (i: number) => !!zonasExpandidas.value[i]

const toggleCajon     = (zi: number, ci: number) => {
  const k = `${zi}-${ci}`
  cajonesExpandidos.value[k] = !cajonesExpandidos.value[k]
}
const isCajonExpandido = (zi: number, ci: number) => !!cajonesExpandidos.value[`${zi}-${ci}`]

const incrementar = (zi: number, ci: number, mi: number) => {
  const mat = revisionData.value?.zonas[zi]?.cajones[ci]?.materiales[mi]
  if (mat) { mat.cantidadRevisada = (mat.cantidadRevisada ?? mat.cantidadMinima ?? 0) + 1 }
}
const decrementar = (zi: number, ci: number, mi: number) => {
  const mat = revisionData.value?.zonas[zi]?.cajones[ci]?.materiales[mi]
  if (mat) { const v = (mat.cantidadRevisada ?? mat.cantidadMinima ?? 0); mat.cantidadRevisada = Math.max(0, v - 1) }
}

const irAPagina = (p: number) => {
  if (p >= 1 && p <= totalPaginas.value) {
    paginaActual.value = p
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const guardarYContinuar = async () => {
  if (!revisionData.value) return
  const faltantesList = obtenerMaterialesFaltantes(revisionData.value)
  guardarMaterialesFaltantes(faltantesList)
  await guardarRevision(revisionData.value)
  limpiarEstadoRevision()
  if (faltantesList.length > 0) {
    router.push('/principal/materiales-faltantes')
  } else {
    router.push('/principal/mision-cumplida')
  }
}

onMounted(async () => {
  try {
    const ambulanciaId = getAmbulanciaSeleccionada()
    const servicioId   = getServicioSeleccionado()
    if (!ambulanciaId || !servicioId) { router.push('/principal'); return }

    const ambulancia = await getAmbulanciaById(ambulanciaId)
    ambulanciaNombre.value    = ambulancia?.nombre || ''
    ambulanciaMatricula.value = ambulancia?.matricula || ''

    const savedState = cargarEstadoRevision()
    if (savedState) {
      revisionData.value = savedState
    } else {
      revisionData.value = await getRevisionAmbulancia(ambulanciaId, servicioId)
    }
    // Abrir primera zona por defecto
    if (revisionData.value?.zonas.length) zonasExpandidas.value[0] = true
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Error al cargar la revisión'
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.revision { display: flex; flex-direction: column; gap: 1.25rem; }

.alert {
  display: flex; align-items: center; gap: 0.625rem;
  padding: 0.875rem 1rem; border-radius: 10px;
  font-family: $font-primary; font-size: 14px;
  svg { width: 18px; height: 18px; flex-shrink: 0; }
  &--error { background: rgba($primary-red, 0.08); color: $primary-red; border: 1px solid rgba($primary-red, 0.2); }
}

.loading-state {
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  padding: 3rem; color: $text-gray;
  p { font-family: $font-primary; font-size: 14px; }
}

@keyframes spin { to { transform: rotate(360deg); } }
.spinner { width: 28px; height: 28px; border: 3px solid $border-color; border-top-color: $primary-red; border-radius: 50%; animation: spin 0.8s linear infinite; }

.revision__summary {
  display: flex; gap: 1rem;
  background: $white; border: 1px solid $border-color;
  border-radius: 12px; padding: 1rem 1.5rem;
}

.summary-stat {
  display: flex; flex-direction: column; align-items: center; gap: 2px; flex: 1;
  & + & { border-left: 1px solid $border-color; }
}

.summary-stat__value {
  font-family: $font-display; font-size: 32px; letter-spacing: $font-display-spacing; color: $text-dark; line-height: 1;
  &--red { color: $primary-red; }
}

.summary-stat__label { font-family: $font-primary; font-size: 12px; color: $text-gray; }

.zones-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.875rem;
  @media (max-width: 1100px) { grid-template-columns: 1fr; }
}

.zone-card {
  background: $white; border: 1px solid $border-color; border-radius: 12px; overflow: hidden;
}

.zone-card__header {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  padding: 0.875rem 1rem; background: transparent; border: none; cursor: pointer;
  transition: background 0.15s;
  &:hover { background: $bg-page; }
}

.zone-card__header-left { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; }
.zone-card__name { font-family: $font-primary; font-size: 14px; font-weight: $font-bold; color: $text-dark; }
.zone-card__count { font-family: $font-primary; font-size: 11.5px; color: $text-gray; }

.zone-card__chevron {
  width: 18px; height: 18px; color: $text-gray; flex-shrink: 0;
  transition: transform 0.2s;
  &--open { transform: rotate(180deg); }
}

.zone-card__body { border-top: 1px solid $border-color; }

.cajon { border-bottom: 1px solid $border-color; &:last-child { border-bottom: none; } }

.cajon__header {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  padding: 0.625rem 1rem; background: transparent; border: none; cursor: pointer;
  transition: background 0.15s;
  &:hover { background: $bg-page; }
}

.cajon__name { font-family: $font-primary; font-size: 13px; font-weight: $font-semibold; color: $text-dark; }
.cajon__header-right { display: flex; align-items: center; gap: 0.5rem; }
.cajon__count { font-family: $font-primary; font-size: 11px; color: $text-gray; }

.cajon__chevron {
  width: 14px; height: 14px; color: $text-gray; transition: transform 0.2s;
  &--open { transform: rotate(180deg); }
}

.cajon__materials { padding: 0.5rem 0; }

.material-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid rgba($border-color, 0.5);
  &:last-child { border-bottom: none; }
  &:hover { background: $bg-page; }
}

.material-row__info { display: flex; flex-direction: column; gap: 2px; }
.material-row__name { font-family: $font-primary; font-size: 13px; font-weight: $font-semibold; color: $text-dark; }
.material-row__min  { font-family: $font-primary; font-size: 11px; color: $text-gray; }

.material-row__controls { display: flex; align-items: center; gap: 0.5rem; }

.qty-btn {
  width: 28px; height: 28px; border-radius: 7px; border: 1.5px solid $border-color;
  background: $white; cursor: pointer; font-size: 16px; color: $text-dark;
  display: flex; align-items: center; justify-content: center; font-weight: bold;
  transition: border-color 0.15s, background 0.15s;
  &:hover { border-color: $primary-red; color: $primary-red; background: rgba($primary-red, 0.04); }
}

.qty-value {
  min-width: 32px; text-align: center;
  font-family: $font-display; font-size: 18px; color: $text-dark;
  &--low { color: $primary-red; }
}

.pagination {
  display: flex; justify-content: center; align-items: center; gap: 0.375rem; padding-top: 0.5rem;
}

.pagination__btn {
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; border-radius: 8px; border: 1px solid $border-color;
  background: $white; cursor: pointer; color: $text-dark; transition: all 0.15s;
  svg { width: 16px; height: 16px; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  &:not(:disabled):hover { border-color: $primary-red; color: $primary-red; }
}

.pagination__page {
  width: 34px; height: 34px; border-radius: 8px; border: 1px solid $border-color;
  background: $white; cursor: pointer; font-family: $font-primary; font-size: 13px;
  color: $text-dark; transition: all 0.15s;
  &--active { background: $primary-red; color: $white; border-color: $primary-red; }
  &:not(.pagination__page--active):hover { border-color: $primary-red; color: $primary-red; }
}

.revision__footer {
  display: flex; justify-content: flex-end; gap: 0.75rem;
  padding-top: 0.5rem;
}

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