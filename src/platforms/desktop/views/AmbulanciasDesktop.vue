<template>
  <div class="page">
    <div class="layout">

      <!-- PANEL IZQUIERDO: lista ambulancias -->
      <aside class="panel-left">
        <div class="panel-left__header">
          <h1 class="panel-left__title">AMBULANCIAS</h1>
          <button class="btn-new" @click="nuevaAmbulancia">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input v-model="search" type="text" placeholder="Buscar ambulancia..." />
        </div>

        <div v-if="loadingAmbs" class="panel-left__loading">
          <div class="spinner" />
        </div>

        <div v-else class="amb-list">
          <div v-for="amb in filteredAmbs" :key="amb.idAmbulancia" class="amb-item"
            :class="{ 'amb-item--active': selected?.idAmbulancia === amb.idAmbulancia }" @click="selectAmbulancia(amb)">
            <div class="amb-item__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13" rx="1" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div class="amb-item__text">
              <span class="amb-item__name">{{ amb.nombre?.trim() || `Ambulancia ${amb.matricula}` }}</span>
              <span class="amb-item__mat">{{ amb.matricula }}</span>
            </div>
            <span class="amb-item__id">#{{ String(amb.idAmbulancia).padStart(3, '0') }}</span>
          </div>

          <div v-if="filteredAmbs.length === 0" class="amb-empty">Sin resultados</div>
        </div>
      </aside>

      <!--  PANEL DERECHO: editor -->
      <main class="panel-right">

        <!-- Estado vacío -->
        <div v-if="!selected && !creando" class="empty-editor">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="1" y="3" width="15" height="13" rx="1" />
            <path d="M16 8h4l3 3v5h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <p>Selecciona una ambulancia o crea una nueva</p>
        </div>

        <template v-else>
          <!-- Header editor  -->
          <div class="editor-header">
            <div class="editor-header__left">
              <p class="editor-header__eyebrow">{{ creando ? 'NUEVA AMBULANCIA' : 'EDITANDO' }}</p>
              <h2 class="editor-header__title">
                {{ creando ? 'Crear ambulancia' : (selected?.nombre?.trim() || selected?.matricula) }}
              </h2>
            </div>
            <div class="editor-header__actions">
              <button v-if="!creando" class="btn-danger" @click="confirmarEliminar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Eliminar
              </button>
              <button class="btn-cancel-editor" @click="cancelarEditor">Cancelar</button>
              <button class="btn-save" :disabled="saving" @click="guardarAmbulancia">
                {{ saving ? 'Guardando...' : (creando ? 'Crear ambulancia' : 'Guardar cambios') }}
              </button>
            </div>
          </div>

          <!--Datos básicos -->
          <div class="section-card">
            <h3 class="section-title">Datos básicos</h3>
            <div class="form-row">
              <div class="form-field">
                <label>Nombre</label>
                <input v-model="form.nombre" type="text" placeholder="Ej: Ambulancia UVI Movil AM50" />
              </div>
              <div class="form-field">
                <label>Matrícula</label>
                <input v-model="form.matricula" type="text" placeholder="Ej: 2345-XYZ" />
              </div>
            </div>
          </div>

          <!-- ── Zonas y materiales ── -->
          <div class="section-card">
            <div class="section-header">
              <h3 class="section-title">Zonas y materiales</h3>
              <button class="btn-add-zona" @click="addZona">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Añadir zona
              </button>
            </div>

            <div v-if="form.zonas.length === 0" class="zonas-empty">
              No hay zonas. Añade una para empezar.
            </div>

            <!-- Zona -->
            <div v-for="(zona, zi) in form.zonas" :key="zi" class="zona-block">
              <div class="zona-block__header">
                <div class="zona-block__left">
                  <button class="zona-toggle" @click="zona._open = !zona._open">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                      :style="{ transform: zona._open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                  <input v-model="zona.nombreZona" class="zona-name-input" placeholder="Nombre de la zona"
                    @click.stop />
                </div>
                <div class="zona-block__right">
                  <span class="zona-count">
                    {{ contarMateriales(zona) }} mat.
                  </span>
                  <button class="btn-icon-sm btn-icon-sm--delete" @click="removeZona(zi)" title="Eliminar zona">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Contenido expandido -->
              <div v-if="zona._open" class="zona-block__body">

                <!-- Materiales directos de zona (sin cajón) -->
                <div class="materials-section">
                  <div class="materials-section__header">
                    <span class="materials-section__label">Materiales de zona</span>
                    <button class="btn-add-mat" @click="addMaterial(zona, null)">+ Material</button>
                  </div>
                  <div class="materials-table">
                    <div v-if="zona.materiales.length === 0" class="mat-empty">Sin materiales directos</div>
                    <div v-for="(mat, mi) in zona.materiales" :key="mi" class="mat-row">
                      <MaterialAutocomplete v-model="mat.nombreProducto" placeholder="Nombre del material"
                        :all-materials="allMaterialNames" />
                      <div class="mat-qty">
                        <label>Cant.</label>
                        <input v-model.number="mat.cantidad" type="number" min="0" class="mat-input mat-input--qty" />
                      </div>
                      <button class="btn-icon-sm btn-icon-sm--delete" @click="removeMaterial(zona.materiales, mi)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Cajones -->
                <div class="cajones-section">
                  <div class="cajones-section__header">
                    <span class="materials-section__label">Cajones</span>
                    <button class="btn-add-mat" @click="addCajon(zona)">+ Cajón</button>
                  </div>

                  <div v-for="(cajon, ci) in zona.cajones" :key="ci" class="cajon-block">
                    <div class="cajon-block__header">
                      <button class="zona-toggle zona-toggle--sm" @click="cajon._open = !cajon._open">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                          :style="{ transform: cajon._open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                      <input v-model="cajon.nombreCajon" class="cajon-name-input" placeholder="Nombre del cajón"
                        @click.stop />
                      <span class="zona-count">{{ cajon.materiales.length }} mat.</span>
                      <button class="btn-icon-sm btn-icon-sm--delete" @click="removeCajon(zona, ci)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    <div v-if="cajon._open" class="cajon-block__body">
                      <div class="materials-table">
                        <div v-if="cajon.materiales.length === 0" class="mat-empty">Sin materiales</div>
                        <div v-for="(mat, mi) in cajon.materiales" :key="mi" class="mat-row">
                          <MaterialAutocomplete v-model="mat.nombreProducto" placeholder="Nombre del material"
                            :all-materials="allMaterialNames" />
                          <div class="mat-qty">
                            <label>Cant.</label>
                            <input v-model.number="mat.cantidad" type="number" min="0"
                              class="mat-input mat-input--qty" />
                          </div>
                          <button class="btn-icon-sm btn-icon-sm--delete" @click="removeMaterial(cajon.materiales, mi)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <button class="btn-add-mat btn-add-mat--inline" @click="addMaterial(null, cajon)">+
                        Material</button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </template>
      </main>
    </div>

    <!-- MODAL CONFIRMAR ELIMINAR -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
          <div class="modal modal--sm">
            <div class="modal__danger-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h2 class="modal__title modal__title--center">
              ¿Eliminar<br><span class="modal__name">{{ selected?.nombre?.trim() || selected?.matricula }}</span>?
            </h2>
            <p class="modal__sub">Se eliminarán también todas sus zonas y materiales.</p>
            <div class="modal__footer modal__footer--center">
              <button class="btn-cancel" @click="showDeleteModal = false">Cancelar</button>
              <button class="btn-delete" :disabled="deleting" @click="eliminarAmbulancia">
                {{ deleting ? 'Eliminando...' : 'Eliminar' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@core/composables/useToast'
import { getAuthToken } from '@core/services/api'
import MaterialAutocomplete from './MaterialAutocomplete.vue'

const { toast } = useToast()

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002'

// Tipos locales 
interface MatForm { idMaterial?: number; nombreProducto: string; cantidad: number; _nuevo?: boolean }
interface CajonForm { idCajon?: number; nombreCajon: string; materiales: MatForm[]; _open: boolean; _nuevo?: boolean }
interface ZonaForm { idZona?: number; nombreZona: string; materiales: MatForm[]; cajones: CajonForm[]; _open: boolean; _nuevo?: boolean }
interface AmbForm { nombre: string; matricula: string; zonas: ZonaForm[] }
interface Ambulancia { idAmbulancia: number; nombre?: string; matricula?: string }

// estado
const ambulancias = ref<Ambulancia[]>([])
const selected = ref<Ambulancia | null>(null)
const creando = ref(false)
const loadingAmbs = ref(true)
const loadingDetail = ref(false)
const saving = ref(false)
const deleting = ref(false)
const showDeleteModal = ref(false)
const search = ref('')
const allMaterialNames = ref<string[]>([])

const form = ref<AmbForm>({ nombre: '', matricula: '', zonas: [] })

//  Computed
const filteredAmbs = computed(() => {
  const q = search.value.toLowerCase()
  return ambulancias.value.filter(a =>
    !q || (a.nombre || '').toLowerCase().includes(q) || (a.matricula || '').toLowerCase().includes(q)
  )
})

// API helpers
const headers = () => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'Content-Type': 'application/json'
})

const apiFetch = async (path: string, method = 'GET', body?: any) => {
  const res = await fetch(`${API_URL}${path}`, {
    method, headers: headers(),
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`)
  if (res.status === 204) return null
  return res.json()
}

// Cargar lista
const cargarAmbulancias = async () => {
  try {
    loadingAmbs.value = true
    ambulancias.value = await apiFetch('/api/Ambulancia')
  } catch (e) { console.error(e) }
  finally { loadingAmbs.value = false }
}

// Seleccionar ambulancia y cargar su estructura 
const selectAmbulancia = async (amb: Ambulancia) => {
  selected.value = amb
  creando.value = false
  loadingDetail.value = true
  form.value = { nombre: amb.nombre || '', matricula: amb.matricula || '', zonas: [] }

  try {
    // Cargar zonas
    const zonas: any[] = await apiFetch(`/api/Zona/ambulancia/${amb.idAmbulancia}`)

    form.value.zonas = await Promise.all(zonas.map(async z => {
      // Materiales directos de zona (sin cajón)
      const mats: any[] = await apiFetch(`/api/Material/zona/${z.idZona}`)
      const matsSinCajon = mats.filter(m => !m.idCajon).map(m => ({
        idMaterial: m.idMaterial, nombreProducto: m.nombreProducto, cantidad: m.cantidad
      }))

      // Cajones de la zona
      const cajones: any[] = await apiFetch(`/api/Cajon/zona/${z.idZona}`)
      const cajonesForm: CajonForm[] = await Promise.all(cajones.map(async c => {
        const cMats: any[] = await apiFetch(`/api/Material/cajon/${c.idCajon}`)
        return {
          idCajon: c.idCajon,
          nombreCajon: c.nombreCajon,
          _open: false,
          materiales: cMats.map(m => ({ idMaterial: m.idMaterial, nombreProducto: m.nombreProducto, cantidad: m.cantidad }))
        }
      }))

      return {
        idZona: z.idZona, nombreZona: z.nombreZona,
        materiales: matsSinCajon, cajones: cajonesForm, _open: false
      }
    }))
  } catch (e) { console.error(e) }
  finally { loadingDetail.value = false }
}

// Nueva ambulancia
const nuevaAmbulancia = () => {
  selected.value = null
  creando.value = true
  form.value = { nombre: '', matricula: '', zonas: [] }
}

const cancelarEditor = () => {
  creando.value = false
  selected.value = null
}

//  Helpers de árbol
const contarMateriales = (zona: ZonaForm) =>
  zona.materiales.length + zona.cajones.reduce((acc, c) => acc + c.materiales.length, 0)

const addZona = () => form.value.zonas.push(
  { nombreZona: '', materiales: [], cajones: [], _open: true, _nuevo: true }
)
const removeZona = (zi: number) => form.value.zonas.splice(zi, 1)

const addCajon = (zona: ZonaForm) => zona.cajones.push(
  { nombreCajon: '', materiales: [], _open: true, _nuevo: true }
)
const removeCajon = (zona: ZonaForm, ci: number) => zona.cajones.splice(ci, 1)

const addMaterial = (zona: ZonaForm | null, cajon: CajonForm | null) => {
  const list = cajon ? cajon.materiales : zona!.materiales
  list.push({ nombreProducto: '', cantidad: 1, _nuevo: true })
}
const removeMaterial = (list: MatForm[], mi: number) => list.splice(mi, 1)

// Guardar (crear o actualizar)
const guardarAmbulancia = async () => {
  if (!form.value.nombre?.trim()) {
    toast.warning('Campo obligatorio', 'El nombre es obligatorio'); return
  }
  if (!form.value.matricula?.trim()) {
    toast.warning('Campo obligatorio', 'La matrícula es obligatoria'); return
  }
  saving.value = true
  try {
    let ambId: number

    if (creando.value) {
      // Crear ambulancia
      const nueva = await apiFetch('/api/Ambulancia', 'POST', {
        nombre: form.value.nombre, matricula: form.value.matricula
      })
      ambId = nueva.idAmbulancia
    } else {
      // Actualizar ambulancia
      await apiFetch(`/api/Ambulancia/${selected.value!.idAmbulancia}`, 'PUT', {
        nombre: form.value.nombre, matricula: form.value.matricula
      })
      ambId = selected.value!.idAmbulancia
    }

    // Procesar zonas
    for (const zona of form.value.zonas) {
      let zonaId: number

      if (!zona.idZona) {
        const nz = await apiFetch('/api/Zona', 'POST', {
          nombreZona: zona.nombreZona, idAmbulancia: ambId
        })
        zonaId = nz.idZona
        zona.idZona = zonaId
      } else {
        await apiFetch(`/api/Zona/${zona.idZona}`, 'PUT', { nombreZona: zona.nombreZona, idAmbulancia: ambId })
        zonaId = zona.idZona
      }

      // Materiales directos de zona
      for (const mat of zona.materiales) {
        if (!mat.idMaterial) {
          await apiFetch('/api/Material', 'POST', {
            nombreProducto: mat.nombreProducto, cantidad: mat.cantidad, idZona: zonaId, idCajon: null
          })
        } else {
          await apiFetch(`/api/Material/${mat.idMaterial}`, 'PUT', {
            nombreProducto: mat.nombreProducto, cantidad: mat.cantidad
          })
        }
      }

      // Cajones
      for (const cajon of zona.cajones) {
        let cajonId: number

        if (!cajon.idCajon) {
          const nc = await apiFetch('/api/Cajon', 'POST', {
            nombreCajon: cajon.nombreCajon, idZona: zonaId
          })
          cajonId = nc.idCajon
          cajon.idCajon = cajonId
        } else {
          await apiFetch(`/api/Cajon/${cajon.idCajon}`, 'PUT', { nombreCajon: cajon.nombreCajon })
          cajonId = cajon.idCajon
        }

        // Materiales del cajón
        for (const mat of cajon.materiales) {
          if (!mat.idMaterial) {
            await apiFetch('/api/Material', 'POST', {
              nombreProducto: mat.nombreProducto, cantidad: mat.cantidad,
              idZona: zonaId, idCajon: cajonId
            })
          } else {
            await apiFetch(`/api/Material/${mat.idMaterial}`, 'PUT', {
              nombreProducto: mat.nombreProducto, cantidad: mat.cantidad
            })
          }
        }
      }
    }

    await cargarAmbulancias()

    if (creando.value) {
      creando.value = false
      toast.success('Ambulancia creada', 'La ambulancia se ha registrado correctamente')
    } else {
      toast.success('Cambios guardados', 'Los datos de la ambulancia se han actualizado')
    }
  } catch (e: any) {
    toast.error('Error al guardar', e.message)
  } finally {
    saving.value = false
  }
}

// Eliminar ambulancia
const confirmarEliminar = () => { showDeleteModal.value = true }

const eliminarAmbulancia = async () => {
  if (!selected.value) return
  deleting.value = true
  try {
    await apiFetch(`/api/Ambulancia/${selected.value.idAmbulancia}`, 'DELETE')
    showDeleteModal.value = false
    selected.value = null
    await cargarAmbulancias()
  } catch (e: any) {
    toast.error('Error al eliminar', e.message)
  } finally {
    deleting.value = false
  }
}

// Cargar todos los nombres de materiales para autocomplete
const cargarTodosMateriales = async () => {
  try {
    const mats: any[] = await apiFetch('/api/Material')
    const nombres = mats.map(m => m.nombreProducto as string).filter(Boolean)
    // Deduplicar e ignorar mayúsculas/minúsculas
    allMaterialNames.value = [...new Set(nombres.map(n => n.trim()))]
      .sort((a, b) => a.localeCompare(b))
  } catch (e) { console.error('Error cargando materiales para autocomplete', e) }
}

onMounted(() => {
  cargarAmbulancias()
  cargarTodosMateriales()
})
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $bg-page;
  overflow: hidden;
}

.layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

// Panel izquierdo 
.panel-left {
  width: 280px;
  flex-shrink: 0;
  background: $white;
  border-right: 1.5px solid $border-color;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-left__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.25rem 0.75rem;
}

.panel-left__title {
  font-family: $font-display;
  font-size: 28px;
  letter-spacing: $font-display-spacing;
  color: $text-dark;
  line-height: 1;
}

.btn-new {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: $primary-red;
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: filter 0.15s;
  flex-shrink: 0;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    filter: brightness(0.9);
  }
}

.search-box {
  position: relative;
  margin: 0 0.875rem 0.75rem;

  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 15px;
    height: 15px;
    color: $text-gray;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 2.25rem;
    border: 1.5px solid $border-color;
    border-radius: 8px;
    font-family: $font-primary;
    font-size: 13px;
    color: $text-dark;
    outline: none;
    background: $bg-page;

    &::placeholder {
      color: $text-gray;
    }

    &:focus {
      border-color: $primary-red;
      background: $white;
    }
  }
}

.panel-left__loading {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2.5px solid $border-color;
  border-top-color: $primary-red;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.amb-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 0.5rem 1rem;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: $border-color;
    border-radius: 3px;
  }
}

.amb-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.12s;
  margin-bottom: 2px;

  &:hover {
    background: $bg-page;
  }

  &--active {
    background: rgba($primary-red, 0.08);

    .amb-item__name {
      color: $primary-red;
    }

    .amb-item__icon svg {
      color: $primary-red;
    }
  }
}

.amb-item__icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: $bg-page;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
    color: $text-gray;
  }
}

.amb-item__text {
  flex: 1;
  min-width: 0;
}

.amb-item__name {
  display: block;
  font-family: $font-primary;
  font-size: 13px;
  font-weight: $font-semibold;
  color: $text-dark;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.amb-item__mat {
  display: block;
  font-family: $font-primary;
  font-size: 11px;
  color: $text-gray;
}

.amb-item__id {
  font-family: $font-display;
  font-size: 13px;
  color: $border-color;
  flex-shrink: 0;
}

.amb-empty {
  text-align: center;
  padding: 2rem 1rem;
  font-family: $font-primary;
  font-size: 13px;
  color: $text-gray;
}

// Panel derecho
.panel-right {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 1.75rem;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: $border-color;
    border-radius: 4px;
  }
}

.empty-editor {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
  color: $text-gray;

  svg {
    width: 64px;
    height: 64px;
    opacity: 0.2;
  }

  p {
    font-family: $font-primary;
    font-size: 15px;
  }
}

// Editor header
.editor-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.editor-header__eyebrow {
  font-family: $font-primary;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: $text-gray;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.editor-header__title {
  font-family: $font-display;
  font-size: 34px;
  letter-spacing: $font-display-spacing;
  color: $text-dark;
  line-height: 1;
}

.editor-header__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  border: 1.5px solid rgba(#e74c3c, 0.3);
  background: rgba(#e74c3c, 0.06);
  color: #e74c3c;
  font-family: $font-primary;
  font-size: 13px;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: all 0.15s;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    background: rgba(#e74c3c, 0.12);
    border-color: #e74c3c;
  }
}

.btn-cancel-editor {
  padding: 0.625rem 1rem;
  border-radius: 8px;
  border: 1.5px solid $border-color;
  background: $white;
  font-family: $font-primary;
  font-size: 13px;
  font-weight: $font-semibold;
  color: $text-gray;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: $primary-red;
    color: $primary-red;
  }
}

.btn-save {
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  border: none;
  background: $primary-red;
  color: $white;
  font-family: $font-primary;
  font-size: 13px;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: filter 0.15s;
  box-shadow: 0 4px 12px rgba($primary-red, 0.3);

  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

// Secciones
.section-card {
  background: $white;
  border: 1.5px solid $border-color;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-title {
  font-family: $font-display;
  font-size: 20px;
  letter-spacing: $font-display-spacing;
  color: $text-dark;
  margin-bottom: 1rem;
}

.section-header .section-title {
  margin-bottom: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  label {
    font-family: $font-primary;
    font-size: 11px;
    font-weight: $font-bold;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $text-gray;
  }

  input {
    padding: 0.625rem 0.875rem;
    border: 1.5px solid $border-color;
    border-radius: 8px;
    font-family: $font-primary;
    font-size: 14px;
    color: $text-dark;
    outline: none;
    transition: border-color 0.15s;

    &::placeholder {
      color: lighten($text-gray, 15%);
    }

    &:focus {
      border-color: $primary-red;
    }
  }
}

.btn-add-zona {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 8px;
  border: 1.5px solid $border-color;
  background: $white;
  font-family: $font-primary;
  font-size: 12.5px;
  font-weight: $font-semibold;
  color: $text-gray;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;

  svg {
    width: 13px;
    height: 13px;
  }

  &:hover {
    border-color: $primary-red;
    color: $primary-red;
  }
}

.zonas-empty {
  text-align: center;
  padding: 1.5rem;
  font-family: $font-primary;
  font-size: 13px;
  color: $text-gray;
}

// Zona block
.zona-block {
  border: 1.5px solid $border-color;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.625rem;
}

.zona-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 0.875rem;
  background: $bg-page;
  gap: 0.5rem;
}

.zona-block__left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.zona-block__right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.zona-toggle {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;

  svg {
    width: 14px;
    height: 14px;
    color: $text-gray;
  }

  &--sm svg {
    width: 12px;
    height: 12px;
  }
}

.zona-name-input,
.cajon-name-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-family: $font-primary;
  font-size: 13.5px;
  font-weight: $font-semibold;
  color: $text-dark;

  &::placeholder {
    color: $text-gray;
    font-weight: 400;
  }
}

.cajon-name-input {
  font-size: 13px;
}

.zona-count {
  font-family: $font-primary;
  font-size: 11px;
  color: $text-gray;
  background: $white;
  border: 1px solid $border-color;
  border-radius: 99px;
  padding: 0.1rem 0.5rem;
  white-space: nowrap;
}

.btn-icon-sm {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.12s;

  svg {
    width: 13px;
    height: 13px;
  }

  &--delete {
    color: $text-gray;

    &:hover {
      background: rgba(#e74c3c, 0.1);
      color: #e74c3c;
    }
  }
}

.zona-block__body {
  padding: 0.875rem;
  border-top: 1px solid $border-color;
}

// Materiales
.materials-section {
  margin-bottom: 0.875rem;
}

.materials-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.materials-section__label {
  font-family: $font-primary;
  font-size: 11px;
  font-weight: $font-bold;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: $text-gray;
}

.btn-add-mat {
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  border: 1px solid $border-color;
  background: $white;
  font-family: $font-primary;
  font-size: 12px;
  font-weight: $font-semibold;
  color: $text-gray;
  cursor: pointer;
  transition: all 0.12s;

  &:hover {
    border-color: $primary-red;
    color: $primary-red;
  }

  &--inline {
    margin-top: 0.5rem;
  }
}

.materials-table {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mat-empty {
  font-family: $font-primary;
  font-size: 12px;
  color: $text-gray;
  padding: 0.375rem 0;
  font-style: italic;
}

.mat-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: $bg-page;
  border-radius: 6px;
  padding: 0.375rem 0.5rem;
}

.mat-input {
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  font-family: $font-primary;
  font-size: 13px;
  color: $text-dark;
  outline: none;
  transition: all 0.12s;

  &:focus {
    background: $white;
    border-color: $primary-red;
  }

  &--name {
    flex: 1;
    padding: 0.25rem 0.5rem;

    &::placeholder {
      color: $text-gray;
    }
  }

  &--qty {
    width: 56px;
    padding: 0.25rem 0.375rem;
    text-align: center;
  }
}

.mat-qty {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-shrink: 0;

  label {
    font-family: $font-primary;
    font-size: 11px;
    color: $text-gray;
    white-space: nowrap;
  }
}

// Cajones
.cajones-section {}

.cajones-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.cajon-block {
  border: 1px solid $border-color;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.375rem;
}

.cajon-block__header {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.625rem;
  background: $white;
}

.cajon-block__body {
  padding: 0.625rem;
  border-top: 1px solid $border-color;
  background: $bg-page;
}

// Modal
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}

.modal {
  background: $white;
  border-radius: 20px;
  width: 100%;
  max-width: 560px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  &--sm {
    max-width: 400px;
  }
}

.modal__danger-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin: 1.75rem auto 0;
  background: rgba(#e74c3c, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
    color: #e74c3c;
  }
}

.modal__title {
  font-family: $font-display;
  font-size: 24px;
  letter-spacing: $font-display-spacing;
  color: $text-dark;
  line-height: 1.2;

  &--center {
    text-align: center;
    margin-top: 0.75rem;
    padding: 0 1.75rem;
  }
}

.modal__name {
  color: $primary-red;
}

.modal__sub {
  font-family: $font-primary;
  font-size: 13px;
  color: $text-gray;
  text-align: center;
  padding: 0.375rem 1.75rem 0;
}

.modal__footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.25rem 1.75rem 1.75rem;

  &--center {
    justify-content: center;
  }
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  border: 1.5px solid $border-color;
  background: $white;
  font-family: $font-primary;
  font-size: 14px;
  font-weight: $font-semibold;
  color: $text-gray;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: $primary-red;
    color: $primary-red;
  }
}

.btn-delete {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  border: none;
  background: #e74c3c;
  color: $white;
  font-family: $font-primary;
  font-size: 14px;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: filter 0.15s;
  box-shadow: 0 4px 14px rgba(#e74c3c, 0.25);

  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>