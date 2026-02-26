<template>
  <div class="success-page">
    <div class="success-page__card">

      <div class="success-icon">
        <svg viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="#71B48D" stroke-width="3" opacity="0.2"/>
          <circle cx="40" cy="40" r="28" fill="none" stroke="#71B48D" stroke-width="3"/>
          <path fill="none" stroke="#71B48D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
            d="M24 40 L34 50 L56 28"/>
        </svg>
      </div>

      <h1 class="success-page__title">¡MISIÓN CUMPLIDA!</h1>

      <p class="success-page__message">
        Tu revisión es fundamental para mantener nuestras ambulancias listas.<br>
        Puedes hacer una nueva revisión o ir al material gastado en el servicio.
      </p>

      <div class="success-page__actions">
        <button class="btn-primary" @click="router.push('/principal')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Volver al Dashboard
        </button>
        <button class="btn-secondary" @click="router.push('/principal/material-gastado')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          Material Gastado en el Servicio
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { limpiarDatosRevision } from '@core/services/api'

const router = useRouter()
onMounted(() => limpiarDatosRevision())
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.success-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: $bg-page;
  padding: 2rem;
}

.success-page__card {
  background: $white;
  border: 1px solid $border-color;
  border-radius: 20px;
  padding: 3rem 2.5rem;
  max-width: 560px;
  width: 100%;
  text-align: center;
  box-shadow: $shadow-card;
}

.success-icon {
  margin: 0 auto 1.5rem;
  width: 80px;
  height: 80px;
  svg { width: 80px; height: 80px; }
}

.success-page__title {
  font-family: $font-display;
  font-size: 42px;
  letter-spacing: $font-display-spacing;
  color: $text-dark;
  line-height: 1;
  margin-bottom: 1rem;
}

.success-page__message {
  font-family: $font-primary;
  font-size: 15px;
  color: $text-gray;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.success-page__actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: $primary-red;
  color: $white;
  border: none;
  border-radius: 12px;
  font-family: $font-primary;
  font-size: 15px;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: filter 0.15s;
  svg { width: 18px; height: 18px; }
  &:hover { filter: brightness(0.9); }
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: $white;
  color: $text-dark;
  border: 1.5px solid $border-color;
  border-radius: 12px;
  font-family: $font-primary;
  font-size: 15px;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: border-color 0.15s;
  svg { width: 18px; height: 18px; opacity: 0.6; }
  &:hover { border-color: $primary-red; color: $primary-red; }
}
</style>