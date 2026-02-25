<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getServicios, saveServicioSeleccionado, type Servicio, ApiError } from '@core/services/api'
import DesktopInspectionLayout from '../layouts/DesktopInspectionLayout.vue'

const router = useRouter()

const servicios = ref<Servicio[]>([])
const servicioSeleccionado = ref<number | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

const isContinueDisabled = computed(() => !servicioSeleccionado.value)

const cargarServicios = async () => {
  try {
    isLoading.value = true
    error.value = null
    servicios.value = await getServicios()
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Error al cargar servicios'
  } finally {
    isLoading.value = false
  }
}

const goBack = () => router.push('/principal/seleccion-ambulancia')
const continuar = () => {
  if (servicioSeleccionado.value) {
    saveServicioSeleccionado(servicioSeleccionado.value)
    router.push('/principal/nombre-responsable')
  }
}

onMounted(() => cargarServicios())
</script>

<template>
  <DesktopInspectionLayout :current-step="2" :progress="33">
    <div class="step-wrapper">
      <div class="step-card">

        <div class="card-header">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div>
            <h2>TIPO DE SERVICIO</h2>
            <p>Selecciona el tipo de servicio realizado</p>
          </div>
        </div>

        <div class="card-body">
          <label for="servicio">Servicio <span class="required">*</span></label>
          <div class="select-wrapper">
            <select id="servicio" v-model="servicioSeleccionado" class="custom-select" :class="{ loading: isLoading }"
              :disabled="isLoading || !!error">
              <option v-if="isLoading" value="">Cargando...</option>
              <option v-else-if="error" value="">{{ error }}</option>
              <option v-else value="">Seleccionar servicio</option>
              <option v-for="s in servicios" :key="s.idServicio" :value="s.idServicio">
                {{ s.nombreServicio }}
              </option>
            </select>
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

.select-wrapper {
  margin-bottom: 22px;
}

.custom-select {
  width: 100%;
  padding: 12px 40px 12px 14px;
  font-size: 14.5px;
  border: 1.5px solid #d1d5de;
  border-radius: 8px;
  background: #fff;
  color: #2d3342;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: $primary-red;
    box-shadow: 0 0 0 3px rgba(137, 29, 26, 0.07);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.loading {
    color: #aaa;
    background-image: none;
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
