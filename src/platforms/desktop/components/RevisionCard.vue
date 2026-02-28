<template>
    <div class="revision-card">
        <div class="revision-card__stripe" :class="`stripe--${estado.clase}`" />
        <div class="revision-card__body">

            <div class="revision-card__main">
                <span class="revision-card__date">{{ formatearFechaLarga(revision.fechaRevision) }}</span>
                <span class="revision-card__amb">{{ revision.nombreAmbulancia || 'AMBULANCIA' }}</span>
                <span class="revision-card__mat">Matrícula: {{ revision.matricula || 'N/A' }}</span>
            </div>

            <div class="revision-card__mid">
                <span class="status-badge" :class="`status-badge--${estado.clase}`">{{ estado.texto }}</span>
            </div>

            <div class="revision-card__foot">
                <div class="revision-card__resp">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    {{ revision.nombreResponsable || 'Sin asignar' }}
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { obtenerEstadoRevision, formatearFechaLarga, type Revision } from '@core/services/api'

const props = defineProps<{ revision: Revision }>()

const estado = computed(() => obtenerEstadoRevision(props.revision))
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';

.revision-card {
    background: $white;
    border: 1.5px solid $border-color;
    border-radius: 14px;
    overflow: hidden;
    display: flex;
}

.revision-card__stripe {
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

.revision-card__body {
    flex: 1;
    padding: 1rem 1.25rem;
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 1.5rem;
}

.revision-card__main {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.revision-card__date {
    font-family: $font-primary;
    font-size: 12px;
    color: $text-gray;
}

.revision-card__amb {
    font-family: $font-display;
    font-size: 20px;
    letter-spacing: $font-display-spacing;
    color: $text-dark;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.revision-card__mat {
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

.revision-card__foot {
    display: flex;
    align-items: center;
    font-family: $font-primary;
    font-size: 13px;
    color: $text-gray;
}

.revision-card__resp {
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