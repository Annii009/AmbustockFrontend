<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getUsuario,
  logout
} from '@core/services/api'

const router = useRouter()

const nombre = ref('')
const email = ref('')
const rol = ref('')
const isSaving = ref(false)
const showSuccess = ref(false)

const cargarDatos = () => {
  const usuario = getUsuario()
  if (!usuario) {
    router.push('/login')
    return
  }
  nombre.value = usuario.nombreResponsable || usuario.nombre || ''
  email.value = usuario.email || ''
  rol.value = usuario.rol || ''
}

const goBack = () => router.push('/perfil')

const guardar = async () => {
  if (!nombre.value.trim() || !email.value.trim()) return
  try {
    isSaving.value = true
    //llamada a la API para guardar cambios
    await new Promise(r => setTimeout(r, 600)) // simular espera
    showSuccess.value = true
    setTimeout(() => showSuccess.value = false, 2500)
  } catch (e) {
    console.error('Error al guardar perfil', e)
  } finally {
    isSaving.value = false
  }
}

onMounted(() => cargarDatos())
</script>

<template>
  <div class="perfil-view">
    <div class="container">

      <!-- Header -->
      <div class="header">
        <button class="back-button" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <img src="/logo1Rojo.png" alt="Ambustock" class="logo">
      </div>

      <h1>EDITAR PERFIL</h1>

      <!-- Formulario -->
      <div class="section">
        <h2 class="section-title">Información personal</h2>

        <div class="form-list">
          <div class="form-field">
            <label class="form-field__label">Nombre completo</label>
            <input
              v-model="nombre"
              type="text"
              class="form-field__input"
              placeholder="Tu nombre completo"
            >
          </div>

          <div class="form-field">
            <label class="form-field__label">Correo electrónico</label>
            <input
              v-model="email"
              type="email"
              class="form-field__input"
              placeholder="tu@email.com"
            >
          </div>

          <div class="form-field form-field--last">
            <label class="form-field__label">Rol</label>
            <input
              :value="rol"
              type="text"
              class="form-field__input form-field__input--disabled"
              disabled
            >
          </div>
        </div>
      </div>

      <!-- Cambiar contraseña -->
      <div class="section">
        <h2 class="section-title">Seguridad</h2>

        <div class="form-list">
          <div class="form-field">
            <label class="form-field__label">Contraseña actual</label>
            <input
              type="password"
              class="form-field__input"
              placeholder="••••••••"
            >
          </div>

          <div class="form-field">
            <label class="form-field__label">Nueva contraseña</label>
            <input
              type="password"
              class="form-field__input"
              placeholder="••••••••"
            >
          </div>

          <div class="form-field form-field--last">
            <label class="form-field__label">Confirmar nueva contraseña</label>
            <input
              type="password"
              class="form-field__input"
              placeholder="••••••••"
            >
          </div>
        </div>
      </div>

      <!-- Boton guardar -->
      <div class="section">
        <button
          class="btn-guardar"
          :disabled="isSaving || !nombre.trim() || !email.trim()"
          @click="guardar"
        >
          <svg v-if="isSaving" class="btn-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
          {{ isSaving ? 'Guardando...' : 'Guardar cambios' }}
        </button>
      </div>

      <!-- Toast éxito -->
      <transition name="toast">
        <div v-if="showSuccess" class="toast">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Cambios guardados correctamente
        </div>
      </transition>

    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.perfil-view {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: $white;
  min-height: 100vh;
  padding-bottom: 40px;
}

// Header
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: $white;
  border-bottom: 1px solid #f0f0f0;
}

.back-button {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
    color: $text-dark;
  }

  &:hover { opacity: 0.7; }
}

.logo {
  width: 50px;
  height: 50px;
}

h1 {
  font-size: 24px;
  font-weight: 700;
  color: $text-dark;
  text-align: center;
  text-transform: uppercase;
  padding: 30px 20px 10px;
}

// Sections
.section {
  margin: 20px 0;
  padding: 0 20px;
}

.section-title {
  font-size: 16px;
  font-weight: $font-semibold;
  color: $text-dark;
  margin-bottom: 12px;
}

// Form list
.form-list {
  background: $white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;

  &--last { border-bottom: none; }

  &__label {
    font-size: 12px;
    color: $text-gray;
    font-weight: 500;
  }

  &__input {
    border: none;
    outline: none;
    font-size: 15px;
    font-weight: 500;
    color: $text-dark;
    background: transparent;
    padding: 0;
    width: 100%;

    &::placeholder { color: #bbb; font-weight: 400; }

    &--disabled {
      color: $text-gray;
      cursor: not-allowed;
    }

    &:focus {
      color: $primary-red;
    }
  }
}

// Botón guardar
.btn-guardar {
  @include button-base;
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  background-color: #c4a4a4;
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:not(:disabled) {
    background-color: $primary-red;

    &:hover {
      background-color: $primary-red-hover;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 46, 46, 0.3);
    }
  }

  &:disabled { cursor: not-allowed; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-spinner {
  width: 16px;
  height: 16px;
  animation: spin 0.8s linear infinite;
}

// Toast
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #1a1a1a;
  color: $white;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 100;
  white-space: nowrap;

  svg {
    width: 16px;
    height: 16px;
    color: #71B48D;
    flex-shrink: 0;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

@media (max-width: 480px) {
  .container { padding-bottom: 30px; }
  h1 { font-size: 20px; }
}
</style>
