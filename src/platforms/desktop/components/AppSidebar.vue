<template>
  <aside class="sidebar" :class="{ 'sidebar--open': isOpen }">
    <!-- Logo -->
    <div class="sidebar__logo">
      <img src="/logo1Rojo.png" alt="AmbuStock" class="layout__topbar-logo" />
    </div>

    <div class="sidebar__divider" />

    <!-- Navigation -->
    <nav class="sidebar__nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="sidebar__nav-item"
        active-class="sidebar__nav-item--active"
        exact-active-class="sidebar__nav-item--active"
      >
        <span class="sidebar__nav-icon" v-html="item.icon" />
        <span class="sidebar__nav-label">{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Bottom: user + logout -->
    <div class="sidebar__footer">
      <div class="sidebar__user">
        <div class="sidebar__avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>
        <div class="sidebar__user-info">
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

      <!-- Mobile close -->
      <button class="sidebar__close" @click="$emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getUsuario } from '@/core/services/api'

defineProps<{
  isOpen?: boolean
}>()

defineEmits<{
  close: []
}>()

const router = useRouter()

const user = computed(() => getUsuario())
const userName = computed(() => {
  const u = user.value
  if (!u) return 'Usuario Demo'
  return u.nombreResponsable || u.nombre || 'Usuario Demo'
})
const userRole = computed(() => user.value?.rol || 'Inspector')

const navItems = [
  {
    path: '/principal',
    label: 'Principal',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>`
  },
  {
    path: '/principal/revision',
    label: 'Nueva Revisión',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <path d="m9 12 2 2 4-4"/>
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
    path: '/principal/history',
    label: 'Historial',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 3v5h5"/>
      <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/>
    </svg>`
  }
]

const handleLogout = () => {
  localStorage.removeItem('usuario')
  router.push('/login')
}
</script>

<style scoped lang="scss">
.sidebar {
  width: 280px;
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  flex-shrink: 0;

  @media (max-width: 768px) {
    position: fixed;
    left: -280px;
    top: 0;
    z-index: 100;
    transition: left 0.3s ease;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);

    &--open {
      left: 0;
    }
  }
}

.sidebar__logo {
  padding: 1.75rem 1.5rem 1.5rem;
  display: flex;
  align-items: center;

  img {
    height: 56px;
    width: auto;
    object-fit: contain;
  }
}

.sidebar__divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0 1.5rem;
}

.sidebar__nav {
  flex: 1;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar__nav-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  text-decoration: none;
  color: #210706;
  font-size: 15px;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;

  .sidebar__nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    opacity: 0.7;
    transition: opacity 0.2s;

    :deep(svg) {
      width: 22px;
      height: 22px;
    }
  }

  &:hover {
    background: #f3f4f6;

    .sidebar__nav-icon {
      opacity: 1;
    }
  }

  &--active {
    background: #891d1a;
    color: white;

    .sidebar__nav-icon {
      opacity: 1;
    }

    &:hover {
      background: #6b1515;
    }
  }
}

.sidebar__footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar__user {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  background: #f3f4f6;
}

.sidebar__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #891d1a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 22px;
    height: 22px;
    fill: white;
  }
}

.sidebar__user-info {
  overflow: hidden;
}

.sidebar__user-name {
  font-size: 14px;
  font-weight: 600;
  color: #210706;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar__user-role {
  font-size: 12px;
  color: #210706;
  opacity: 0.6;
}

.sidebar__logout {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #210706;
  font-size: 15px;
  font-weight: 500;
  width: 100%;
  text-align: left;
  transition: background 0.2s, color 0.2s;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  &:hover {
    background: #891d1a1a;
    color: #891d1a;
  }
}

.sidebar__close {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  color: #210706;
  margin: 0 auto;
  transition: background 0.2s;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: #f3f4f6;
  }

  @media (max-width: 768px) {
    display: flex;
  }
}
</style>