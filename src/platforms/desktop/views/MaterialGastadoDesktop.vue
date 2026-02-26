<template>
  <div class="page">
    <div class="page__inner">

      <div class="page__header">
        <div>
          <h1 class="page__title">MATERIAL GASTADO</h1>
          <p class="page__sub">Registra el material consumido durante el servicio</p>
        </div>
      </div>

      <div v-if="isLoading" class="loading-state"><div class="spinner" /></div>

      <div v-else class="form-grid">

        <!-- Columna izquierda: datos del servicio -->
        <div class="form-col">
          <div class="card">
            <h2 class="card__title">DATOS DEL SERVICIO</h2>

            <!-- Ambulancia -->
            <div class="field">
              <label class="field__label">Ambulancia <span class="req">*</span></label>
              <div class="select-wrap">
                <select v-model="ambulanciaSeleccionadaId" class="field__select">
                  <option :value="null">Seleccionar ambulancia</option>
                  <option v-for="a in allAmbulancias" :key="a.idAmbulancia" :value="a.idAmbulancia">
                    {{ a.nombre?.trim() || `Ambulancia ${a.matricula}` }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Servicio -->
            <div class="field">
              <label class="field__label">Servicio <span class="req">*</span></label>
              <div class="autocomplete-field">
                <input
                  v-model="searchServicio"
                  type="text"
                  class="field__input"
                  placeholder="Buscar servicio..."
                  @focus="showServicioAutocomplete = true"
                  @blur="() => setTimeout(() => showServicioAutocomplete = false, 150)"
                />
                <ul v-if="showServicioAutocomplete && serviciosFiltrados.length" class="autocomplete-list">
                  <li v-for="s in serviciosFiltrados" :key="s.idServicio"
                    class="autocomplete-list__item" @mousedown.prevent="seleccionarServicio(s)">
                    {{ s.nombreServicio }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Responsable -->
            <div class="field">
              <label class="field__label">Responsable <span class="req">*</span></label>
              <div class="autocomplete-field">
                <input
                  v-model="nombreResponsable"
                  type="text"
                  class="field__input"
                  placeholder="Nombre del responsable"
                  @blur="cerrarSugerenciasResponsable"
                />
                <span v-if="isSearchingResponsable" class="field__spinner" />
                <ul v-if="mostrarSugerenciasResponsable" class="autocomplete-list">
                  <li v-for="(s, i) in sugerenciasResponsable" :key="i"
                    class="autocomplete-list__item" @mousedown.prevent="seleccionarResponsable(s)"
                    v-html="highlight(s, nombreResponsable.trim())" />
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna derecha: materiales -->
        <div class="form-col">
          <div class="card">
            <h2 class="card__title">MATERIALES USADOS</h2>

            <!-- Buscador de material -->
            <div class="field">
              <label class="field__label">Añadir material</label>
              <div class="autocomplete-field">
                <input
                  v-model="searchMaterial"
                  type="text"
                  class="field__input"
                  placeholder="Buscar material..."
                  @focus="showMaterialAutocomplete = true"
                  @blur="() => setTimeout(() => showMaterialAutocomplete = false, 150)"
                />
                <ul v-if="showMaterialAutocomplete && materialesFiltrados.length" class="autocomplete-list">
                  <li v-for="m in materialesFiltrados" :key="m.idMaterial"
                    class="autocomplete-list__item" @mousedown.prevent="agregarMaterial(m)">
                    {{ m.nombreProducto }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Lista de materiales seleccionados -->
            <div v-if="materialesSeleccionados.length === 0" class="materials-empty">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              <p>No hay materiales añadidos</p>
            </div>

            <div v-else class="materials-list">
              <div v-for="(mat, i) in materialesSeleccionados" :key="i" class="material-item">
                <span class="material-item__name">{{ mat.nombreProducto }}</span>
                <div class="material-item__controls">
                  <button class="qty-btn" @click="cambiarCantidad(i, -1)">−</button>
                  <span class="qty-val">{{ mat.cantidad }}</span>
                  <button class="qty-btn" @click="cambiarCantidad(i, 1)">+</button>
                  <button class="remove-btn" @click="quitarMaterial(i)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer acciones -->
      <div class="page__footer">
        <button class="btn-back" @click="router.push('/principal')">Cancelar</button>
        <button class="btn-next" :disabled="!isFormValid" @click="guardar">
          Guardar Reposición
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
          </svg>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getMateriales, getServicios, getAmbulancias, searchResponsables,
  saveReposicionData, saveAmbulanciaSeleccionada,
  type MaterialProducto, type MaterialSeleccionado, type Servicio, type Ambulancia, ApiError
} from '@core/services/api'

const router = useRouter()

const allMateriales  = ref<MaterialProducto[]>([])
const allServicios   = ref<Servicio[]>([])
const allAmbulancias = ref<Ambulancia[]>([])
const isLoading      = ref(true)

const searchMaterial   = ref('')
const searchServicio   = ref('')
const nombreResponsable = ref('')
const ambulanciaSeleccionadaId = ref<number | null>(null)
const materialesSeleccionados  = ref<MaterialSeleccionado[]>([])
const showMaterialAutocomplete = ref(false)
const showServicioAutocomplete = ref(false)
const sugerenciasResponsable   = ref<string[]>([])
const isSearchingResponsable   = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(nombreResponsable, (val) => {
  if (val.trim().length < 2) { sugerenciasResponsable.value = []; return }
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    isSearchingResponsable.value = true
    try { sugerenciasResponsable.value = await searchResponsables(val.trim()) }
    catch { sugerenciasResponsable.value = [] }
    finally { isSearchingResponsable.value = false }
  }, 300)
})

const mostrarSugerenciasResponsable = computed(
  () => sugerenciasResponsable.value.length > 0 && nombreResponsable.value.trim().length >= 2
)
const materialesFiltrados = computed(() => {
  const q = searchMaterial.value.trim().toLowerCase()
  return q.length === 0 ? [] : allMateriales.value.filter(m => m.nombreProducto.toLowerCase().includes(q)).slice(0, 6)
})
const serviciosFiltrados = computed(() => {
  const q = searchServicio.value.trim().toLowerCase()
  return q.length === 0 ? [] : allServicios.value.filter(s => s.nombreServicio.toLowerCase().includes(q)).slice(0, 6)
})
const isFormValid = computed(() =>
  materialesSeleccionados.value.length > 0 &&
  searchServicio.value.trim().length > 0 &&
  nombreResponsable.value.trim().length > 0 &&
  ambulanciaSeleccionadaId.value !== null
)

const seleccionarResponsable = (n: string) => { nombreResponsable.value = n; sugerenciasResponsable.value = [] }
const cerrarSugerenciasResponsable = () => setTimeout(() => { sugerenciasResponsable.value = [] }, 150)
const seleccionarServicio = (s: Servicio) => { searchServicio.value = s.nombreServicio; showServicioAutocomplete.value = false }

const agregarMaterial = (m: MaterialProducto) => {
  const existe = materialesSeleccionados.value.find(x => x.idMaterial === m.idMaterial)
  if (existe) { existe.cantidad++; } else { materialesSeleccionados.value.push({ ...m, cantidad: 1 }) }
  searchMaterial.value = ''
}
const cambiarCantidad = (i: number, delta: number) => {
  const m = materialesSeleccionados.value[i]
  const nueva = (m.cantidad || 1) + delta
  if (nueva <= 0) materialesSeleccionados.value.splice(i, 1)
  else m.cantidad = nueva
}
const quitarMaterial = (i: number) => materialesSeleccionados.value.splice(i, 1)

const highlight = (text: string, q: string) =>
  text.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<strong>$1</strong>')

const guardar = async () => {
  if (!isFormValid.value || !ambulanciaSeleccionadaId.value) return
  saveAmbulanciaSeleccionada(ambulanciaSeleccionadaId.value)
  saveReposicionData({
    materiales: materialesSeleccionados.value,
    servicio: searchServicio.value,
    responsable: nombreResponsable.value
  })
  router.push('/principal/sugerencias')
}

onMounted(async () => {
  try {
    const [mat, serv, amb] = await Promise.all([getMateriales(), getServicios(), getAmbulancias()])
    allMateriales.value  = mat
    allServicios.value   = serv
    allAmbulancias.value = amb
  } catch { /* silencioso */ }
  finally { isLoading.value = false }
})
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.page { padding: 1.75rem 2rem; min-height: 100vh; background: $bg-page; }
.page__inner { max-width: 1400px; margin: 0 auto; }

.page__header { margin-bottom: 1.5rem; }
.page__title { font-family: $font-display; font-size: 38px; letter-spacing: $font-display-spacing; color: $text-dark; line-height: 1; margin-bottom: 0.25rem; }
.page__sub { font-family: $font-primary; font-size: 14px; color: $text-gray; }

.loading-state { display: flex; justify-content: center; padding: 4rem; }

@keyframes spin { to { transform: rotate(360deg); } }
.spinner { width: 28px; height: 28px; border: 3px solid $border-color; border-top-color: $primary-red; border-radius: 50%; animation: spin 0.8s linear infinite; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
}

.card { background: $white; border: 1px solid $border-color; border-radius: 14px; padding: 1.5rem; }
.card__title { font-family: $font-display; font-size: 22px; letter-spacing: $font-display-spacing; color: $text-dark; line-height: 1; margin-bottom: 1.25rem; }

.field { margin-bottom: 1rem; }
.field__label { display: block; font-family: $font-primary; font-size: 12.5px; font-weight: $font-bold; color: $text-dark; margin-bottom: 0.375rem; }
.req { color: $primary-red; }

.select-wrap select, .field__input, .field__select {
  width: 100%; padding: 0.6875rem 0.8125rem; font-family: $font-primary; font-size: 14px;
  border: 1.5px solid $border-gray; border-radius: 9px; background: $white; color: $text-dark;
  box-sizing: border-box; appearance: none; transition: border-color 0.15s;
  &::placeholder { color: $placeholder-color; }
  &:focus { outline: none; border-color: $primary-red; box-shadow: 0 0 0 3px rgba($primary-red, 0.06); }
}

.autocomplete-field { position: relative; }

.field__spinner {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  width: 14px; height: 14px; border: 2px solid $border-color; border-top-color: $primary-red;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}

.autocomplete-list {
  position: absolute; top: calc(100% + 4px); left: 0; right: 0;
  background: $white; border: 1px solid $border-color; border-radius: 9px;
  box-shadow: $shadow-dropdown; list-style: none; margin: 0; padding: 4px 0;
  z-index: 100; max-height: 200px; overflow-y: auto;
}

.autocomplete-list__item {
  padding: 0.5625rem 0.875rem; font-family: $font-primary; font-size: 13.5px; color: $text-dark;
  cursor: pointer; transition: background 0.12s;
  &:hover { background: $bg-page; }
  :deep(strong) { color: $primary-red; font-weight: $font-bold; }
}

.materials-empty {
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  padding: 2rem; color: $text-gray;
  svg { width: 36px; height: 36px; opacity: 0.3; }
  p { font-family: $font-primary; font-size: 13.5px; }
}

.materials-list { display: flex; flex-direction: column; gap: 0.5rem; }

.material-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.625rem 0.875rem; border-radius: 9px; border: 1px solid $border-color;
  transition: background 0.12s;
  &:hover { background: $bg-page; }
}

.material-item__name { font-family: $font-primary; font-size: 13.5px; font-weight: $font-semibold; color: $text-dark; flex: 1; }
.material-item__controls { display: flex; align-items: center; gap: 0.375rem; }

.qty-btn {
  width: 26px; height: 26px; border-radius: 6px; border: 1.5px solid $border-color;
  background: $white; cursor: pointer; font-size: 15px; font-weight: bold;
  display: flex; align-items: center; justify-content: center;
  transition: border-color 0.15s, color 0.15s;
  &:hover { border-color: $primary-red; color: $primary-red; }
}

.qty-val { min-width: 28px; text-align: center; font-family: $font-display; font-size: 18px; color: $text-dark; }

.remove-btn {
  width: 26px; height: 26px; border-radius: 6px; border: 1px solid $border-color;
  background: $white; cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: $text-gray; margin-left: 4px; transition: all 0.15s;
  svg { width: 12px; height: 12px; }
  &:hover { background: $primary-red; color: $white; border-color: $primary-red; }
}

.page__footer { display: flex; justify-content: flex-end; gap: 0.75rem; }

.btn-back {
  padding: 0.75rem 1.5rem; background: $white; color: $text-gray; border: 1.5px solid $border-color;
  border-radius: 10px; font-family: $font-primary; font-size: 14px; font-weight: $font-semibold;
  cursor: pointer; transition: background 0.15s;
  &:hover { background: $bg-page; }
}

.btn-next {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1.5rem; background: $primary-red; color: $white; border: none;
  border-radius: 10px; font-family: $font-primary; font-size: 14px; font-weight: $font-semibold;
  cursor: pointer; transition: filter 0.15s;
  svg { width: 16px; height: 16px; }
  &:not(:disabled):hover { filter: brightness(0.9); }
  &:disabled { background: $btn-disabled-bg; cursor: not-allowed; }
}
</style>