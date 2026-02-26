<template>
  <div class="insp">

    <header class="insp__topbar">
      <div class="insp__brand">
        <img src="/logo1Rojo.png" alt="AmbuStock" />
      </div>
      <div class="insp__divider" />
      <div class="insp__meta">
        <span class="insp__meta-label">Inspeccionando</span>
        <span class="insp__meta-value">{{ ambulanciaLabel }}</span>
      </div>
      <div class="insp__meta">
        <span class="insp__meta-label">Hora</span>
        <span class="insp__meta-clock">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          {{ currentTime }}
        </span>
      </div>
      <div class="insp__topbar-right">
        <button class="insp__btn-save" @click="$emit('guardar')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          Guardar
        </button>
        <button class="insp__btn-exit" @click="$router.push('/principal')">Salir</button>
      </div>
    </header>

    <!-- Progreso -->
    <div class="insp__progress">
      <div class="insp__progress-info">
        <span>Progreso de inspección</span>
        <span class="insp__progress-pct">{{ progress }}%</span>
      </div>
      <div class="insp__progress-track">
        <div class="insp__progress-fill" :style="{ width: progress + '%' }" />
      </div>
    </div>

    <!-- Tabs pasos -->
    <div class="insp__steps">
      <div
        v-for="step in steps"
        :key="step.id"
        class="insp__step"
        :class="{
          'insp__step--done':   step.id < currentStep,
          'insp__step--active': step.id === currentStep
        }"
      >
        <div class="insp__step-num">
          <template v-if="step.id < currentStep">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </template>
          <template v-else>{{ step.id }}</template>
        </div>
        <div class="insp__step-info">
          <span class="insp__step-title">{{ step.title }}</span>
          <span class="insp__step-sub">{{ step.subtitle }}</span>
        </div>
      </div>
    </div>

    <!-- Contenido -->
    <div class="insp__body">
      <slot />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

withDefaults(defineProps<{
  currentStep: 1 | 2 | 3
  ambulanciaLabel?: string
  progress?: number
}>(), {
  ambulanciaLabel: '—',
  progress: 0
})

defineEmits<{ guardar: [] }>()

const currentTime = ref('')
let timer: ReturnType<typeof setInterval>

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => { updateTime(); timer = setInterval(updateTime, 1000) })
onUnmounted(() => clearInterval(timer))

const steps = [
  { id: 1, title: 'Selección de Ambulancia', subtitle: 'Unidad a inspeccionar' },
  { id: 2, title: 'Tipo de Servicio',        subtitle: 'Servicio realizado'    },
  { id: 3, title: 'Responsable',             subtitle: 'Nombre del técnico'    }
]
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.insp {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: $bg-page;
}

.insp__topbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 1.75rem;
  background: $white;
  border-bottom: 1px solid $border-color;
  flex-shrink: 0;
  @media (max-width: 768px) { display: none; }
}

.insp__brand img { height: 34px; }
.insp__divider { width: 1px; height: 24px; background: $border-color; }

.insp__meta {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.insp__meta-label {
  font-family: $font-primary;
  font-size: 10px;
  font-weight: $font-bold;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: $text-gray;
}

.insp__meta-value {
  font-family: $font-primary;
  font-size: 14px;
  font-weight: $font-bold;
  color: $primary-red;
}

.insp__meta-clock {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: $font-primary;
  font-size: 13px;
  font-weight: $font-semibold;
  color: $text-dark;
  svg { width: 13px; height: 13px; }
}

.insp__topbar-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.insp__btn-save {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0.4375rem 1rem;
  background: $blue-accent;
  color: $white;
  border: none;
  border-radius: 8px;
  font-family: $font-primary;
  font-size: 13px;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: filter 0.15s;
  svg { width: 13px; height: 13px; }
  &:hover { filter: brightness(0.9); }
}

.insp__btn-exit {
  background: none;
  border: none;
  font-family: $font-primary;
  font-size: 13px;
  font-weight: $font-semibold;
  color: $text-gray;
  cursor: pointer;
  padding: 0.4375rem 0.625rem;
  border-radius: 8px;
  transition: background 0.15s, color 0.15s;
  &:hover { background: $bg-page; color: $text-dark; }
}

.insp__progress {
  padding: 0.625rem 1.75rem;
  background: $white;
  border-bottom: 1px solid $border-color;
  flex-shrink: 0;
}

.insp__progress-info {
  display: flex;
  justify-content: space-between;
  font-family: $font-primary;
  font-size: 11.5px;
  color: $text-gray;
  margin-bottom: 5px;
}

.insp__progress-pct {
  font-weight: $font-bold;
  color: $primary-red;
}

.insp__progress-track {
  height: 4px;
  background: $border-color;
  border-radius: 99px;
  overflow: hidden;
}

.insp__progress-fill {
  height: 100%;
  background: $primary-red;
  border-radius: 99px;
  transition: width 0.4s ease;
}

.insp__steps {
  display: flex;
  background: $white;
  border-bottom: 1px solid $border-color;
  padding: 0 1.75rem;
  overflow-x: auto;
  flex-shrink: 0;
}

.insp__step {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  color: $text-gray;

  &--active {
    border-bottom-color: $primary-red;
    color: $text-dark;
    .insp__step-num {
      background: $primary-red;
      color: $white;
      border-color: $primary-red;
    }
    .insp__step-title { color: $text-dark; }
  }

  &--done {
    color: $text-dark;
    .insp__step-num {
      background: $green-accent;
      color: $white;
      border-color: $green-accent;
    }
    .insp__step-title { color: $text-dark; }
  }
}

.insp__step-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1.5px solid $border-color;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: $font-primary;
  font-size: 12px;
  font-weight: $font-bold;
  flex-shrink: 0;
  svg { width: 12px; height: 12px; }
}

.insp__step-info { display: flex; flex-direction: column; gap: 1px; }

.insp__step-title {
  font-family: $font-primary;
  font-size: 12.5px;
  font-weight: $font-bold;
  color: $text-gray;
}

.insp__step-sub {
  font-family: $font-primary;
  font-size: 11px;
  color: $text-gray;
  opacity: 0.7;
}

.insp__body {
  flex: 1;
  padding: 1.75rem 2rem;
  overflow-y: auto;
  @media (max-width: 768px) { padding: 1.25rem 1rem; }
}
</style>