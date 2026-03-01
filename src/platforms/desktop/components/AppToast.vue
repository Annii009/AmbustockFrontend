<template>
    <Teleport to="body">
        <div class="toast-container">
            <TransitionGroup name="toast">
                <div v-for="toast in toasts" :key="toast.id" class="toast" :class="`toast--${toast.type}`">
                    <div class="toast__icon">
                        <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2.5">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path
                                d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </div>

                    <div class="toast__content">
                        <p class="toast__title">{{ toast.title }}</p>
                        <p v-if="toast.message" class="toast__message">{{ toast.message }}</p>
                    </div>
                    
                    <div class="toast__progress" :style="{ animationDuration: `${toast.duration}ms` }" />

                    <button class="toast__close" @click="removeToast(toast.id)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@core/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<style scoped lang="scss">
.toast-container {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    pointer-events: none;
}

.toast {
    pointer-events: all;
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
    padding: 1rem 1rem 1rem 1.125rem;
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.07);
    min-width: 300px;
    max-width: 420px;
    position: relative;
    overflow: hidden;

    &--success {
        border-left: 3.5px solid #71B48D;

        .toast__icon {
            color: #71B48D;
            background: rgba(113, 180, 141, 0.1);
        }

        .toast__progress {
            background: #71B48D;
        }
    }

    &--error {
        border-left: 3.5px solid #891D1A;

        .toast__icon {
            color: #891D1A;
            background: rgba(137, 29, 26, 0.08);
        }

        .toast__progress {
            background: #891D1A;
        }
    }

    &--warning {
        border-left: 3.5px solid #F59E0B;

        .toast__icon {
            color: #F59E0B;
            background: rgba(245, 158, 11, 0.1);
        }

        .toast__progress {
            background: #F59E0B;
        }
    }
}

.toast__icon {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
        width: 18px;
        height: 18px;
    }
}

.toast__content {
    flex: 1;
    padding-right: 0.5rem;
}

.toast__title {
    font-size: 14px;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.3;
    margin-bottom: 2px;
}

.toast__message {
    font-size: 12.5px;
    color: #777;
    line-height: 1.4;
}

.toast__close {
    width: 26px;
    height: 26px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s;

    svg {
        width: 14px;
        height: 14px;
    }

    &:hover {
        background: #f0f0f0;
        color: #333;
    }
}

.toast__progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 100%;
    transform-origin: left;
    animation: shrink linear forwards;
}

@keyframes shrink {
    from {
        transform: scaleX(1);
    }

    to {
        transform: scaleX(0);
    }
}

.toast-enter-active {
    animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-leave-active {
    animation: slideOut 0.25s ease forwards;
}

.toast-move {
    transition: transform 0.25s ease;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(40px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateX(0) scale(1);
    }
}

@keyframes slideOut {
    to {
        opacity: 0;
        transform: translateX(40px) scale(0.95);
    }
}
</style>