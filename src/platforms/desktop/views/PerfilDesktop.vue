<template>
  <div class="page">
    <div class="page__inner">

      <h1 class="page__title">MI PERFIL</h1>
      <p class="page__sub">Información de tu cuenta</p>

      <div v-if="user" class="profile-grid">

        <!-- Card principal -->
        <div class="card">
          <div class="card__avatar-section">
            <div class="big-avatar">
              <span>{{ initials }}</span>
            </div>
            <div>
              <h2 class="card__name">{{ (user.nombreResponsable || user.nombre || '').toUpperCase() }}</h2>
              <span class="role-badge">{{ user.rol }}</span>
            </div>
          </div>

          <div class="info-rows">
            <div class="info-row">
              <span class="info-row__label">Correo Electrónico</span>
              <span class="info-row__value">{{ user.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-row__label">Nombre completo</span>
              <span class="info-row__value">{{ user.nombreResponsable || user.nombre }}</span>
            </div>
            <div class="info-row">
              <span class="info-row__label">Rol</span>
              <span class="info-row__value">{{ user.rol }}</span>
            </div>
            <div class="info-row info-row--last">
              <span class="info-row__label">ID de usuario</span>
              <span class="info-row__value">#{{ user.usuarioId }}</span>
            </div>
          </div>
        </div>

        <!-- Actividad reciente -->
        <div class="card">
          <h3 class="card__section-title">ACTIVIDAD RECIENTE</h3>
          <div v-if="loading" class="empty-state"><div class="spinner" /></div>
          <div v-else-if="activities.length === 0" class="empty-state">
            <p>Sin actividad reciente</p>
          </div>
          <div v-else class="activity-list">
            <div v-for="a in activities" :key="a.id" class="activity-item">
              <div class="activity-item__badge" :style="{ background: a.color + '18' }">
                <span :style="{ color: a.color }">{{ a.id.split('-')[1] }}</span>
              </div>
              <div class="activity-item__info">
                <p class="activity-item__name">{{ a.nombre }}</p>
                <p class="activity-item__time">{{ a.time }}</p>
              </div>
              <span class="badge" :style="{ background: a.color + '18', color: a.color }">{{ a.status }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getUsuario, getHistorialRevisiones, obtenerEstadoRevision, type Revision } from '@/core/services/api'

const user     = ref(getUsuario())
const loading  = ref(true)
const activities = ref<any[]>([])

const initials = computed(() =>
  (user.value?.nombreResponsable || user.value?.nombre || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
)

const colorFromClase = (c: string) => ({
  completada: '#71B48D', pendiente: '#F59E0B',
  urgente: '#891D1A', 'sin-realizar': '#5E657B'
})[c] || '#5E657B'

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000), h = Math.floor(m / 60), d = Math.floor(h / 24)
  if (d > 0) return `Hace ${d} día${d > 1 ? 's' : ''}`
  if (h > 0) return `Hace ${h} hora${h > 1 ? 's' : ''}`
  return `Hace ${m} minuto${m > 1 ? 's' : ''}`
}

onMounted(async () => {
  try {
    const rev = await getHistorialRevisiones()
    activities.value = rev.slice(0, 5).map((r: Revision) => {
      const estado = obtenerEstadoRevision(r)
      return {
        id: `AMB-${String(r.idRevision).padStart(3, '0')}`,
        nombre: r.nombreAmbulancia || r.matricula,
        status: estado.texto,
        time:   timeAgo(r.fechaRevision),
        color:  colorFromClase(estado.clase)
      }
    })
  } catch { /* */ }
  finally { loading.value = false }
})
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.page { padding: 1.75rem 2rem; min-height: 100vh; background: $bg-page; }
.page__inner { max-width: 900px; margin: 0 auto; }
.page__title { font-family: $font-display; font-size: 38px; letter-spacing: $font-display-spacing; color: $text-dark; line-height: 1; margin-bottom: 0.25rem; }
.page__sub { font-family: $font-primary; font-size: 14px; color: $text-gray; margin-bottom: 1.5rem; }

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
}

.card {
  background: $white;
  border: 1px solid $border-color;
  border-radius: 14px;
  padding: 1.5rem;
}

.card__avatar-section {
  display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;
}

.big-avatar {
  width: 64px; height: 64px; border-radius: 50%; background: $primary-red;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  span { font-family: $font-display; color: $white; font-size: 26px; letter-spacing: 0.04em; }
}

.card__name { font-family: $font-display; font-size: 22px; letter-spacing: $font-display-spacing; color: $text-dark; line-height: 1; margin-bottom: 0.375rem; }

.role-badge {
  font-family: $font-primary; font-size: 12px; font-weight: $font-semibold;
  color: $primary-red; background: rgba($primary-red, 0.08);
  padding: 0.2rem 0.625rem; border-radius: $border-radius-pill;
}

.info-rows { border: 1px solid $border-color; border-radius: 10px; overflow: hidden; }

.info-row {
  display: flex; flex-direction: column; gap: 2px;
  padding: 0.625rem 0.875rem; border-bottom: 1px solid $border-color;
  &--last { border-bottom: none; }
}

.info-row__label { font-family: $font-primary; font-size: 11px; color: $text-gray; }
.info-row__value { font-family: $font-primary; font-size: 13.5px; font-weight: $font-semibold; color: $text-dark; }

.card__section-title {
  font-family: $font-display; font-size: 22px; letter-spacing: $font-display-spacing;
  color: $text-dark; line-height: 1; margin-bottom: 1rem;
}

.empty-state {
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  padding: 2rem; color: $text-gray;
  p { font-family: $font-primary; font-size: 14px; }
}

@keyframes spin { to { transform: rotate(360deg); } }
.spinner { width: 24px; height: 24px; border: 2.5px solid $border-color; border-top-color: $primary-red; border-radius: 50%; animation: spin 0.8s linear infinite; }

.activity-list { display: flex; flex-direction: column; gap: 0.5rem; }

.activity-item {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.625rem 0.75rem; border-radius: 9px;
  border: 1px solid $border-color; transition: background 0.12s;
  &:hover { background: $bg-page; }
}

.activity-item__badge {
  width: 34px; height: 34px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  span { font-family: $font-display; font-size: 13px; }
}

.activity-item__info { flex: 1; overflow: hidden; }
.activity-item__name { font-family: $font-primary; font-size: 13px; font-weight: $font-semibold; color: $text-dark; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.activity-item__time { font-family: $font-primary; font-size: 11px; color: $text-gray; }

.badge {
  font-family: $font-primary; font-size: 11px; font-weight: $font-bold;
  padding: 0.175rem 0.5rem; border-radius: $border-radius-pill; white-space: nowrap;
}
</style>