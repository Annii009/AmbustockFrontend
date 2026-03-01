<template>
  <div class="page">
    <div class="page__inner">

      <div class="page__header">
        <div>
          <p class="page__eyebrow">CUENTA</p>
          <h1 class="page__title">EDITAR PERFIL</h1>
        </div>
      </div>

      <div class="edit-grid">

        <!-- Formulario informacion personal -->
        <div class="card">
          <h3 class="card__title">Información personal</h3>

          <div class="info-rows">
            <div class="info-row">
              <label class="info-row__label">Nombre completo</label>
              <input
                v-model="nombre"
                type="text"
                class="info-row__input"
                placeholder="Tu nombre completo"
              >
            </div>
            <div class="info-row">
              <label class="info-row__label">Correo electrónico</label>
              <input
                v-model="email"
                type="email"
                class="info-row__input"
                placeholder="tu@email.com"
              >
            </div>
            <div class="info-row info-row--last">
              <label class="info-row__label">Rol</label>
              <input
                :value="rol"
                type="text"
                class="info-row__input info-row__input--disabled"
                disabled
              >
            </div>
          </div>
        </div>

        <!-- Cambiar contraseña -->
        <div class="card">
          <h3 class="card__title">Seguridad</h3>

          <div class="info-rows">
            <div class="info-row">
              <label class="info-row__label">Contraseña actual</label>
              <input
                type="password"
                class="info-row__input"
                placeholder="••••••••"
              >
            </div>
            <div class="info-row">
              <label class="info-row__label">Nueva contraseña</label>
              <input
                type="password"
                class="info-row__input"
                placeholder="••••••••"
              >
            </div>
            <div class="info-row info-row--last">
              <label class="info-row__label">Confirmar nueva contraseña</label>
              <input
                type="password"
                class="info-row__input"
                placeholder="••••••••"
              >
            </div>
          </div>
        </div>

      </div>

      <!-- Boton guardar -->
      <div class="actions">
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

      <!-- Toast exito -->
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUsuario } from '@core/services/api'

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

const guardar = async () => {
  if (!nombre.value.trim() || !email.value.trim()) return
  try {
    isSaving.value = true
    //llamada a la API para guardar cambios
    await new Promise(r => setTimeout(r, 600))
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

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.page {
  padding: 1.75rem 2rem;
  min-height: 100vh;
  background: $bg-page;
}

.page__inner {
  max-width: 900px;
  margin: 0 auto;
}

.page__header {
  margin-bottom: 1.5rem;
}

.page__eyebrow {
  font-family: $font-primary;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: $text-gray;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.page__title {
  font-family: $font-display;
  font-size: 42px;
  letter-spacing: $font-display-spacing;
  color: $text-dark;
  line-height: 1;
}

// Grid
.edit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
}

.card {
  background: $white;
  border: 1.5px solid $border-color;
  border-radius: 14px;
  padding: 1.5rem;
}

.card__title {
  font-family: $font-primary;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: $text-gray;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

// Info rows
.info-rows {
  border: 1.5px solid $border-color;
  border-radius: 10px;
  overflow: hidden;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid $border-color;

  &--last { border-bottom: none; }

  &__label {
    font-family: $font-primary;
    font-size: 11px;
    color: $text-gray;
  }

  &__input {
    border: none;
    outline: none;
    font-family: $font-primary;
    font-size: 14px;
    font-weight: $font-semibold;
    color: $text-dark;
    background: transparent;
    padding: 0;
    width: 100%;
    transition: color 0.15s;

    &::placeholder {
      color: #ccc;
      font-weight: 400;
    }

    &:focus {
      color: $primary-red;
    }

    &--disabled {
      color: $text-gray;
      cursor: not-allowed;
    }
  }
}

// Acciones
.actions {
  display: flex;
  justify-content: flex-end;
}

.btn-guardar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.75rem 2rem;
  background: $primary-red;
  color: $white;
  border: none;
  border-radius: 10px;
  font-family: $font-primary;
  font-size: 14px;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s, box-shadow 0.15s;

  &:not(:disabled):hover {
    background: $primary-red-hover;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 46, 46, 0.3);
  }

  &:disabled {
    background: #c4a4a4;
    cursor: not-allowed;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-spinner {
  width: 15px;
  height: 15px;
  animation: spin 0.8s linear infinite;
}

// Toast
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #1a1a1a;
  color: $white;
  padding: 12px 20px;
  border-radius: 12px;
  font-family: $font-primary;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 100;

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
  transform: translateY(8px);
}
</style>
