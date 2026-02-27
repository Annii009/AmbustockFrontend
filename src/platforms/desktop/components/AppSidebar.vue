<template>
  <aside class="sidebar" :class="{ 'sidebar--open': isOpen }">

    <div class="sidebar__logo" @click="router.push('/')" title="Ir al inicio">
      <img src="/logo1Rojo.png" alt="AmbuStock" />
    </div>

    <nav class="sidebar__nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="sidebar__item"
        active-class="sidebar__item--active"
        exact-active-class="sidebar__item--active"
      >
        <span class="sidebar__item-icon" v-html="item.icon" />
        <span class="sidebar__item-label">{{ item.label }}</span>
      </router-link>

      <template v-if="isAdmin">
        <div class="sidebar__sep" />
        <p class="sidebar__group">Administración</p>
        <router-link
          v-for="item in adminItems"
          :key="item.path"
          :to="item.path"
          class="sidebar__item"
          active-class="sidebar__item--active"
        >
          <span class="sidebar__item-icon" v-html="item.icon" />
          <span class="sidebar__item-label">{{ item.label }}</span>
        </router-link>
      </template>
    </nav>

    <div class="sidebar__spacer" />

    <div class="sidebar__footer">
      <div class="sidebar__user">
        <div class="sidebar__avatar">
          <span>{{ initials }}</span>
        </div>
        <div class="sidebar__user-text">
          <p class="sidebar__user-name">{{ userName }}</p>
          <p class="sidebar__user-role">{{ userRole }}</p>
        </div>
      </div>
      <button class="sidebar__logout" @click="handleLogout">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Cerrar Sesión
      </button>
    </div>

    <button class="sidebar__close" @click="$emit('close')">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>

  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getUsuario } from '@/core/services/api'

defineProps<{ isOpen?: boolean }>()
defineEmits<{ close: [] }>()

const router   = useRouter()
const user     = computed(() => getUsuario())
const userName = computed(() => user.value?.nombreResponsable || user.value?.nombre || 'Usuario')
const userRole = computed(() => user.value?.rol || 'Inspector')
const isAdmin  = computed(() => user.value?.rol === 'Administrador')
const initials = computed(() =>
  userName.value.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
)

const navItems = [
  {
    path: '/principal',
    label: 'Dashboard',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>`
  },
  {
    path: '/principal/seleccion-ambulancia',
    label: 'Nueva Reposición',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>`
  },
  {
    path: '/principal/material-gastado',
    label: 'Material Gastado',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
    </svg>`
  },
  {
    path: '/principal/reposicion',
    label: 'Reposición Material',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>`
  },
  {
    path: '/principal/historial',
    label: 'Historial',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 3v5h5"/>
      <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/>
    </svg>`
  }
]

const adminItems = [
  {
    path: '/principal/responsables',
    label: 'Responsables',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>`
  },
  {
    path: '/principal/ambulancias',
    label: 'Ambulancias',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="1" y="3" width="15" height="13" rx="1"/>
      <path d="M16 8h4l3 3v5h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>`
  }
]

const handleLogout = () => {
  localStorage.removeItem('usuario')
  router.push('/login')
}
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.sidebar {
  width: 220px;
  height: 100vh;
  background: $white;
  display: flex;
  flex-direction: column;
  border-right: 1px solid $border-color;
  position: sticky;
  top: 0;
  overflow-y: auto;
  flex-shrink: 0;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: $border-color; border-radius: 3px; }

  @media (max-width: 768px) {
    position: fixed;
    left: -220px;
    top: 0;
    z-index: 100;
    box-shadow: $shadow-sidebar;
    transition: left 0.3s ease;
    &--open { left: 0; }
  }
}

.sidebar__logo {
  padding: 1.5rem 1.25rem 1rem;
  flex-shrink: 0;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover { opacity: 0.8; }
  cursor: pointer;
  img { height: 42px; width: auto; object-fit: contain; transition: opacity 0.15s; }
  &:hover img { opacity: 0.75; }
}

.sidebar__nav {
  padding: 0.25rem 0.625rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem;
  border-radius: 10px;
  text-decoration: none;
  color: $text-dark;
  font-family: $font-primary;
  font-size: 13.5px;
  font-weight: $font-semibold;
  transition: background 0.15s;

  &-icon {
    display: flex;
    align-items: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    opacity: 0.4;
    transition: opacity 0.15s;
    :deep(svg) { width: 20px; height: 20px; }
  }

  &-label { flex: 1; }

  &:hover {
    background: $bg-page;
    .sidebar__item-icon { opacity: 0.7; }
  }

  &--active {
    background: $primary-red;
    color: $white;
    .sidebar__item-icon { opacity: 1; }
    &:hover { background: $primary-red-hover; }
  }
}

.sidebar__sep {
  height: 1px;
  background: $border-color;
  margin: 0.625rem 0.25rem;
}

.sidebar__group {
  font-family: $font-primary;
  font-size: 10px;
  font-weight: $font-bold;
  letter-spacing: 0.08em;
  color: $text-gray;
  text-transform: uppercase;
  padding: 0 0.75rem 0.25rem;
  margin: 0;
}

.sidebar__spacer { flex: 1; }

.sidebar__footer {
  padding: 0.75rem 0.625rem;
  border-top: 1px solid $border-color;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex-shrink: 0;
}

.sidebar__user {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  background: $bg-page;
}

.sidebar__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: $primary-red;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  span {
    font-family: $font-display;
    color: $white;
    font-size: 14px;
    letter-spacing: 0.04em;
  }
}

.sidebar__user-text { overflow: hidden; }

.sidebar__user-name {
  font-family: $font-primary;
  font-size: 12.5px;
  font-weight: $font-semibold;
  color: $text-dark;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar__user-role {
  font-family: $font-primary;
  font-size: 11px;
  color: $text-gray;
}

.sidebar__logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: $text-dark;
  font-family: $font-primary;
  font-size: 13px;
  font-weight: $font-semibold;
  width: 100%;
  transition: background 0.15s, color 0.15s;
  svg { width: 16px; height: 16px; flex-shrink: 0; opacity: 0.45; }
  &:hover { background: rgba($primary-red, 0.06); color: $primary-red; }
}

.sidebar__close {
  display: none;
  position: absolute;
  top: 0.875rem;
  right: 0.875rem;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: $bg-page;
  border: 1px solid $border-color;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  svg { width: 14px; height: 14px; }
  @media (max-width: 768px) { display: flex; }
}
</style>