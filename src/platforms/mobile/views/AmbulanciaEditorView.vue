<template>
    <div class="view">

        <!-- Header -->
        <div class="header">
            <button class="back-btn" @click="goBack">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>
            <h1 class="header__title">{{ esNueva ? 'NUEVA AMBULANCIA' : 'EDITAR AMBULANCIA' }}</h1>
            <button v-if="!esNueva" class="delete-btn" @click="showDeleteModal = true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
            </button>
            <div v-else style="width:36px" />
        </div>

        <div v-if="loadingDetail" class="loading">
            <div class="spinner" />
        </div>

        <template v-else>

            <!-- Datos básicos -->
            <div class="section">
                <p class="section__label">DATOS BÁSICOS</p>
                <div class="card">
                    <div class="field">
                        <label>Nombre</label>
                        <input v-model="form.nombre" type="text" placeholder="Ej: Ambulancia UVI Movil AM50" />
                    </div>
                    <div class="field-sep" />
                    <div class="field">
                        <label>Matrícula</label>
                        <input v-model="form.matricula" type="text" placeholder="Ej: 2345-XYZ" />
                    </div>
                </div>
            </div>

            <!-- Zonas -->
            <div class="section">
                <div class="section__row">
                    <p class="section__label">ZONAS Y MATERIALES</p>
                    <button class="btn-add-small" @click="addZona">+ Zona</button>
                </div>

                <div v-if="form.zonas.length === 0" class="zonas-empty">
                    No hay zonas. Pulsa "+ Zona" para añadir.
                </div>

                <div v-for="(zona, zi) in form.zonas" :key="zi" class="zona-card">
                    <div class="zona-card__header" @click="zona._open = !zona._open">
                        <div class="zona-card__header-left">
                            <svg class="zona-chevron" :class="{ 'zona-chevron--open': zona._open }" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                            <span class="zona-card__name" v-if="!zona._editingName" @click.stop="startEditZonaName(zi)">
                                {{ zona.nombreZona || 'Nueva zona' }}
                            </span>
                            <input v-else v-model="zona.nombreZona" class="zona-name-input"
                                placeholder="Nombre de la zona" ref="zonaNameInput" @click.stop
                                @blur="zona._editingName = false" @keydown.enter="zona._editingName = false" />
                        </div>
                        <div class="zona-card__header-right" @click.stop>
                            <span class="zona-badge">{{ contarMateriales(zona) }}</span>
                            <button class="btn-icon-xs" @click="removeZona(zi)">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div v-if="zona._open" class="zona-card__body">

                        <!-- Materiales directos -->
                        <div class="subsection">
                            <div class="subsection__header">
                                <span class="subsection__label">Materiales de zona</span>
                                <button class="btn-add-tiny" @click="addMaterial(zona, null)">+ Material</button>
                            </div>
                            <div v-if="zona.materiales.length === 0" class="mat-empty">Sin materiales directos</div>
                            <div v-for="(mat, mi) in zona.materiales" :key="mi" class="mat-row">
                                <div class="mat-row__name">
                                    <MobileAutocomplete v-model="mat.nombreProducto" placeholder="Nombre del material"
                                        :all-materials="allMaterialNames" />
                                </div>
                                <div class="mat-row__qty">
<<<<<<< HEAD
                                    <input v-model.number="mat.cantidad" type="number" min="0" class="qty-input"
                                        @click.stop />
=======
                                    <input v-model.number="mat.cantidad" type="number" min="0" class="qty-input" />
>>>>>>> 9a575a61014939800250cb40094ba616620563fd
                                </div>

                                <!-- FOTO MATERIAL (móvil) -->
                                <div class="mat-foto-mobile">
                                    <template v-if="mat.fotoUrl && !mat._fotoPreview">
                                        <img :src="mat.fotoUrl" class="mat-foto-mobile__thumb"
                                            @click="fotoViewer = mat.fotoUrl" />
                                        <button class="mat-foto-mobile__remove" @click="quitarFoto(mat)">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                stroke-width="2.5">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </template>
                                    <template v-else-if="mat._fotoPreview">
                                        <img :src="mat._fotoPreview"
                                            class="mat-foto-mobile__thumb mat-foto-mobile__thumb--new" />
                                        <button class="mat-foto-mobile__remove" @click="quitarFoto(mat)">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                stroke-width="2.5">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </template>
                                    <template v-else>
                                        <label class="mat-foto-mobile__btn">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21 15 16 10 5 21" />
                                            </svg>
                                            <input type="file" accept="image/jpeg,image/png,image/webp"
                                                style="display:none" :disabled="!mat.idMaterial"
                                                @change="seleccionarFoto($event, mat)" />
                                        </label>
                                    </template>
                                </div>

                                <button class="btn-icon-xs" @click="removeMaterial(zona.materiales, mi)">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Cajones -->
                        <div class="subsection">
                            <div class="subsection__header">
                                <span class="subsection__label">Cajones</span>
                                <button class="btn-add-tiny" @click="addCajon(zona)">+ Cajón</button>
                            </div>

                            <div v-for="(cajon, ci) in zona.cajones" :key="ci" class="cajon-block">
                                <div class="cajon-block__header" @click="cajon._open = !cajon._open">
                                    <svg class="zona-chevron zona-chevron--sm"
                                        :class="{ 'zona-chevron--open': cajon._open }" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                    <span class="cajon-name" v-if="!cajon._editingName"
                                        @click.stop="cajon._editingName = true">
                                        {{ cajon.nombreCajon || 'Nuevo cajón' }}
                                    </span>
                                    <input v-else v-model="cajon.nombreCajon" class="cajon-name-input"
                                        placeholder="Nombre del cajón" @click.stop @blur="cajon._editingName = false"
                                        @keydown.enter="cajon._editingName = false" />
                                    <div class="cajon-block__right" @click.stop>
                                        <span class="zona-badge zona-badge--sm">{{ cajon.materiales.length }}</span>
                                        <button class="btn-icon-xs" @click="removeCajon(zona, ci)">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div v-if="cajon._open" class="cajon-block__body">
                                    <div v-if="cajon.materiales.length === 0" class="mat-empty">Sin materiales</div>
                                    <div v-for="(mat, mi) in cajon.materiales" :key="mi" class="mat-row">
                                        <div class="mat-row__name">
                                            <MobileAutocomplete v-model="mat.nombreProducto"
                                                placeholder="Nombre del material" :all-materials="allMaterialNames" />
                                        </div>
                                        <div class="mat-row__qty">
                                            <input v-model.number="mat.cantidad" type="number" min="0"
                                                class="qty-input" />
                                        </div>

                                        <!-- FOTO MATERIAL cajón (móvil) -->
                                        <div class="mat-foto-mobile">
                                            <template v-if="mat.fotoUrl && !mat._fotoPreview">
                                                <img :src="mat.fotoUrl" class="mat-foto-mobile__thumb"
                                                    @click="fotoViewer = mat.fotoUrl" />
                                                <button class="mat-foto-mobile__remove" @click="quitarFoto(mat)">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        stroke-width="2.5">
                                                        <line x1="18" y1="6" x2="6" y2="18" />
                                                        <line x1="6" y1="6" x2="18" y2="18" />
                                                    </svg>
                                                </button>
                                            </template>
                                            <template v-else-if="mat._fotoPreview">
                                                <img :src="mat._fotoPreview"
                                                    class="mat-foto-mobile__thumb mat-foto-mobile__thumb--new" />
                                                <button class="mat-foto-mobile__remove" @click="quitarFoto(mat)">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        stroke-width="2.5">
                                                        <line x1="18" y1="6" x2="6" y2="18" />
                                                        <line x1="6" y1="6" x2="18" y2="18" />
                                                    </svg>
                                                </button>
                                            </template>
                                            <template v-else>
                                                <label class="mat-foto-mobile__btn">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        stroke-width="2">
                                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                                        <polyline points="21 15 16 10 5 21" />
                                                    </svg>
                                                    <input type="file" accept="image/jpeg,image/png,image/webp"
                                                        style="display:none" :disabled="!mat.idMaterial"
                                                        @change="seleccionarFoto($event, mat)" />
                                                </label>
                                            </template>
                                        </div>

                                        <button class="btn-icon-xs" @click="removeMaterial(cajon.materiales, mi)">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                    <button class="btn-add-tiny btn-add-tiny--block" @click="addMaterial(null, cajon)">+
                                        Material</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div style="height: 100px" />
        </template>

        <!-- Botón guardar fijo  -->
        <div class="footer-btn">
            <button class="btn-save" :disabled="saving" @click="guardar">
                {{ saving ? 'Guardando...' : (esNueva ? 'Crear ambulancia' : 'Guardar cambios') }}
            </button>
        </div>

<<<<<<< HEAD
        <!-- Visor foto -->
        <Teleport to="body">
            <Transition name="modal">
                <div v-if="fotoViewer" class="modal-overlay foto-overlay" @click="fotoViewer = null">
                    <img :src="fotoViewer" class="foto-overlay__img" @click.stop />
                </div>
            </Transition>
        </Teleport>

=======
>>>>>>> 9a575a61014939800250cb40094ba616620563fd
        <!-- Modal eliminar -->
        <Teleport to="body">
            <Transition name="modal">
                <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
                    <div class="modal">
                        <div class="modal__icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path
                                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                        </div>
                        <h2 class="modal__title">¿ELIMINAR<br><span>{{ form.nombre || form.matricula }}</span>?</h2>
                        <p class="modal__sub">Se eliminarán también todas sus zonas y materiales.</p>
                        <div class="modal__btns">
                            <button class="modal__btn-cancel" @click="showDeleteModal = false">Cancelar</button>
                            <button class="modal__btn-delete" :disabled="deleting" @click="eliminar">
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
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@core/composables/useToast'
import { getAuthToken } from '@core/services/api'
import MobileAutocomplete from './MobileAutocomplete.vue'

const router = useRouter()
const route = useRoute()
const { toast } = useToast()

const idAmbulancia = computed(() => route.params.id ? Number(route.params.id) : null)
const esNueva = computed(() => !idAmbulancia.value)

interface MatForm {
  idMaterial?: number
  nombreProducto: string
  cantidad: number
  fotoUrl?: string | null
  _fotoFile?: File | null
  _fotoPreview?: string | null
}
interface CajonForm { idCajon?: number; nombreCajon: string; materiales: MatForm[]; _open: boolean; _editingName: boolean }
interface ZonaForm { idZona?: number; nombreZona: string; materiales: MatForm[]; cajones: CajonForm[]; _open: boolean; _editingName: boolean }
interface AmbForm { nombre: string; matricula: string; zonas: ZonaForm[] }

const form = ref<AmbForm>({ nombre: '', matricula: '', zonas: [] })
const loadingDetail = ref(false)
const saving = ref(false)
const deleting = ref(false)
const showDeleteModal = ref(false)
const allMaterialNames = ref<string[]>([])
const fotoViewer = ref<string | null>(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002'

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

<<<<<<< HEAD
const subirFotoMaterial = async (idMaterial: number, file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('foto', file)
  const res = await fetch(`${API_URL}/api/Material/${idMaterial}/foto`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getAuthToken()}` },
    body: formData
  })
  if (!res.ok) throw new Error(`Error subiendo foto: ${res.status}`)
  const data = await res.json()
  return data.fotoUrl
}
=======
// Cargar datos
const cargarDetalle = async () => {
    if (!idAmbulancia.value) return
    loadingDetail.value = true
    try {
        const amb = await apiFetch(`/api/Ambulancia/${idAmbulancia.value}`)
        form.value.nombre = amb.nombre || ''
        form.value.matricula = amb.matricula || ''
>>>>>>> 9a575a61014939800250cb40094ba616620563fd

const seleccionarFoto = (event: Event, mat: MatForm) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  mat._fotoFile = file
  mat._fotoPreview = URL.createObjectURL(file)
  input.value = ''
}

const quitarFoto = (mat: MatForm) => {
  if (mat._fotoPreview) {
    URL.revokeObjectURL(mat._fotoPreview)
    mat._fotoPreview = null
    mat._fotoFile = null
  } else if (mat.fotoUrl && mat.idMaterial) {
    fetch(`${API_URL}/api/Material/${mat.idMaterial}/foto`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    })
    mat.fotoUrl = null
  }
}

const cargarDetalle = async () => {
  if (!idAmbulancia.value) return
  loadingDetail.value = true
  try {
    const amb = await apiFetch(`/api/Ambulancia/${idAmbulancia.value}`)
    form.value.nombre = amb.nombre || ''
    form.value.matricula = amb.matricula || ''

    const zonas: any[] = await apiFetch(`/api/Zona/ambulancia/${idAmbulancia.value}`)
    form.value.zonas = await Promise.all(zonas.map(async z => {
      const mats: any[] = await apiFetch(`/api/Material/zona/${z.idZona}`)
      const matsSinCajon = mats.filter(m => !m.idCajon).map(m => ({
        idMaterial: m.idMaterial, nombreProducto: m.nombreProducto,
        cantidad: m.cantidad, fotoUrl: m.fotoUrl || null
      }))
      const cajones: any[] = await apiFetch(`/api/Cajon/zona/${z.idZona}`)
      const cajonesForm: CajonForm[] = await Promise.all(cajones.map(async c => {
        const cMats: any[] = await apiFetch(`/api/Material/cajon/${c.idCajon}`)
        return {
          idCajon: c.idCajon, nombreCajon: c.nombreCajon, _open: false, _editingName: false,
          materiales: cMats.map(m => ({
            idMaterial: m.idMaterial, nombreProducto: m.nombreProducto,
            cantidad: m.cantidad, fotoUrl: m.fotoUrl || null
          }))
        }
      }))
      return { idZona: z.idZona, nombreZona: z.nombreZona, materiales: matsSinCajon, cajones: cajonesForm, _open: false, _editingName: false }
    }))
  } catch (e) { console.error(e) }
  finally { loadingDetail.value = false }
}

const cargarTodosMateriales = async () => {
  try {
    const mats: any[] = await apiFetch('/api/Material')
    allMaterialNames.value = [...new Set(mats.map(m => m.nombreProducto as string).filter(Boolean).map(n => n.trim()))].sort((a, b) => a.localeCompare(b))
  } catch (e) { console.error(e) }
}

const contarMateriales = (zona: ZonaForm) =>
  zona.materiales.length + zona.cajones.reduce((acc, c) => acc + c.materiales.length, 0)

const addZona = () => form.value.zonas.push({ nombreZona: '', materiales: [], cajones: [], _open: true, _editingName: true })
const removeZona = (zi: number) => form.value.zonas.splice(zi, 1)
const addCajon = (zona: ZonaForm) => zona.cajones.push({ nombreCajon: '', materiales: [], _open: true, _editingName: true })
const removeCajon = (zona: ZonaForm, ci: number) => zona.cajones.splice(ci, 1)
const addMaterial = (zona: ZonaForm | null, cajon: CajonForm | null) =>
  (cajon ? cajon.materiales : zona!.materiales).push({ nombreProducto: '', cantidad: 1 })
const removeMaterial = (list: MatForm[], mi: number) => list.splice(mi, 1)
const startEditZonaName = (zi: number) => { form.value.zonas[zi]._editingName = true }

<<<<<<< HEAD
const guardar = async () => {
  if (!form.value.nombre?.trim() || !form.value.matricula?.trim()) return

  saving.value = true
  try {
    let ambId: number
    if (esNueva.value) {
      const nueva = await apiFetch('/api/Ambulancia', 'POST', { nombre: form.value.nombre, matricula: form.value.matricula })
      ambId = nueva.idAmbulancia
    } else {
      await apiFetch(`/api/Ambulancia/${idAmbulancia.value}`, 'PUT', { nombre: form.value.nombre, matricula: form.value.matricula })
      ambId = idAmbulancia.value!
=======
const startEditZonaName = async (zi: number) => {
    form.value.zonas[zi]._editingName = true
}

// ── Guardar ───────────────────────────────────────────────────
const guardar = async () => {
    if (!form.value.nombre?.trim()) {
        toast.warning('Campo obligatorio', 'El nombre es obligatorio'); return
    }
    if (!form.value.matricula?.trim()) {
        toast.warning('Campo obligatorio', 'La matrícula es obligatoria'); return
>>>>>>> 9a575a61014939800250cb40094ba616620563fd
    }

    for (const zona of form.value.zonas) {
      let zonaId: number
      if (!zona.idZona) {
        const nz = await apiFetch('/api/Zona', 'POST', { nombreZona: zona.nombreZona, idAmbulancia: ambId })
        zonaId = nz.idZona; zona.idZona = zonaId
      } else {
        await apiFetch(`/api/Zona/${zona.idZona}`, 'PUT', { nombreZona: zona.nombreZona, idAmbulancia: ambId })
        zonaId = zona.idZona
      }

      for (const mat of zona.materiales) {
        if (!mat.idMaterial) {
          const nm = await apiFetch('/api/Material', 'POST', { nombreProducto: mat.nombreProducto, cantidad: mat.cantidad, idZona: zonaId, idCajon: null })
          mat.idMaterial = nm.idMaterial
        } else {
          await apiFetch(`/api/Material/${mat.idMaterial}`, 'PUT', { nombreProducto: mat.nombreProducto, cantidad: mat.cantidad, idZona: zonaId, idCajon: null })
        }
        if (mat._fotoFile && mat.idMaterial) {
          mat.fotoUrl = await subirFotoMaterial(mat.idMaterial, mat._fotoFile)
          mat._fotoFile = null
          if (mat._fotoPreview) { URL.revokeObjectURL(mat._fotoPreview); mat._fotoPreview = null }
        }
      }

      for (const cajon of zona.cajones) {
        let cajonId: number
        if (!cajon.idCajon) {
          const nc = await apiFetch('/api/Cajon', 'POST', { nombreCajon: cajon.nombreCajon, idZona: zonaId })
          cajonId = nc.idCajon; cajon.idCajon = cajonId
        } else {
          await apiFetch(`/api/Cajon/${cajon.idCajon}`, 'PUT', { nombreCajon: cajon.nombreCajon })
          cajonId = cajon.idCajon
        }

        for (const mat of cajon.materiales) {
          if (!mat.idMaterial) {
            const nm = await apiFetch('/api/Material', 'POST', { nombreProducto: mat.nombreProducto, cantidad: mat.cantidad, idZona: zonaId, idCajon: cajonId })
            mat.idMaterial = nm.idMaterial
          } else {
            await apiFetch(`/api/Material/${mat.idMaterial}`, 'PUT', { nombreProducto: mat.nombreProducto, cantidad: mat.cantidad, idZona: zonaId, idCajon: cajonId })
          }
          if (mat._fotoFile && mat.idMaterial) {
            mat.fotoUrl = await subirFotoMaterial(mat.idMaterial, mat._fotoFile)
            mat._fotoFile = null
            if (mat._fotoPreview) { URL.revokeObjectURL(mat._fotoPreview); mat._fotoPreview = null }
          }
        }
<<<<<<< HEAD
      }
=======

        toast.success(esNueva.value ? 'Ambulancia creada' : 'Cambios guardados', 'Los datos se guardaron correctamente')
        router.push('/principal/ambulancias')
    } catch (e: any) {
        toast.error('Error al guardar', e.message)
    } finally {
        saving.value = false
>>>>>>> 9a575a61014939800250cb40094ba616620563fd
    }

    router.push('/principal/ambulancias')

  } catch (e) {
    console.error('Error al guardar:', e)
  } finally {
    saving.value = false
  }
}

<<<<<<< HEAD
const eliminar = async () => {
  deleting.value = true
  try {
    await apiFetch(`/api/Ambulancia/${idAmbulancia.value}`, 'DELETE')
    router.push('/principal/ambulancias')
  } catch (e) {
    console.error('Error al eliminar:', e)
  } finally {
    deleting.value = false
  }
=======
// Eliminar 
const eliminar = async () => {
    deleting.value = true
    try {
        await apiFetch(`/api/Ambulancia/${idAmbulancia.value}`, 'DELETE')
        router.push('/principal/ambulancias')
    } catch (e: any) {
        toast.error('Error al eliminar', e.message)
    } finally {
        deleting.value = false
    }
>>>>>>> 9a575a61014939800250cb40094ba616620563fd
}

const goBack = () => router.push('/principal/ambulancias')

onMounted(() => { cargarDetalle(); cargarTodosMateriales() })
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.view {
    min-height: 100vh;
    background: $bg-page;
    max-width: 480px;
    margin: 0 auto;
    padding-bottom: 100px;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: $white;
    border-bottom: 1px solid $border-color;
    position: sticky;
    top: 0;
    z-index: 10;
}

.back-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 8px;

    svg {
        width: 22px;
        height: 22px;
        color: $primary-red;
    }
}

.delete-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: rgba(#e74c3c, 0.08);
    cursor: pointer;
    border-radius: 8px;

    svg {
        width: 18px;
        height: 18px;
        color: #e74c3c;
    }
}

.header__title {
    font-family: $font-display;
    font-size: 18px;
    letter-spacing: $font-display-spacing;
    color: $text-dark;
}

.loading {
    display: flex;
    justify-content: center;
    padding: 48px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.spinner {
    width: 28px;
    height: 28px;
    border: 3px solid $border-color;
    border-top-color: $primary-red;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

.section {
    padding: 14px 16px 0;
}

.section__label {
    font-family: $font-primary;
    font-size: 11px;
    font-weight: $font-bold;
    letter-spacing: 0.08em;
    color: $text-gray;
    text-transform: uppercase;
    margin-bottom: 8px;
}

.section__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.card {
    background: $white;
    border-radius: 14px;
    border: 1.5px solid $border-color;
    overflow: hidden;
}

.field {
    padding: 12px 16px;

    label {
        display: block;
        font-family: $font-primary;
        font-size: 11px;
        font-weight: $font-bold;
        color: $text-gray;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-bottom: 4px;
    }

    input {
        width: 100%;
        border: none;
        outline: none;
        background: transparent;
        font-family: $font-primary;
        font-size: 15px;
        color: $text-dark;

        &::placeholder {
            color: lighten($text-gray, 15%);
        }
    }
}

.field-sep {
    height: 1px;
    background: $border-color;
    margin: 0 16px;
}

.btn-add-small {
    padding: 5px 12px;
    border-radius: 8px;
    border: 1.5px solid $border-color;
    background: $white;
    font-family: $font-primary;
    font-size: 13px;
    font-weight: $font-semibold;
    color: $primary-red;
    cursor: pointer;
    transition: all 0.15s;

    &:active {
        background: rgba($primary-red, 0.06);
    }
}

.btn-add-tiny {
    padding: 3px 10px;
    border-radius: 6px;
    border: 1px solid $border-color;
    background: $white;
    font-family: $font-primary;
    font-size: 12px;
    font-weight: $font-semibold;
    color: $text-gray;
    cursor: pointer;

    &:active {
        color: $primary-red;
        border-color: $primary-red;
    }

    &--block {
        display: block;
        width: 100%;
        margin-top: 6px;
    }
}

.btn-icon-xs {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    border: none;
    background: none;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    svg {
        width: 14px;
        height: 14px;
        color: $text-gray;
    }

    &:active svg {
        color: #e74c3c;
    }
}

.zonas-empty {
    text-align: center;
    padding: 24px;
    font-family: $font-primary;
    font-size: 13px;
    color: $text-gray;
    font-style: italic;
}

.zona-card {
    background: $white;
    border-radius: 14px;
    border: 1.5px solid $border-color;
    overflow: hidden;
    margin-bottom: 8px;
}

.zona-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 14px;
    cursor: pointer;

    &:active {
        background: $bg-page;
    }
}

.zona-card__header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
}

.zona-card__header-right {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
}

.zona-chevron {
    width: 18px;
    height: 18px;
    color: $text-gray;
    flex-shrink: 0;
    transition: transform 0.2s;

    &--open {
        transform: rotate(90deg);
    }

    &--sm {
        width: 15px;
        height: 15px;
    }
}

.zona-card__name {
    font-family: $font-primary;
    font-size: 14px;
    font-weight: $font-semibold;
    color: $text-dark;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
}

.zona-name-input,
.cajon-name-input {
    flex: 1;
    border: none;
    border-bottom: 1.5px solid $primary-red;
    outline: none;
    background: transparent;
    font-family: $font-primary;
    font-size: 14px;
    font-weight: $font-semibold;
    color: $text-dark;
    padding-bottom: 2px;

    &::placeholder {
        color: $text-gray;
        font-weight: 400;
    }
}

.cajon-name-input {
    font-size: 13px;
}

.zona-badge {
    background: $bg-page;
    border: 1px solid $border-color;
    border-radius: 99px;
    font-family: $font-primary;
    font-size: 11px;
    color: $text-gray;
    padding: 2px 8px;
    white-space: nowrap;

    &--sm {
        padding: 1px 6px;
        font-size: 10px;
    }
}

.zona-card__body {
    border-top: 1px solid $border-color;
    padding: 12px 14px;
    background: $bg-page;
}

.subsection {
    margin-bottom: 12px;

    &:last-child {
        margin-bottom: 0;
    }
}

.subsection__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
}

.subsection__label {
    font-family: $font-primary;
    font-size: 11px;
    font-weight: $font-bold;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $text-gray;
}

.mat-empty {
    font-family: $font-primary;
    font-size: 12px;
    color: $text-gray;
    font-style: italic;
    padding: 4px 0;
}

.mat-row {
    display: flex;
    align-items: center;
    gap: 8px;
    background: $white;
    border-radius: 8px;
    padding: 6px 10px;
    margin-bottom: 4px;
    border: 1px solid $border-color;
}

.mat-row__name {
    flex: 1;
    min-width: 0;
}

.mat-row__qty {
    flex-shrink: 0;
}

.qty-input {
    width: 48px;
    border: 1.5px solid $border-color;
    border-radius: 6px;
    font-family: $font-primary;
    font-size: 13px;
    color: $text-dark;
    text-align: center;
    padding: 3px 6px;
    outline: none;

    &:focus {
        border-color: $primary-red;
    }
}

//FOTO MÓVIL
.mat-foto-mobile {
    display: flex;
    align-items: center;
    gap: 3px;
    flex-shrink: 0;
}

.mat-foto-mobile__btn {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    border: 1.5px dashed $border-color;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: $text-gray;
    background: $bg-page;

    svg {
        width: 13px;
        height: 13px;
    }

    &:active {
        border-color: $primary-red;
        color: $primary-red;
    }
}

.mat-foto-mobile__thumb {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    object-fit: cover;
    border: 1.5px solid $border-color;

    &--new {
        border-color: $primary-red;
    }
}

.mat-foto-mobile__remove {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: none;
    background: rgba(#e74c3c, 0.12);
    color: #e74c3c;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;

    svg {
        width: 8px;
        height: 8px;
    }
}

// VISOR FOTO MÓVIL
.foto-overlay {
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.foto-overlay__img {
    max-width: 100%;
    max-height: 80vh;
    border-radius: 12px;
    object-fit: contain;
}

// CAJONES
.cajon-block {
    background: $white;
    border-radius: 10px;
    border: 1px solid $border-color;
    margin-bottom: 6px;
    overflow: hidden;
}

.cajon-block__header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 12px;
    cursor: pointer;

    &:active {
        background: $bg-page;
    }
}

.cajon-block__right {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    flex-shrink: 0;
}

.cajon-name {
    flex: 1;
    font-family: $font-primary;
    font-size: 13px;
    font-weight: $font-semibold;
    color: $text-dark;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.cajon-block__body {
    border-top: 1px solid $border-color;
    padding: 10px 12px;
    background: $bg-page;
}

// FOOTER
.footer-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px 20px;
    background: $white;
    border-top: 1px solid $border-color;
    max-width: 480px;
    margin: 0 auto;
}

.btn-save {
    width: 100%;
    padding: 16px;
    border-radius: 14px;
    border: none;
    background: $primary-red;
    color: $white;
    font-family: $font-primary;
    font-size: 16px;
    font-weight: $font-semibold;
    cursor: pointer;
    transition: filter 0.15s;
    box-shadow: 0 4px 16px rgba($primary-red, 0.3);

    &:active:not(:disabled) {
        filter: brightness(0.9);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

//MODAL
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 200;
}

.modal {
    background: $white;
    border-radius: 20px 20px 0 0;
    width: 100%;
    max-width: 480px;
    padding: 28px 24px 40px;
    text-align: center;
}

.modal__icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: rgba(#e74c3c, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;

    svg {
        width: 22px;
        height: 22px;
        color: #e74c3c;
    }
}

.modal__title {
    font-family: $font-display;
    font-size: 22px;
    letter-spacing: $font-display-spacing;
    color: $text-dark;
    line-height: 1.2;
    margin-bottom: 8px;

    span {
        color: $primary-red;
    }
}

.modal__sub {
    font-family: $font-primary;
    font-size: 13px;
    color: $text-gray;
    margin-bottom: 24px;
}

.modal__btns {
    display: flex;
    gap: 10px;
}

.modal__btn-cancel {
    flex: 1;
    padding: 14px;
    border-radius: 12px;
    border: 1.5px solid $border-color;
    background: $white;
    font-family: $font-primary;
    font-size: 15px;
    font-weight: $font-semibold;
    color: $text-gray;
    cursor: pointer;
}

.modal__btn-delete {
    flex: 1;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: #e74c3c;
    color: $white;
    font-family: $font-primary;
    font-size: 15px;
    font-weight: $font-semibold;
    cursor: pointer;

    &:disabled {
        opacity: 0.6;
    }
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
    transition: transform 0.25s ease;
}

.modal-enter-from .modal {
    transform: translateY(100%);
}

.modal-leave-to .modal {
    transform: translateY(100%);
}
</style>