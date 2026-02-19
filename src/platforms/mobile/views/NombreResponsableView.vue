<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { saveNombreResponsable, getUsuarios } from '@core/services/api'

const router = useRouter()

// Estado
const nombreResponsable = ref('')
const todosLosResponsables = ref<string[]>([])
const isSearching = ref(false)

// Carga todos los usuarios una sola vez al montar
onMounted(async () => {
  isSearching.value = true
  try {
    const usuarios = await getUsuarios()
    todosLosResponsables.value = usuarios.map(u => u.nombreUsuario)
  } catch (error) {
    console.error('Error cargando responsables', error)
  } finally {
    isSearching.value = false
  }
})

// Filtra localmente según lo que escribe el usuario
const sugerencias = computed(() => {
  const query = nombreResponsable.value.trim().toLowerCase()
  if (query.length < 2) return []
  return todosLosResponsables.value.filter(nombre =>
    nombre.toLowerCase().includes(query)
  )
})

// Controla si se muestra la lista
const mostrarLista = computed(() =>
  sugerencias.value.length > 0 && nombreResponsable.value.trim().length >= 2
)

// Computed
const isContinueDisabled = computed(() => nombreResponsable.value.trim().length < 2)

// Selecciona una sugerencia
const seleccionarSugerencia = (nombre: string) => {
  nombreResponsable.value = nombre
}

// Cierra el desplegable al hacer clic fuera
const cerrarSugerencias = () => {
  setTimeout(() => {
    // El computed mostrarLista se actualiza solo
    // Este timeout da tiempo al mousedown de seleccionarSugerencia
  }, 150)
}

// Resalta en rojo la parte que coincide con lo escrito
const resaltarCoincidencia = (nombre: string, query: string): string => {
  if (!query) return nombre
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return nombre.replace(regex, '<strong>$1</strong>')
}

// Navegación
const goBack = () => {
  router.push('/tipo-servicio')
}

const continuar = () => {
  const nombre = nombreResponsable.value.trim()
  if (nombre.length >= 2) {
    saveNombreResponsable(nombre)
    router.push('/revision')
  }
}
</script>

<template>
  <div class="nombre-responsable">
    <div class="container">
      <div class="header">
        <button class="back-button" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <img src="/logo1Rojo.png" alt="AmbuStock" class="logo-small">
      </div>

      <h1>NOMBRE DEL RESPONSABLE</h1>

      <div class="progress-container">
        <div class="progress-bar completed"></div>
        <div class="progress-bar completed"></div>
        <div class="progress-bar active"></div>
      </div>

      <div class="form-content">
        <label for="responsable">Responsable del servicio</label>

        <div class="autocomplete-wrapper">
          <div class="input-wrapper">
            <input
              type="text"
              id="responsable"
              v-model="nombreResponsable"
              class="custom-input"
              placeholder="Nombre del responsable del servicio"
              autocomplete="off"
              @keyup.enter="continuar"
              @blur="cerrarSugerencias"
            />
            <!-- Spinner mientras carga la lista inicial -->
            <span v-if="isSearching" class="input-spinner"></span>
          </div>

          <!-- Desplegable de sugerencias -->
          <ul v-if="mostrarLista" class="sugerencias-list">
            <li
              v-for="(nombre, index) in sugerencias"
              :key="index"
              class="sugerencia-item"
              @mousedown.prevent="seleccionarSugerencia(nombre)"
            >
              <span v-html="resaltarCoincidencia(nombre, nombreResponsable.trim())"></span>
            </li>
          </ul>
        </div>
      </div>

      <button
        class="btn-continuar"
        :disabled="isContinueDisabled"
        @click="continuar"
      >
        Continuar
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.nombre-responsable {
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 40px);
}

// Header
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
    color: $text-dark;
  }

  &:hover {
    opacity: 0.7;
  }
}

.logo-small {
  height: 50px;
}

// Título
h1 {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: $text-dark;
}

// Progress bar
.progress-container {
  display: flex;
  gap: 8px;
  margin-bottom: 40px;
  justify-content: center;
}

.progress-bar {
  height: 4px;
  width: 60px;
  background-color: $progress-inactive;
  border-radius: 2px;
  transition: background-color 0.3s;

  &.completed,
  &.active {
    background-color: $progress-active;
  }
}

// Form
.form-content {
  flex: 1;
}

label {
  display: block;
  font-size: 14px;
  font-weight: $font-semibold;
  margin-bottom: 8px;
  color: $text-dark;
}

// Autocomplete
.autocomplete-wrapper {
  position: relative;
  width: 100%;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.custom-input {
  width: 100%;
  padding: 14px 40px 14px 16px;
  font-size: 15px;
  border: 1px solid $select-border;
  border-radius: 8px;
  background-color: $input-bg;
  color: $text-dark;
  transition: all 0.3s;
  box-sizing: border-box;

  &::placeholder {
    color: $placeholder-color;
  }

  &:focus {
    outline: none;
    border-color: $primary-red;
    box-shadow: 0 0 0 3px rgba(137, 29, 26, 0.08);
  }
}

// Spinner dentro del input
.input-spinner {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border: 2px solid $spinner-border;
  border-top-color: $spinner-color;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: translateY(-50%) rotate(360deg); }
}

// Lista de sugerencias
.sugerencias-list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: $autocomplete-bg;
  border: 1px solid $autocomplete-border;
  border-radius: 8px;
  box-shadow: $dropdown-shadow;
  list-style: none;
  margin: 0;
  padding: 4px 0;
  z-index: 100;
  max-height: 220px;
  overflow-y: auto;
}

.sugerencia-item {
  padding: 12px 16px;
  font-size: 14px;
  color: $text-dark;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background-color: $autocomplete-hover;
  }

  &:active {
    background-color: $autocomplete-active;
  }

  // Resaltado de la parte coincidente
  :deep(strong) {
    color: $primary-red;
    font-weight: $font-bold;
  }
}

// Botón continuar
.btn-continuar {
  @include button-base;
  width: 100%;
  padding: 16px;
  background-color: $primary-red;
  color: $white;
  font-size: 16px;
  margin-top: auto;

  &:not(:disabled):hover {
    background-color: $primary-red-hover;
  }

  &:disabled {
    background-color: $btn-disabled-bg;
    cursor: not-allowed;
  }
}

// Responsive
@media (max-width: 480px) {
  .container {
    padding: 10px;
  }

  h1 {
    font-size: 18px;
  }

  .logo-small {
    height: 40px;
  }
}
</style>
