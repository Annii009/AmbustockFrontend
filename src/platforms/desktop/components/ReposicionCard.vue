<template>
    <div class="reposicion-card">
        <div class="reposicion-card__stripe" :class="`stripe--${estado.clase}`" />
        <div class="reposicion-card__body">

            <div class="reposicion-card__main">
                <span class="reposicion-card__date">{{ formatearFechaLarga(reposicion.fechaReposicion ||
                    reposicion.fecha) }}</span>
                <span class="reposicion-card__amb">{{ reposicion.nombreAmbulancia || 'AMBULANCIA' }}</span>
                <span class="reposicion-card__mat">Matrícula: {{ reposicion.matricula || 'N/A' }}</span>
            </div>

            <div class="reposicion-card__mid">
                <span class="status-badge" :class="`status-badge--${estado.clase}`">{{ estado.texto }}</span>
            </div>

            <div class="reposicion-card__foot">
                <div class="reposicion-card__resp">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    {{ reposicion.nombreResponsable || 'Sin asignar' }}
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { obtenerEstadoReposicion, formatearFechaLarga, type ReposicionDetalle } from '@core/services/api'

const props = defineProps<{ reposicion: ReposicionDetalle }>()

// Calculado para no repetir la llamada en el template
const estado = computed(() => obtenerEstadoReposicion(props.reposicion))
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';

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