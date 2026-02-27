<template>
  <DesktopInspectionLayout :current-step="1" :ambulancia-label="ambulanciaLabel" :progress="0">
    <div class="step-wrap">
      <div class="step-card">
        <div class="step-card__head">
          <div class="step-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <rect x="1" y="3" width="15" height="13" rx="1" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div>
            <h2 class="step-card__title">SELECCIÓN DE AMBULANCIA</h2>
            <p class="step-card__sub">Selecciona la unidad que vas a reposicionar</p>
          </div>
        </div>
        <div class="step-card__body">
          <label class="field-label">Ambulancia <span class="req">*</span></label>
          <div class="select-wrap">
            <select v-model="ambulanciaSeleccionada" class="field-select" :class="{ loading: isLoading }"
              :disabled="isLoading || !!error">
              <option v-if="isLoading" value="">Cargando...</option>
              <option v-else-if="error" value="">{{ error }}</option>
              <option v-else value="">Seleccionar unidad</option>
              <option v-for="amb in ambulancias" :key="amb.idAmbulancia" :value="amb.idAmbulancia">
                {{ formatAmbulancia(amb) }}
              </option>
            </select>
          </div>
          <div class="btn-row">
            <button class="btn-back" @click="goBack">Atrás</button>
            <button class="btn-next" :disabled="!ambulanciaSeleccionada" @click="continuar">Continuar</button>
          </div>
        </div>
      </div>
    </div>
  </DesktopInspectionLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAmbulancias, saveAmbulanciaSeleccionada, type Ambulancia, ApiError } from '@core/services/api'
import DesktopInspectionLayout from '../layouts/DesktopInspectionLayout.vue'

const router = useRouter()
const ambulancias = ref<Ambulancia[]>([])
const ambulanciaSeleccionada = ref<number | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

const ambulanciaLabel = computed(() => {
  if (!ambulanciaSeleccionada.value) return '—'
  const a = ambulancias.value.find(a => a.idAmbulancia === ambulanciaSeleccionada.value)
  return a ? formatAmbulancia(a) : '—'
})

const formatAmbulancia = (a: Ambulancia) =>
  a.nombre?.trim() || (a.matricula?.trim() ? `Ambulancia ${a.matricula.trim()}` : `Ambulancia #${a.idAmbulancia}`)

onMounted(async () => {
  try { ambulancias.value = await getAmbulancias() }
  catch (e) { error.value = e instanceof ApiError ? e.message : 'Error al cargar' }
  finally { isLoading.value = false }
})

const goBack = () => router.push('/principal')
const continuar = () => {
  if (ambulanciaSeleccionada.value) {
    saveAmbulanciaSeleccionada(ambulanciaSeleccionada.value)
    router.push('/principal/tipo-servicio')
  }
}
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.step-wrap {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1rem;
}

.step-card {
  background: $white;
  border-radius: 14px;
  border: 1px solid $border-color;
  box-shadow: $shadow-card;
  width: 100%;
  max-width: 520px;
  overflow: hidden;
}

.step-card__head {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.375rem 1.5rem;
  border-bottom: 1px solid $border-color;
}

.step-card__icon {
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

.step-card__title {
  font-family: $font-display;
  font-size: 20px;
  letter-spacing: $font-display-spacing;
  color: $text-dark;
  margin: 0 0 3px;
  line-height: 1;
}

.step-card__sub {
  font-family: $font-primary;
  font-size: 12.5px;
  color: $text-gray;
  margin: 0;
}

.step-card__body {
  padding: 1.5rem;
}

.field-label {
  display: block;
  font-family: $font-primary;
  font-size: 12.5px;
  font-weight: $font-bold;
  color: $text-dark;
  margin-bottom: 0.4rem;
}

.req {
  color: $primary-red;
}

.select-wrap {
  margin-bottom: 1.375rem;
}

.field-select {
  width: 100%;
  padding: 0.6875rem 2.25rem 0.6875rem 0.8125rem;
  font-family: $font-primary;
  font-size: 14px;
  border: 1.5px solid $border-gray;
  border-radius: 9px;
  background: $white;
  color: $text-dark;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23555' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: $primary-red;
    box-shadow: 0 0 0 3px rgba($primary-red, 0.07);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.loading {
    color: $text-gray;
    background-image: none;
  }
}

.btn-row {
  display: flex;
  gap: 0.625rem;
}

.btn-back {
  flex: 1;
  padding: 0.75rem;
  background: $white;
  color: $primary-red;
  border: 1.5px solid $primary-red;
  border-radius: 9px;
  font-family: $font-primary;
  font-size: 14px;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba($primary-red, 0.04);
  }
}

.btn-next {
  @include button-base;
  flex: 1;
  padding: 0.75rem;
  background: $primary-red;
  color: $white;
  font-size: 14px;
  font-weight: $font-semibold;
  border-radius: 9px;

  &:not(:disabled):hover {
    background: $primary-red-hover;
  }

  &:disabled {
    background: $btn-disabled-bg;
    cursor: not-allowed;
  }
}
</style>