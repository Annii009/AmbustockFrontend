<template>
  <div class="view">

    <!-- Header -->
    <div class="header">
      <button class="back-btn" @click="router.push('/principal')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <h1 class="header__title">AMBULANCIAS</h1>
      <button class="add-btn" @click="router.push('/principal/ambulancia-editor')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>

    <!-- Buscador -->
    <div class="search-wrap">
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input v-model="search" type="text" placeholder="Buscar por nombre o matrícula..." />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner" />
    </div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0" class="empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
      <p>No hay ambulancias registradas</p>
    </div>

    <!-- Lista -->
    <div v-else class="list">
      <div v-for="amb in filtered" :key="amb.idAmbulancia" class="amb-card"
        @click="router.push(`/principal/ambulancia-editor/${amb.idAmbulancia}`)">
        <div class="amb-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="3" width="15" height="13" rx="1" />
            <path d="M16 8h4l3 3v5h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
        </div>
        <div class="amb-card__body">
          <p class="amb-card__name">{{ amb.nombre?.trim() || `Ambulancia ${amb.matricula}` }}</p>
          <p class="amb-card__mat">{{ amb.matricula }}</p>
        </div>
        <div class="amb-card__arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAmbulancias, type Ambulancia } from '@core/services/api'

const router = useRouter()
const ambulancias = ref<Ambulancia[]>([])
const loading = ref(true)
const search = ref('')

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return ambulancias.value.filter(a =>
    !q || (a.nombre || '').toLowerCase().includes(q) || (a.matricula || '').toLowerCase().includes(q)
  )
})

onMounted(async () => {
  try { ambulancias.value = await getAmbulancias() }
  catch { }
  finally { loading.value = false }
})
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.view {
  min-height: 100vh;
  background: $white;
  max-width: 480px;
  margin: 0 auto;
}

// Header
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid $border-color;
  position: sticky;
  top: 0;
  background: $white;
  z-index: 10;
}

.back-btn,
.add-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.15s;

  svg {
    width: 22px;
    height: 22px;
    color: $primary-red;
  }

  &:hover {
    background: $bg-page;
  }
}

.add-btn {
  background: $primary-red;
  border-radius: 8px;

  svg {
    color: $white;
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: $primary-red-hover;
  }
}

.header__title {
  font-family: $font-display;
  font-size: 20px;
  letter-spacing: $font-display-spacing;
  color: $text-dark;
}

// Search
.search-wrap {
  padding: 14px 16px 10px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: $bg-page;
  border-radius: 12px;
  padding: 10px 14px;
  border: 1.5px solid transparent;
  transition: border-color 0.15s;

  svg {
    width: 17px;
    height: 17px;
    color: $text-gray;
    flex-shrink: 0;
  }

  input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-family: $font-primary;
    font-size: 14px;
    color: $text-dark;

    &::placeholder {
      color: $text-gray;
    }
  }

  &:focus-within {
    border-color: $primary-red;
    background: $white;
  }
}

// Loading
.loading {
  display: flex;
  justify-content: center;
  padding: 48px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid $border-color;
  border-top-color: $primary-red;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

// Empty
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 64px 24px;
  color: $text-gray;

  svg {
    width: 56px;
    height: 56px;
    opacity: 0.25;
  }

  p {
    font-family: $font-primary;
    font-size: 15px;
  }
}

// Lista
.list {
  padding: 4px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.amb-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: $white;
  border: 1.5px solid $border-color;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.15s;

  &:active {
    background: $bg-page;
    transform: scale(0.99);
  }
}

.amb-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  flex-shrink: 0;
  background: rgba($primary-red, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
    color: $primary-red;
  }
}

.amb-card__body {
  flex: 1;
  min-width: 0;
}

.amb-card__name {
  font-family: $font-primary;
  font-size: 15px;
  font-weight: $font-semibold;
  color: $text-dark;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.amb-card__mat {
  font-family: $font-primary;
  font-size: 13px;
  color: $text-gray;
  margin-top: 2px;
}

.amb-card__arrow {
  svg {
    width: 18px;
    height: 18px;
    color: $text-gray;
  }
}
</style>