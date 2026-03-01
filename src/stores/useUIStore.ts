import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // Estado global de UI
  const sidebarOpen = ref(true)
  const globalLoading = ref(false)

  // Helpers
  const toggleSidebar = () => { sidebarOpen.value = !sidebarOpen.value }

  const setLoading = (val: boolean) => { globalLoading.value = val }

  return { sidebarOpen, globalLoading, toggleSidebar, setLoading }
})