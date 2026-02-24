<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

withDefaults(defineProps<{
  currentStep: 1 | 2 | 3
  ambulanciaLabel?: string
  progress?: number
}>(), {
  ambulanciaLabel: '—',
  progress: 0,
})

defineEmits<{ guardar: [] }>()

const router = useRouter()

const currentTime = ref('')
let timer: ReturnType<typeof setInterval>

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => { updateTime(); timer = setInterval(updateTime, 1000) })
onUnmounted(() => clearInterval(timer))

const steps = [
  { id: 1, title: 'Selección de Ambulancia', subtitle: 'Unidad a inspeccionar' },
  { id: 2, title: 'Tipo de Servicio',        subtitle: 'Servicio realizado'    },
  { id: 3, title: 'Responsable',             subtitle: 'Nombre del técnico'    },
]
</script>

<template>
  <div class="insp-wrapper">

    <!-- ── Topbar ── -->
    <header class="topbar">
      <div class="topbar-brand">
        <img src="/logo1Rojo.png" alt="AmbuStock" />
      </div>
      <div class="topbar-divider" />

      <div class="topbar-vehicle">
        <span class="topbar-label">Inspeccionando</span>
        <span class="topbar-value">{{ ambulanciaLabel }}</span>
      </div>

      <div class="topbar-time">
        <span class="topbar-label">Hora actual</span>
        <span class="topbar-clock">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          {{ currentTime }}
        </span>
      </div>

      <div class="topbar-actions">
        <button class="btn-guardar" @click="$emit('guardar')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          Guardar
        </button>
        <button class="btn-salir" @click="$router.push('/principal')">Salir</button>
      </div>
    </header>

    <!-- ── Progreso ── -->
    <div class="progress-section">
      <div class="progress-meta">
        <span class="progress-label">Progreso de inspección</span>
        <span class="progress-pct">{{ progress }}% Completado</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: progress + '%' }" />
      </div>
    </div>

    <!-- ── Tabs de pasos ── -->
    <div class="steps-tabs">
      <div
        v-for="step in steps"
        :key="step.id"
        class="step-tab"
        :class="{
          'step-tab--active':    step.id === currentStep,
          'step-tab--completed': step.id < currentStep,
        }"
      >
        <!-- Truck -->
        <svg v-if="step.id === 1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="1" y="3" width="15" height="13" rx="1"/>
          <path d="M16 8h4l3 3v5h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
        <!-- Document -->
        <svg v-else-if="step.id === 2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <!-- Person -->
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>

        <div class="step-info">
          <span class="step-title">{{ step.title }}</span>
          <span class="step-subtitle">{{ step.subtitle }}</span>
        </div>
      </div>
    </div>

    <!-- ── Slot ── -->
    <div class="page-content">
      <slot />
    </div>

  </div>
</template>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';

.insp-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #f2f3f5;
}

/* ── Topbar ── */
.topbar {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 12px 28px;
  background: #fff;
  border-bottom: 1px solid #e4e6ea;

  @media (max-width: 768px) { display: none; }
}

.topbar-brand img { height: 36px; }

.topbar-divider {
  width: 1px;
  height: 28px;
  background: #e0e2e7;
}

.topbar-vehicle,
.topbar-time { display: flex; flex-direction: column; }

.topbar-label  { font-size: 10.5px; color: #9aa0ad; line-height: 1.2; }
.topbar-value  { font-size: 15px; font-weight: 700; color: $primary-red; line-height: 1.2; }

.topbar-clock {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  svg { width: 14px; height: 14px; }
}

.topbar-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
}

.btn-guardar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  background: #4a5568;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  svg { width: 14px; height: 14px; }
  &:hover { background: #2d3748; }
}

.btn-salir {
  background: none;
  border: none;
  color: #5a6072;
  font-size: 13.5px;
  cursor: pointer;
  &:hover { color: #222; }
}

/* ── Progreso ── */
.progress-section {
  padding: 10px 28px;
  background: #fff;
  border-bottom: 1px solid #e4e6ea;
}

.progress-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 7px;
}

.progress-label { font-size: 12px; color: #9aa0ad; }
.progress-pct   { font-size: 12px; font-weight: 600; color: $primary-red; }

.progress-track {
  height: 5px;
  background: #e8eaed;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: $primary-red;
  border-radius: 3px;
  transition: width 0.4s ease;
}

/* ── Tabs ── */
.steps-tabs {
  display: flex;
  background: #fff;
  border-bottom: 1px solid #e4e6ea;
  padding: 0 28px;
  overflow-x: auto;
}

.step-tab {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-bottom: 3px solid transparent;
  white-space: nowrap;

  svg          { width: 18px; height: 18px; color: #c8ccd4; flex-shrink: 0; }
  .step-title  { display: block; font-size: 12.5px; font-weight: 600; color: #b0b5c0; }
  .step-subtitle { display: block; font-size: 11px; color: #c8ccd4; margin-top: 1px; }

  &--completed {
    svg            { color: #7a8090; }
    .step-title    { color: #5a6072; }
    .step-subtitle { color: #9aa0ad; }
  }

  &--active {
    border-bottom-color: $primary-red;
    svg            { color: $primary-red; }
    .step-title    { color: #1a1d23; }
    .step-subtitle { color: #6b7280; }
  }
}

/* ── Contenido ── */
.page-content {
  flex: 1;
  padding: 28px 32px;
  overflow-y: auto;

  @media (max-width: 768px) { padding: 20px 16px; }
}
</style>
