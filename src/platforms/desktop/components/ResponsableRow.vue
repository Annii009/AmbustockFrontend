<template>
    <tr class="resp-row">
        <td class="td-name">
            <div class="user-cell">
                <div class="user-avatar">{{ iniciales }}</div>
                <span class="user-name">{{ responsable.nombreUsuario }}</span>
            </div>
        </td>
        <td>
            <span class="rol-badge" :class="rolClass">{{ responsable.rol }}</span>
        </td>
        <td class="td-email">{{ responsable.email }}</td>
        <td class="td-actions">
            <div class="actions-cell">
                <button class="action-btn action-btn--edit" title="Editar"
                    @click="$emit('editar', responsable.idUsuario!)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                </button>
                <button class="action-btn action-btn--delete" title="Eliminar"
                    @click="$emit('eliminar', responsable.idUsuario!, responsable.nombreUsuario)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </td>
    </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UsuarioResponsable } from '@core/services/api'

const props = defineProps<{ responsable: UsuarioResponsable }>()

defineEmits<{
    editar: [id: number]
    eliminar: [id: number, nombre: string]
}>()

// Iniciales del nombre para el avatar
const iniciales = computed(() =>
    (props.responsable.nombreUsuario || '?')
        .split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
)

// Clase CSS del badge según el rol
const rolClass = computed(() => {
    const r = (props.responsable.rol || '').toLowerCase()
    if (r.includes('admin')) return 'rol--admin'
    if (r.includes('socorrista')) return 'rol--socorrista'
    if (r.includes('técnico') || r.includes('tecnico')) return 'rol--tecnico'
    return 'rol--sanitario'
})
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';

.resp-row {
    border-bottom: 1px solid $border-color;
    transition: background 0.12s;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: $bg-page;
    }

    td {
        padding: 0.875rem 1rem;
        font-family: $font-primary;
        font-size: 13.5px;
        color: $text-dark;
    }
}

.user-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.user-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba($primary-red, 0.1);
    color: $primary-red;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: $font-display;
    font-size: 13px;
    flex-shrink: 0;
}

.user-name {
    font-weight: $font-semibold;
}

.td-email {
    color: $text-gray;
}

.rol-badge {
    padding: 0.25rem 0.75rem;
    border-radius: $border-radius-pill;
    font-size: 12px;
    font-weight: $font-bold;

    &.rol--admin {
        background: rgba($primary-red, 0.1);
        color: $primary-red;
    }

    &.rol--socorrista {
        background: rgba(#3B82F6, 0.1);
        color: #2563EB;
    }

    &.rol--tecnico {
        background: rgba(#8B5CF6, 0.1);
        color: #7C3AED;
    }

    &.rol--sanitario {
        background: rgba($green-accent, 0.1);
        color: darken($green-accent, 10%);
    }
}

.actions-cell {
    display: flex;
    gap: 0.375rem;
    justify-content: flex-end;
}

.action-btn {
    width: 32px;
    height: 32px;
    border: 1.5px solid $border-color;
    border-radius: 8px;
    background: $white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;

    svg {
        width: 14px;
        height: 14px;
    }

    &--edit:hover {
        border-color: #3B82F6;
        color: #3B82F6;
        background: rgba(#3B82F6, 0.06);
    }

    &--delete:hover {
        border-color: $primary-red;
        color: $primary-red;
        background: rgba($primary-red, 0.06);
    }
}
</style>