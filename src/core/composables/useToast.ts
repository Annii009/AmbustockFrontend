import { ref } from 'vue'

export interface ToastItem {
  id: number
  type: 'success' | 'error' | 'warning'
  title: string
  message?: string
  duration: number
}

const toasts = ref<ToastItem[]>([])
let _nextId = 0

const addToast = (
  type: ToastItem['type'],
  title: string,
  message?: string,
  duration = 4000
) => {
  const id = ++_nextId
  toasts.value.push({ id, type, title, message, duration })
  setTimeout(() => removeToast(id), duration)
}

const removeToast = (id: number) => {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

export const useToast = () => ({
  toasts,
  removeToast,
  toast: {
    success: (title: string, message?: string) => addToast('success', title, message),
    error:   (title: string, message?: string) => addToast('error',   title, message),
    warning: (title: string, message?: string) => addToast('warning', title, message),
  }
})