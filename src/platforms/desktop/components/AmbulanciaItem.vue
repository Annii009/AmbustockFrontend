<template>
    <div class="amb-item" :class="{ 'amb-item--active': active }" @click="$emit('select', ambulancia)">
        <div class="amb-item__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13" rx="1" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
        </div>
        <div class="amb-item__text">
            <span class="amb-item__name">{{ ambulancia.nombre?.trim() || `Ambulancia ${ambulancia.matricula}` }}</span>
            <span class="amb-item__mat">{{ ambulancia.matricula }}</span>
        </div>
        <span class="amb-item__id">#{{ String(ambulancia.idAmbulancia).padStart(3, '0') }}</span>
    </div>
</template>

<script setup lang="ts">
import type { Ambulancia } from '@/stores/useAmbulanciasStore'

defineProps<{
    ambulancia: Ambulancia
    active?: boolean
}>()

defineEmits<{ select: [ambulancia: Ambulancia] }>()
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';

.amb-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem 0.75rem;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.12s;
    margin-bottom: 2px;

    &:hover {
        background: $bg-page;
    }

    &--active {
        background: rgba($primary-red, 0.08);

        .amb-item__name {
            color: $primary-red;
        }

        .amb-item__icon svg {
            color: $primary-red;
        }
    }
}

.amb-item__icon {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: $bg-page;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
        width: 18px;
        height: 18px;
        color: $text-gray;
    }
}

.amb-item__text {
    flex: 1;
    min-width: 0;
}

.amb-item__name {
    display: block;
    font-family: $font-primary;
    font-size: 13px;
    font-weight: $font-semibold;
    color: $text-dark;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.amb-item__mat {
    display: block;
    font-family: $font-primary;
    font-size: 11px;
    color: $text-gray;
}

.amb-item__id {
    font-family: $font-display;
    font-size: 13px;
    color: $border-color;
    flex-shrink: 0;
}
</style>