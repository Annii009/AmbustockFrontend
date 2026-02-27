<template>
  <div class="page">
    <div class="page__inner">

      <div class="page__header">
        <div>
          <h1 class="page__title">AMBULANCIAS</h1>
          <p class="page__sub">Gestión del parque de ambulancias</p>
        </div>
      </div>

      <div class="filters">
        <div class="filters__search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input v-model="search" type="text" placeholder="Buscar por nombre o matrícula..." />
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner" />
      </div>

      <div v-else-if="filtered.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.5">
          <rect x="1" y="3" width="15" height="13" rx="1" />
          <path d="M16 8h4l3 3v5h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        <p>No se encontraron ambulancias</p>
      </div>

      <div v-else class="cards-grid">
        <div v-for="amb in filtered" :key="amb.idAmbulancia" class="amb-card">
          <div class="amb-card__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <rect x="1" y="3" width="15" height="13" rx="1" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div class="amb-card__body">
            <p class="amb-card__name">{{ amb.nombre?.trim() || `Ambulancia ${amb.matricula}` }}</p>
            <p class="amb-card__matricula">{{ amb.matricula }}</p>
          </div>
          <div class="amb-card__id">#{{ String(amb.idAmbulancia).padStart(3, '0') }}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getAmbulancias, type Ambulancia } from '@core/services/api'

const loading = ref(true)
const ambulancias = ref<Ambulancia[]>([])
const search = ref('')

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return ambulancias.value.filter(a =>
    !q || (a.nombre || '').toLowerCase().includes(q) || (a.matricula || '').toLowerCase().includes(q)
  )
})

onMounted(async () => {
  try { ambulancias.value = await getAmbulancias() }
  catch { /* silencioso */ }
  finally { loading.value = false }
})
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
  max-width: 1400px;
  margin: 0 auto;
}

.page__header {
  @include flex-between;
  margin-bottom: 1.5rem;
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
}

.filters {
  margin-bottom: 1rem;
}

.filters__search {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0 0.875rem;
  background: $white;
  border: 1.5px solid $border-color;
  border-radius: 10px;
  max-width: 400px;
  transition: border-color 0.15s;

  svg {
    width: 16px;
    height: 16px;
    color: $text-gray;
    flex-shrink: 0;
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    font-family: $font-primary;
    font-size: 14px;
    color: $text-dark;
    padding: 0.625rem 0;
    background: transparent;

    &::placeholder {
      color: $placeholder-color;
    }
  }

  &:focus-within {
    border-color: $primary-red;
  }
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 4rem;
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem;
  background: $white;
  border-radius: 14px;
  border: 1px solid $border-color;
  color: $text-gray;

  svg {
    width: 40px;
    height: 40px;
    opacity: 0.3;
  }

  p {
    font-family: $font-primary;
    font-size: 14px;
  }
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.875rem;
}

.amb-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  background: $white;
  border: 1px solid $border-color;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  transition: box-shadow 0.15s;

  &:hover {
    box-shadow: $shadow-card;
  }
}

.amb-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba($primary-red, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
    color: $primary-red;
  }
}

.amb-card__body {
  flex: 1;
  overflow: hidden;
}

.amb-card__name {
  font-family: $font-primary;
  font-size: 13.5px;
  font-weight: $font-bold;
  color: $text-dark;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.amb-card__matricula {
  font-family: $font-primary;
  font-size: 12px;
  color: $text-gray;
  margin-top: 2px;
}

.amb-card__id {
  font-family: $font-display;
  font-size: 15px;
  color: $text-gray;
  flex-shrink: 0;
}
</style>