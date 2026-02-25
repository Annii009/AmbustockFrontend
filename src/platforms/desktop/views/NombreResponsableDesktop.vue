<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { saveNombreResponsable, searchResponsables } from '@core/services/api'
import DesktopInspectionLayout from '../layouts/DesktopInspectionLayout.vue'

const router = useRouter()

const nombreResponsable = ref('')
const sugerencias = ref<string[]>([])
const isSearching = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(nombreResponsable, (val) => {
  const q = val.trim()
  if (q.length < 2) { sugerencias.value = []; return }

  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    isSearching.value = true
    try {
      sugerencias.value = await searchResponsables(q)
    } catch (e) {
      console.error('Error buscando responsables', e)
      sugerencias.value = []
    } finally {
      isSearching.value = false
    }
  }, 300)
})

const mostrarLista = computed(() => sugerencias.value.length > 0 && nombreResponsable.value.trim().length >= 2)
const isContinueDisabled = computed(() => nombreResponsable.value.trim().length < 2)

const seleccionarSugerencia = (nombre: string) => {
  nombreResponsable.value = nombre
  sugerencias.value = []
}

const cerrarSugerencias = () => { setTimeout(() => { sugerencias.value = [] }, 150) }

const resaltarCoincidencia = (nombre: string, query: string): string => {
  if (!query) return nombre
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return nombre.replace(regex, '<strong>$1</strong>')
}

const goBack = () => router.push('/principal/tipo-servicio')
const continuar = () => {
  const nombre = nombreResponsable.value.trim()
  if (nombre.length >= 2) {
    saveNombreResponsable(nombre)
    router.push('/principal/revision')
  }
}
</script>

<template>
  <DesktopInspectionLayout :current-step="3" :progress="66">
    <div class="step-wrapper">
      <div class="step-card">

        <div class="card-header">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h2>NOMBRE DEL RESPONSABLE</h2>
            <p>Introduce el nombre del técnico responsable</p>
          </div>
        </div>

        <div class="card-body">
          <label for="responsable">Responsable del servicio <span class="required">*</span></label>

          <div class="autocomplete-wrapper">
            <div class="input-wrapper">
              <input id="responsable" type="text" v-model="nombreResponsable" class="custom-input"
                placeholder="Nombre del responsable del servicio" autocomplete="off" @keyup.enter="continuar"
                @blur="cerrarSugerencias" />
              <span v-if="isSearching" class="input-spinner" />
            </div>

            <ul v-if="mostrarLista" class="sugerencias-list">
              <li v-for="(nombre, idx) in sugerencias" :key="idx" class="sugerencia-item"
                @mousedown.prevent="seleccionarSugerencia(nombre)">
                <span v-html="resaltarCoincidencia(nombre, nombreResponsable.trim())" />
              </li>
            </ul>
          </div>

          <div class="btn-row">
            <button class="btn-atras" @click="goBack">Atrás</button>
            <button class="btn-continuar" :disabled="isContinueDisabled" @click="continuar">Continuar</button>
          </div>
        </div>

      </div>
    </div>
  </DesktopInspectionLayout>
</template>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.step-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 48px 24px;
  box-sizing: border-box;
}

.step-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.09);
  width: 100%;
  max-width: 560px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px 26px;
  border-bottom: 1px solid #f0f1f4;

  h2 {
    font-size: 17px;
    font-weight: 700;
    color: #1a1d23;
    margin: 0 0 3px;
  }

  p {
    font-size: 13px;
    color: #9aa0ad;
    margin: 0;
  }
}

.card-icon {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: $primary-red;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
}

.card-body {
  padding: 26px;
}

label {
  display: block;
  font-size: 13.5px;
  font-weight: 600;
  color: #2d3342;
  margin-bottom: 8px;
}

.required {
  color: $primary-red;
}

.autocomplete-wrapper {
  position: relative;
  margin-bottom: 22px;
}

.input-wrapper {
  position: relative;
}

.custom-input {
  width: 100%;
  padding: 12px 40px 12px 14px;
  font-size: 14.5px;
  border: 1.5px solid #d1d5de;
  border-radius: 8px;
  background: #fff;
  color: #2d3342;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &::placeholder {
    color: #aab0bc;
  }

  &:focus {
    outline: none;
    border-color: $primary-red;
    box-shadow: 0 0 0 3px rgba(137, 29, 26, 0.07);
  }
}

.input-spinner {
  position: absolute;
  right: 13px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  border: 2px solid #e0e2e7;
  border-top-color: $primary-red;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}

.sugerencias-list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #e0e2e7;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  list-style: none;
  margin: 0;
  padding: 4px 0;
  z-index: 100;
  max-height: 220px;
  overflow-y: auto;
}

.sugerencia-item {
  padding: 11px 16px;
  font-size: 13.5px;
  color: #2d3342;
  cursor: pointer;
  transition: background 0.12s;

  &:hover {
    background: #f7f8fa;
  }

  &:active {
    background: #f0f1f4;
  }

  :deep(strong) {
    color: $primary-red;
    font-weight: 700;
  }
}

.btn-row {
  display: flex;
  gap: 12px;
}

.btn-atras {
  flex: 1;
  padding: 13px;
  background: #fff;
  color: $primary-red;
  border: 1.5px solid $primary-red;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(137, 29, 26, 0.05);
  }
}

.btn-continuar {
  @include button-base;
  flex: 1;
  padding: 13px;
  background: $primary-red;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;

  &:not(:disabled):hover {
    background: $primary-red-hover;
  }

  &:disabled {
    background: #d0d4dc;
    cursor: not-allowed;
  }
}
</style>
