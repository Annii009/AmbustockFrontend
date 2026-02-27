<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  getRevisionAmbulancia,
  guardarRevision,
  guardarEstadoRevision,
  cargarEstadoRevision,
  limpiarEstadoRevision,
  guardarMaterialesFaltantes,
  getAmbulanciaSeleccionada,
  getServicioSeleccionado,
  getNombreResponsable,
  getAmbulanciaById,
  type RevisionData,
  type Zona,
  type Material,
  ApiError
} from '@core/services/api'
import { useRevision } from '@core/composables/useRevision'

const router = useRouter()
const {
  contarTotalMateriales,
  contarMaterialesRevisados,
  inicializarCantidadesRevisadas,
  obtenerMaterialesFaltantes
} = useRevision()

// Estado — idéntico al mobile
const revisionData = ref<RevisionData | null>(null)
const ambulanciaId = ref<number | null>(null)
const ambulanciaNombre = ref<string>('')
const ambulanciaMatricula = ref<string>('')
const isLoading = ref(true)
const isReloading = ref(false)
const error = ref<string | null>(null)

// Paginación — idéntica al mobile
const ZONAS_POR_PAGINA = 10
const paginaActual = ref(1)

const totalPaginas = computed(() => {
  if (!revisionData.value) return 1
  return Math.ceil(revisionData.value.zonas.length / ZONAS_POR_PAGINA)
})

const zonasPaginadas = computed(() => {
  if (!revisionData.value) return []
  const inicio = (paginaActual.value - 1) * ZONAS_POR_PAGINA
  const fin = inicio + ZONAS_POR_PAGINA
  return revisionData.value.zonas.slice(inicio, fin)
})

const indexRealZona = (indexPagina: number): number => {
  return (paginaActual.value - 1) * ZONAS_POR_PAGINA + indexPagina
}

const irAPagina = (pagina: number) => {
  if (pagina >= 1 && pagina <= totalPaginas.value) {
    paginaActual.value = pagina
    // En desktop no hacemos scroll, cerramos el panel derecho
    zonaActual.value = null
    zonaActualIndex.value = null
  }
}

// Panel derecho (equivalente al modal del mobile)
// En mobile: isModalOpen + zonaActual + zonaActualIndex
// En desktop: zonaActual + zonaActualIndex (el panel siempre está visible)
const zonaActual = ref<Zona | null>(null)
const zonaActualIndex = ref<number | null>(null)

// Estado de cajones expandidos — idéntico al mobile
const cajonesExpandidos = ref<Record<string, boolean>>({})

const toggleCajon = (zonaIndex: number, cajonIndex: number) => {
  const key = `${zonaIndex}-${cajonIndex}`
  cajonesExpandidos.value[key] = !cajonesExpandidos.value[key]
}

const isCajonExpandido = (zonaIndex: number, cajonIndex: number): boolean => {
  const key = `${zonaIndex}-${cajonIndex}`
  return cajonesExpandidos.value[key] !== false
}

const inicializarCajones = (zona: Zona, zonaIndex: number) => {
  if (zona.cajones) {
    zona.cajones.forEach((_, cajonIndex) => {
      const key = `${zonaIndex}-${cajonIndex}`
      if (cajonesExpandidos.value[key] === undefined) {
        cajonesExpandidos.value[key] = true
      }
    })
  }
}

// Progreso — idéntico al mobile
const progresoTotal = computed(() => {
  if (!revisionData.value) return { porcentaje: 0, revisados: 0, total: 0 }

  let total = 0
  let revisados = 0

  revisionData.value.zonas.forEach(zona => {
    total += contarTotalMateriales(zona)
    revisados += contarMaterialesRevisados(zona)
  })

  const porcentaje = total > 0 ? Math.round((revisados / total) * 100) : 0
  return { porcentaje, revisados, total }
})

const progresoZona = (zona: Zona) => {
  const total = contarTotalMateriales(zona)
  const revisados = contarMaterialesRevisados(zona)
  const porcentaje = total > 0 ? Math.round((revisados / total) * 100) : 0
  return { porcentaje, revisados, total }
}

// Cargar — idéntico al mobile
const cargarRevision = async (recarga = false) => {
  try {
    if (recarga) {
      isReloading.value = true
    } else {
      isLoading.value = true
    }
    error.value = null

    ambulanciaId.value = getAmbulanciaSeleccionada()

    if (!ambulanciaId.value) {
      alert('No se ha seleccionado ninguna ambulancia')
      router.push('/principal/seleccion-ambulancia')
      return
    }

    const ambulancia = await getAmbulanciaById(ambulanciaId.value)
    if (ambulancia) {
      ambulanciaNombre.value = ambulancia.nombre || ''
      ambulanciaMatricula.value = ambulancia.matricula || ''
    }

    const data = await getRevisionAmbulancia(ambulanciaId.value)
    revisionData.value = data

    inicializarCantidadesRevisadas(revisionData.value.zonas)

    const estadoGuardado = cargarEstadoRevision(ambulanciaId.value)
    if (estadoGuardado) {
      mergeEstadoGuardado(estadoGuardado)
    }

    if (recarga) {
      paginaActual.value = 1
      zonaActual.value = null
      zonaActualIndex.value = null
    }

  } catch (err) {
    if (err instanceof ApiError) {
      error.value = err.message
    } else {
      error.value = 'Error al cargar revisión'
    }
    console.error('Error cargando revisión:', err)
  } finally {
    isLoading.value = false
    isReloading.value = false
  }
}

const mergeEstadoGuardado = (estadoData: RevisionData) => {
  if (!revisionData.value) return

  revisionData.value.zonas.forEach((zona, zIndex) => {
    if (zona.materiales && estadoData.zonas[zIndex]?.materiales) {
      zona.materiales.forEach((material, mIndex) => {
        if (estadoData.zonas[zIndex].materiales![mIndex]) {
          material.cantidadRevisada = estadoData.zonas[zIndex].materiales![mIndex].cantidadRevisada || 0
        }
      })
    }

    if (zona.cajones && estadoData.zonas[zIndex]?.cajones) {
      zona.cajones.forEach((cajon, cIndex) => {
        if (cajon.materiales && estadoData.zonas[zIndex].cajones![cIndex]?.materiales) {
          cajon.materiales.forEach((material, mIndex) => {
            if (estadoData.zonas[zIndex].cajones![cIndex].materiales![mIndex]) {
              material.cantidadRevisada = estadoData.zonas[zIndex].cajones![cIndex].materiales![mIndex].cantidadRevisada || 0
            }
          })
        }
      })
    }
  })
}

const guardarEstado = () => {
  if (revisionData.value && ambulanciaId.value) {
    guardarEstadoRevision(ambulanciaId.value, revisionData.value)
  }
}

// Equivalente a abrirModalZona en el mobile
const abrirZona = (zona: Zona, indexPagina: number) => {
  const indexReal = indexRealZona(indexPagina)
  zonaActual.value = zona
  zonaActualIndex.value = indexReal
  inicializarCajones(zona, indexReal)
}

// Cambiar cantidad — idéntico al mobile
const cambiarCantidad = (zonaIndex: number, cajonIndex: number | null, materialIndex: number, cambio: number) => {
  if (!revisionData.value) return

  let material: Material

  if (cajonIndex === null) {
    material = revisionData.value.zonas[zonaIndex].materiales![materialIndex]
  } else {
    material = revisionData.value.zonas[zonaIndex].cajones![cajonIndex].materiales[materialIndex]
  }

  const nuevaCantidad = (material.cantidadRevisada || 0) + cambio

  if (nuevaCantidad >= 0 && nuevaCantidad <= material.cantidad) {
    material.cantidadRevisada = nuevaCantidad
    guardarEstado()
  }
}

const seleccionarCajon = (zonaIndex: number, cajonIndex: number) => {
  if (!revisionData.value) return

  const cajon = revisionData.value.zonas[zonaIndex].cajones![cajonIndex]
  if (cajon.materiales) {
    cajon.materiales.forEach(material => {
      material.cantidadRevisada = material.cantidad
    })
  }
  guardarEstado()
}

const seleccionarZonaCompleta = () => {
  if (!revisionData.value || zonaActualIndex.value === null) return

  const zona = revisionData.value.zonas[zonaActualIndex.value]

  if (zona.materiales) {
    zona.materiales.forEach(material => {
      material.cantidadRevisada = material.cantidad
    })
  }

  if (zona.cajones) {
    zona.cajones.forEach(cajon => {
      if (cajon.materiales) {
        cajon.materiales.forEach(material => {
          material.cantidadRevisada = material.cantidad
        })
      }
    })
  }

  guardarEstado()
}

const goBack = () => {
  if (confirm('¿Estás seguro de que quieres salir? El progreso se guardará automáticamente.')) {
    router.push('/principal/nombre-responsable')
  }
}

const finalizarRevision = async () => {
  try {
    if (!revisionData.value || !ambulanciaId.value) return

    const servicioId = getServicioSeleccionado()
    const nombreResponsable = getNombreResponsable()

    if (!servicioId || !nombreResponsable) {
      alert('Faltan datos para finalizar la revisión')
      return
    }

    const faltantes = obtenerMaterialesFaltantes(revisionData.value.zonas)
    guardarMaterialesFaltantes(faltantes)

    const revisionCompleta = {
      idAmbulancia: ambulanciaId.value,
      idServicio: servicioId,
      nombreResponsable: nombreResponsable,
      fechaRevision: new Date().toISOString(),
      zonas: revisionData.value.zonas
    }

    await guardarRevision(revisionCompleta)
    limpiarEstadoRevision(ambulanciaId.value)
    router.push('/principal/materiales-faltantes')

  } catch (err) {
    console.error('Error:', err)
    alert('Error al guardar la revisión: ' + (err instanceof Error ? err.message : 'Error desconocido'))
  }
}

onMounted(() => {
  cargarRevision()
})
</script>

<template>
  <div class="revision-desktop">

    <!-- ══ COLUMNA IZQUIERDA: lista de zonas (= pantalla mobile entera) ══ -->
    <div class="col-zonas">
      <div class="container">

        <!-- Header -->
        <div class="header">
          <button class="back-button" @click="goBack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button
            class="reload-button"
            @click="cargarRevision(true)"
            :disabled="isReloading"
            :class="{ spinning: isReloading }"
            title="Recargar revisión"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </button>
        </div>

        <h1>REVISIÓN DE AMBULANCIA</h1>

        <p v-if="ambulanciaNombre || ambulanciaMatricula" class="ambulancia-subtitulo">
          {{ ambulanciaNombre }}{{ ambulanciaMatricula ? ' · ' + ambulanciaMatricula : '' }}
        </p>

        <div v-if="isLoading" class="loading">Cargando revisión...</div>
        <div v-else-if="error" class="error-box">
          <span>{{ error }}</span>
          <button class="btn-retry" @click="cargarRevision(true)">Reintentar</button>
        </div>

        <template v-else-if="revisionData">

          <!-- Progreso total -->
          <div class="progress-section">
            <div class="progress-label">
              <span>Progreso total</span>
              <span>{{ progresoTotal.porcentaje }}%</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" :style="{ width: progresoTotal.porcentaje + '%' }" />
            </div>
          </div>

          <!-- Info paginación -->
          <div v-if="totalPaginas > 1" class="pagination-info">
            Mostrando {{ (paginaActual - 1) * 10 + 1 }}–{{ Math.min(paginaActual * 10, revisionData.zonas.length) }}
            de {{ revisionData.zonas.length }} zonas
          </div>

          <!-- Lista de zonas — mismo HTML que el mobile -->
          <div class="zonas-list">
            <div
              v-for="(zona, indexPagina) in zonasPaginadas"
              :key="indexRealZona(indexPagina)"
              class="zona-item"
              :class="{
                completed: progresoZona(zona).porcentaje === 100 && progresoZona(zona).total > 0,
                active: zonaActualIndex === indexRealZona(indexPagina)
              }"
              @click="abrirZona(zona, indexPagina)"
            >
              <div class="zona-content">
                <div class="zona-name">{{ zona.nombreZona }}</div>
                <div class="zona-progress-text">
                  {{ progresoZona(zona).revisados }}/{{ progresoZona(zona).total }} cajones revisados
                </div>
                <div class="zona-mini-bar">
                  <div class="zona-mini-fill" :style="{ width: progresoZona(zona).porcentaje + '%' }" />
                </div>
              </div>

              <div v-if="progresoZona(zona).porcentaje === 100 && progresoZona(zona).total > 0" class="zona-check">✓</div>
              <div v-else class="zona-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Paginación -->
          <div v-if="totalPaginas > 1" class="pagination">
            <button class="pagination-btn" :disabled="paginaActual === 1" @click="irAPagina(paginaActual - 1)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div class="pagination-pages">
              <button
                v-for="pagina in totalPaginas"
                :key="pagina"
                class="pagination-page"
                :class="{ active: pagina === paginaActual }"
                @click="irAPagina(pagina)"
              >{{ pagina }}</button>
            </div>
            <button class="pagination-btn" :disabled="paginaActual === totalPaginas" @click="irAPagina(paginaActual + 1)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>

          <button class="btn-finalizar" @click="finalizarRevision">
            Finalizar
          </button>

        </template>
      </div>
    </div>

    <!-- ══ COLUMNA DERECHA: el modal mobile convertido en panel fijo ══ -->
    <div class="col-modal">

      <!-- Estado vacío: ninguna zona seleccionada -->
      <div v-if="!zonaActual" class="panel-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
          <rect x="9" y="3" width="6" height="4" rx="1"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
        <p>Selecciona una zona para ver y revisar sus materiales</p>
      </div>

      <!-- Contenido zona activa — HTML exacto del modal mobile, sin el overlay ni el close -->
      <div v-else class="modal-content">

        <div class="modal-header">
          <h2>{{ zonaActual.nombreZona }}</h2>
        </div>

        <div class="modal-actions">
          <button class="btn-select-all" @click="seleccionarZonaCompleta">
            Seleccionar toda la zona
          </button>
        </div>

        <div class="modal-body">

          <!-- Cajones colapsables — idéntico al mobile -->
          <div v-if="zonaActual.cajones && zonaActual.cajones.length > 0">
            <div
              v-for="(cajon, cajonIndex) in zonaActual.cajones"
              :key="cajonIndex"
              class="cajon-section"
            >
              <div class="cajon-header" @click="toggleCajon(zonaActualIndex!, cajonIndex)">
                <div class="cajon-header-left">
                  <svg
                    class="cajon-chevron"
                    :class="{ rotated: isCajonExpandido(zonaActualIndex!, cajonIndex) }"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                  <h3>{{ cajon.nombreCajon }}</h3>
                </div>
                <button class="btn-select-cajon" @click.stop="seleccionarCajon(zonaActualIndex!, cajonIndex)">
                  Seleccionar cajón
                </button>
              </div>

              <div v-show="isCajonExpandido(zonaActualIndex!, cajonIndex)" class="cajon-materials">
                <div
                  v-for="(material, materialIndex) in cajon.materiales"
                  :key="materialIndex"
                  class="material-item"
                >
                  <div class="material-info">
                    <div class="material-name">{{ material.nombreProducto }}</div>
                    <div class="material-cantidad">Cantidad esperada: {{ material.cantidad }}</div>
                  </div>
                  <div class="quantity-controls">
                    <button
                      class="btn-quantity minus"
                      :disabled="(material.cantidadRevisada || 0) === 0"
                      @click="cambiarCantidad(zonaActualIndex!, cajonIndex, materialIndex, -1)"
                    >−</button>
                    <span class="quantity-value">{{ material.cantidadRevisada || 0 }}</span>
                    <button
                      class="btn-quantity plus"
                      :disabled="(material.cantidadRevisada || 0) >= material.cantidad"
                      @click="cambiarCantidad(zonaActualIndex!, cajonIndex, materialIndex, 1)"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Materiales directos — idéntico al mobile -->
          <div v-if="zonaActual.materiales && zonaActual.materiales.length > 0" class="materiales-directos">
            <div v-if="zonaActual.cajones && zonaActual.cajones.length > 0" class="materiales-directos-title">
              Materiales sueltos
            </div>
            <div
              v-for="(material, materialIndex) in zonaActual.materiales"
              :key="materialIndex"
              class="material-item"
            >
              <div class="material-info">
                <div class="material-name">{{ material.nombreProducto }}</div>
                <div class="material-cantidad">Cantidad esperada: {{ material.cantidad }}</div>
              </div>
              <div class="quantity-controls">
                <button
                  class="btn-quantity minus"
                  :disabled="(material.cantidadRevisada || 0) === 0"
                  @click="cambiarCantidad(zonaActualIndex!, null, materialIndex, -1)"
                >−</button>
                <span class="quantity-value">{{ material.cantidadRevisada || 0 }}</span>
                <button
                  class="btn-quantity plus"
                  :disabled="(material.cantidadRevisada || 0) >= material.cantidad"
                  @click="cambiarCantidad(zonaActualIndex!, null, materialIndex, 1)"
                >+</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

// ════════════════════════════════════════════════════════════
// Layout desktop: dos columnas
// ════════════════════════════════════════════════════════════
.revision-desktop {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 0;
  min-height: 100%;
}

// ── Columna izquierda ─────────────────────────────────────────
// Copia EXACTA de .revision-view + .container del mobile
.col-zonas {
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  background: $white;
}

.container {
  padding: 20px;
}

// ── Columna derecha ───────────────────────────────────────────
// Contiene el modal mobile pegado (sin overlay, sin animación de entrada)
.col-modal {
  overflow-y: auto;
  background: #fafafa;
  display: flex;
  flex-direction: column;
}

// Estado vacío del panel derecho
.panel-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 40px;
  color: $text-gray;

  svg {
    width: 56px;
    height: 56px;
    opacity: 0.2;
  }

  p {
    font-size: 15px;
    text-align: center;
    max-width: 240px;
    line-height: 1.5;
  }
}

// ════════════════════════════════════════════════════════════
// A partir de aquí: CSS copiado EXACTO del mobile
// ════════════════════════════════════════════════════════════

// Header
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.back-button,
.reload-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;

  svg {
    width: 24px;
    height: 24px;
    stroke: $text-dark;
  }

  &:hover { background: $menu-item-hover; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}

.reload-button.spinning svg {
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

h1 {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 4px;
  color: $text-dark;
}

.ambulancia-subtitulo {
  text-align: center;
  font-size: 13px;
  color: $text-gray;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  padding: 40px 20px;
  font-size: 16px;
  color: $text-gray;
}

.error-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 30px 20px;
  text-align: center;
  color: $error-text;
  font-size: 15px;
}

.btn-retry {
  padding: 10px 24px;
  background: $primary-red;
  color: $white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: $font-semibold;
  cursor: pointer;
  &:hover { background: $primary-red-hover; }
}

// Progreso total
.progress-section { margin-bottom: 16px; }

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: $text-gray;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background-color: $progress-bar-bg;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: $progress-bar-fill;
  border-radius: 4px;
  transition: width 0.3s ease;
}

// Info paginación
.pagination-info {
  font-size: 12px;
  color: $text-gray;
  text-align: right;
  margin-bottom: 12px;
}

// Zonas list — CSS idéntico al mobile
.zonas-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.zona-item {
  background: $white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid #ccc;

  &:hover { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }

  // Zona seleccionada actualmente en el panel derecho
  &.active {
    border-color: $primary-red;
    box-shadow: 0 0 0 2px rgba($primary-red, 0.15);
  }

  &.completed {
    background-color: $zona-completed-bg;
    border-color: $zona-completed-bg;
    color: $white;

    .zona-name          { color: $white; }
    .zona-progress-text { color: rgba(255, 255, 255, 0.8); }
    .zona-mini-bar      { background: rgba(255,255,255,0.3); }
    .zona-mini-fill     { background: $white; }
    .zona-check {
      background-color: $white;
      color: $zona-completed-bg;
    }
  }
}

.zona-content { flex: 1; }

.zona-name {
  font-size: 16px;
  font-weight: $font-semibold;
  margin-bottom: 4px;
  color: $text-dark;
}

.zona-progress-text {
  font-size: 13px;
  color: $text-gray;
  margin-bottom: 8px;
}

.zona-mini-bar {
  width: 100%;
  height: 3px;
  background: $progress-bar-bg;
  border-radius: 2px;
  overflow: hidden;
}

.zona-mini-fill {
  height: 100%;
  background: $progress-bar-fill;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.zona-arrow {
  display: flex;
  align-items: center;
  margin-left: 12px;
  svg { width: 20px; height: 20px; stroke: $text-gray; }
}

.zona-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: $zona-check-bg;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $white;
  font-size: 14px;
  margin-left: 12px;
  flex-shrink: 0;
}

// Paginación — idéntica al mobile
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.pagination-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid $border-gray;
  background: $white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  svg { width: 18px; height: 18px; stroke: $text-dark; }
  &:hover:not(:disabled) { background: $menu-item-hover; border-color: $text-gray; }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
}

.pagination-pages { display: flex; gap: 4px; }

.pagination-page {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid $border-gray;
  background: $white;
  cursor: pointer;
  font-size: 14px;
  font-weight: $font-semibold;
  color: $text-dark;
  transition: all 0.2s;

  &:hover:not(.active) { background: $menu-item-hover; }
  &.active { background: $primary-red; border-color: $primary-red; color: $white; }
}

// Botón finalizar — idéntico al mobile
.btn-finalizar {
  @include button-base;
  width: 100%;
  padding: 16px;
  background-color: $primary-red;
  color: $white;
  font-size: 16px;
  &:hover { background-color: $primary-red-hover; }
}

// ════════════════════════════════════════════════════════════
// CSS del modal mobile — se aplica al panel derecho
// Copiado exacto, sin .modal ni .modal-content wrapper de overlay
// ════════════════════════════════════════════════════════════

.modal-content {
  background: $white;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 12px;

  h2 {
    font-size: 18px;
    font-weight: $font-semibold;
    flex: 1;
    color: $text-dark;
  }
}

.modal-actions {
  padding: 12px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.btn-select-all {
  width: 100%;
  padding: 12px;
  background-color: $green-accent;
  color: $white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover { opacity: 0.9; }
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

// Cajones — idéntico al mobile
.cajon-section { margin-bottom: 16px; }

.cajon-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
  &:hover { background-color: #eeeeee; }
}

.cajon-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;

  h3 {
    font-size: 15px;
    font-weight: $font-semibold;
    color: $text-dark;
  }
}

.cajon-chevron {
  width: 18px;
  height: 18px;
  stroke: $text-gray;
  transition: transform 0.25s ease;
  flex-shrink: 0;
  &.rotated { transform: rotate(180deg); }
}

.btn-select-cajon {
  padding: 6px 12px;
  background-color: $green-accent;
  color: $white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: $font-semibold;
  cursor: pointer;
  margin-left: 8px;
  transition: opacity 0.2s;
  white-space: nowrap;
  &:hover { opacity: 0.9; }
}

.cajon-materials { padding-left: 8px; }

// Materiales — idéntico al mobile
.material-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  &:last-child { border-bottom: none; }
}

.material-info { flex: 1; }

.material-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: $text-dark;
}

.material-cantidad {
  font-size: 13px;
  color: $text-gray;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-quantity {
  width: $quantity-btn-size;
  height: $quantity-btn-size;
  border-radius: 50%;
  border: 2px solid $primary-red;
  background: $white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: $primary-red;
  transition: all 0.2s;

  &:hover:not(:disabled) { background-color: $primary-red; color: $white; }
  &:disabled { border-color: $progress-inactive; color: $progress-inactive; cursor: not-allowed; }
}

.quantity-value {
  min-width: 30px;
  text-align: center;
  font-size: 16px;
  font-weight: $font-semibold;
  color: $text-dark;
}

.materiales-directos { margin-top: 16px; }

.materiales-directos-title {
  font-size: 15px;
  font-weight: $font-semibold;
  margin-bottom: 12px;
  color: $text-dark;
}
</style>