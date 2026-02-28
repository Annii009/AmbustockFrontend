<template>
    <div class="page">
        <div class="page__inner">

            <div class="page__header">
                <div>
                    <p class="page__eyebrow">HISTORIAL</p>
                    <h1 class="page__title">REPOSICIONES</h1>
                </div>
            </div>

            <div class="toolbar">
                <div class="search-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input v-model="searchQuery" type="text"
                        placeholder="Buscar por ambulancia, matrícula o revisor..." />
                </div>

                <div class="filters">
                    <button v-for="f in filtros" :key="f.value" class="filter-btn"
                        :class="{ 'filter-btn--active': filtroActual === f.value }" @click="filtroActual = f.value">
                        {{ f.label }}
                    </button>
                </div>
            </div>

            <div v-if="isLoading" class="loading-state">
                <div class="spinner" />
            </div>

            <template v-else>
                <div v-if="reposicionesFiltradas.length === 0" class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p>No se encontraron reposiciones</p>
                </div>

                <!-- El pintado de cada card está delegado al subcomponente ReposicionCard -->
                <div v-else class="reposicion-list">
                    <ReposicionCard v-for="rep in reposicionesFiltradas" :key="rep.id || rep.idReposicion"
                        :reposicion="rep" />
                </div>
            </template>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ReposicionCard from './ReposicionCard.vue'
import {
    getHistorialReposiciones,
    obtenerEstadoReposicion,
    formatearFechaLarga,
    type ReposicionDetalle
} from '@core/services/api'

const isLoading = ref(true)
const todasLasReposiciones = ref<ReposicionDetalle[]>([])
const filtroActual = ref('todas')
const searchQuery = ref('')

const filtros = [
    { value: 'todas', label: 'Todas' },
    { value: 'completada', label: 'Completadas' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'sin-realizar', label: 'Sin realizar' },
    { value: 'urgente', label: 'Urgentes' }
]

const reposicionesFiltradas = computed(() => {
    let lista = [...todasLasReposiciones.value]

    const q = searchQuery.value.toLowerCase().trim()
    if (q) {
        lista = lista.filter(r =>
            (r.nombreAmbulancia || '').toLowerCase().includes(q) ||
            (r.matricula || '').toLowerCase().includes(q) ||
            (r.nombreResponsable || '').toLowerCase().includes(q)
        )
    }

    if (filtroActual.value !== 'todas') {
        lista = lista.filter(r => obtenerEstadoReposicion(r).clase === filtroActual.value)
    }

    lista.sort((a, b) =>
        new Date(b.fechaReposicion || b.fecha).getTime() -
        new Date(a.fechaReposicion || a.fecha).getTime()
    )

    return lista
})

onMounted(async () => {
    try {
        todasLasReposiciones.value = await getHistorialReposiciones()
    } catch (e) {
        console.error('[HistorialReposiciones]', e)
    } finally {
        isLoading.value = false
    }
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
    max-width: 1100px;
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

.toolbar {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    margin-bottom: 1.5rem;
}

.search-box {
    position: relative;

    svg {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        width: 17px;
        height: 17px;
        color: $text-gray;
        pointer-events: none;
    }

    input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.75rem;
        border: 1.5px solid $border-color;
        border-radius: 10px;
        background: $white;
        font-family: $font-primary;
        font-size: 14px;
        color: $text-dark;
        outline: none;
        transition: border-color 0.15s;

        &::placeholder {
            color: $text-gray;
        }

        &:focus {
            border-color: $primary-red;
        }
    }
}

.filters {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 0.4rem 1rem;
    border: 1.5px solid $border-color;
    border-radius: 99px;
    background: $white;
    font-family: $font-primary;
    font-size: 13px;
    font-weight: 600;
    color: $text-gray;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;

    &:hover {
        border-color: $primary-red;
        color: $primary-red;
    }

    &--active {
        background: $primary-red;
        border-color: $primary-red;
        color: $white;
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
    gap: 1rem;
    padding: 4rem;
    color: $text-gray;

    svg {
        width: 48px;
        height: 48px;
    }

    p {
        font-family: $font-primary;
        font-size: 15px;
    }
}

.reposicion-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.reposicion-card {
    background: $white;
    border: 1.5px solid $border-color;
    border-radius: 14px;
    overflow: hidden;
    display: flex;
}

.reposicion-card__stripe {
    width: 5px;
    flex-shrink: 0;

    &.stripe--completada {
        background: $green-accent;
    }

    &.stripe--pendiente {
        background: #F59E0B;
    }

    &.stripe--sin-realizar {
        background: #C0C0C0;
    }

    &.stripe--urgente {
        background: $primary-red;
    }
}

.reposicion-card__body {
    flex: 1;
    padding: 1rem 1.25rem;
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 1.5rem;
}

.reposicion-card__main {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.reposicion-card__date {
    font-family: $font-primary;
    font-size: 12px;
    color: $text-gray;
}

.reposicion-card__amb {
    font-family: $font-display;
    font-size: 20px;
    letter-spacing: $font-display-spacing;
    color: $text-dark;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.reposicion-card__mat {
    font-family: $font-primary;
    font-size: 12.5px;
    color: $text-gray;
}

.status-badge {
    padding: 0.3rem 0.875rem;
    border-radius: $border-radius-pill;
    font-family: $font-primary;
    font-size: 12.5px;
    font-weight: $font-bold;
    white-space: nowrap;

    &--completada {
        background: rgba($green-accent, 0.12);
        color: darken($green-accent, 12%);
    }

    &--pendiente {
        background: rgba(#F59E0B, 0.12);
        color: #B45309;
    }

    &--sin-realizar {
        background: rgba(#C0C0C0, 0.2);
        color: #777;
    }

    &--urgente {
        background: rgba($primary-red, 0.1);
        color: $primary-red;
    }
}

.reposicion-card__foot {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: $font-primary;
    font-size: 13px;
    color: $text-gray;
}

.reposicion-card__resp {
    display: flex;
    align-items: center;
    gap: 0.4rem;

    svg {
        width: 14px;
        height: 14px;
        flex-shrink: 0;
    }
}
</style>