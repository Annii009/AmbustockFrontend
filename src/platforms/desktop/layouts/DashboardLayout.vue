<template>
  <div class="layout">
    <div v-if="sidebarOpen" class="layout__overlay" @click="sidebarOpen = false" />
    <AppSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    <div class="layout__main">
      <!-- Topbar solo en mobile -->
      <header class="layout__topbar">
        <button class="layout__menu-btn" @click="sidebarOpen = true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <img src="/logo1Rojo.png" alt="AmbuStock" class="layout__topbar-logo" />
      </header>
      <main class="layout__content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '@desktop/components/AppSideBar.vue'
const sidebarOpen = ref(false)
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';

.layout {
  display: flex;
  min-height: 100vh;
  background: $bg-page;
}

.layout__overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 99;
  @media (max-width: 768px) { display: block; }
}

.layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.layout__topbar {
  display: none;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  background: $white;
  border-bottom: 1px solid $border-color;
  position: sticky;
  top: 0;
  z-index: 10;
  @media (max-width: 768px) { display: flex; }
}

.layout__menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: transparent;
  border: 1px solid $border-color;
  cursor: pointer;
  svg { width: 18px; height: 18px; }
  &:hover { background: $bg-page; }
}

.layout__topbar-logo { height: 34px; width: auto; }
.layout__content { flex: 1; overflow-y: auto; }
</style>