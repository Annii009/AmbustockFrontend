<template>
  <div class="page">
    <div class="page__inner">

      <h1 class="page__title">PANEL DE ADMINISTRACIÓN</h1>
      <p class="page__sub">Bienvenido, {{ userName }}</p>

      <div class="admin-grid">

        <!-- Card accesos rapidos -->
        <div class="card">
          <h2 class="card__title">GESTIÓN</h2>
          <div class="action-list">
            <button class="action-item" @click="router.push('/principal/responsables')">
              <div class="action-item__icon action-item__icon--blue">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div class="action-item__text">
                <p class="action-item__name">Responsables</p>
                <p class="action-item__sub">Ver y gestionar técnicos</p>
              </div>
              <svg class="action-item__arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <button class="action-item" @click="router.push('/principal/ambulancias')">
              <div class="action-item__icon action-item__icon--red">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <rect x="1" y="3" width="15" height="13" rx="1" />
                  <path d="M16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div class="action-item__text">
                <p class="action-item__name">Ambulancias</p>
                <p class="action-item__sub">Parque de vehículos</p>
              </div>
              <svg class="action-item__arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <button class="action-item" @click="router.push('/principal/historial')">
              <div class="action-item__icon action-item__icon--green">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M3 3v5h5" />
                  <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
                </svg>
              </div>
              <div class="action-item__text">
                <p class="action-item__name">Historial completo</p>
                <p class="action-item__sub">Todas las reposiciones</p>
              </div>
              <svg class="action-item__arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Card info admin -->
        <div class="card">
          <h2 class="card__title">MI CUENTA</h2>
          <div class="admin-profile">
            <div class="admin-avatar"><span>{{ initials }}</span></div>
            <div>
              <p class="admin-name">{{ userName.toUpperCase() }}</p>
              <span class="admin-badge">Administrador</span>
            </div>
          </div>
          <div class="info-rows">
            <div class="info-row">
              <span class="info-row__label">Rol</span>
              <span class="info-row__value">Administrador</span>
            </div>
            <div class="info-row info-row--last">
              <span class="info-row__label">Acceso</span>
              <span class="info-row__value">Total</span>
            </div>
          </div>
          <button class="btn-logout" @click="handleLogout">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar Sesión
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUsuario, isAdmin, getNombreUsuario, logout } from '@core/services/api'

const router = useRouter()
const userName = ref('Admin')

const initials = computed(() =>
  userName.value.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
)

onMounted(() => {
  const usuario = getUsuario()
  if (!usuario) { router.push('/login'); return }
  if (!isAdmin()) { router.push('/principal'); return }
  userName.value = getNombreUsuario()
})

const handleLogout = () => { logout(); router.push('/login') }
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

.page__title {
  font-family: $font-display;
  font-size: 38px;
  letter-spacing: $font-display-spacing;
  color: $text-dark;
  line-height: 1;
  margin-bottom: 4px;
}

.page__sub {
  font-family: $font-primary;
  font-size: 14px;
  color: $text-gray;
  margin-bottom: 1.5rem;
}

.admin-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.25rem;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
}

.card {
  background: $white;
  border: 1px solid $border-color;
  border-radius: 14px;
  padding: 1.5rem;
}

.card__title {
  font-family: $font-display;
  font-size: 22px;
  letter-spacing: $font-display-spacing;
  color: $text-dark;
  line-height: 1;
  margin-bottom: 1.25rem;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 0.75rem;
  border-radius: 10px;
  border: 1px solid $border-color;
  background: $white;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  text-align: left;

  &:hover {
    border-color: $primary-red;
    background: rgba($primary-red, 0.02);
  }
}

.action-item__icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
  }

  &--blue {
    background: $blue-accent;
  }

  &--red {
    background: $primary-red;
  }

  &--green {
    background: $green-accent;
  }
}

.action-item__text {
  flex: 1;
}

.action-item__name {
  font-family: $font-primary;
  font-size: 14px;
  font-weight: $font-bold;
  color: $text-dark;
}

.action-item__sub {
  font-family: $font-primary;
  font-size: 12px;
  color: $text-gray;
  margin-top: 1px;
}

.action-item__arrow {
  width: 16px;
  height: 16px;
  color: $text-gray;
  flex-shrink: 0;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1.25rem;
}

.admin-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: $primary-red;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  span {
    font-family: $font-display;
    color: $white;
    font-size: 18px;
    letter-spacing: 0.04em;
  }
}

.admin-name {
  font-family: $font-display;
  font-size: 18px;
  letter-spacing: $font-display-spacing;
  color: $text-dark;
  line-height: 1;
  margin-bottom: 4px;
}

.admin-badge {
  font-family: $font-primary;
  font-size: 11px;
  font-weight: $font-semibold;
  color: $primary-red;
  background: rgba($primary-red, 0.08);
  padding: 0.15rem 0.5rem;
  border-radius: $border-radius-pill;
}

.info-rows {
  border: 1px solid $border-color;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0.5625rem 0.875rem;
  border-bottom: 1px solid $border-color;

  &--last {
    border-bottom: none;
  }
}

.info-row__label {
  font-family: $font-primary;
  font-size: 11px;
  color: $text-gray;
}

.info-row__value {
  font-family: $font-primary;
  font-size: 13.5px;
  font-weight: $font-semibold;
  color: $text-dark;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
  background: $bg-page;
  border: 1px solid $border-color;
  border-radius: 9px;
  font-family: $font-primary;
  font-size: 13.5px;
  font-weight: $font-semibold;
  color: $text-dark;
  cursor: pointer;
  transition: all 0.15s;

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.5;
  }

  &:hover {
    background: rgba($primary-red, 0.06);
    color: $primary-red;
    border-color: $primary-red;
  }
}
</style>