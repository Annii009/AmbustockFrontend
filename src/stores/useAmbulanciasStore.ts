import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAuthToken } from '@core/services/api'

export interface Ambulancia {
  idAmbulancia: number
  nombre?: string
  matricula?: string
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002'

// Helper interno para llamadas autenticadas a la API
const apiFetch = async (path: string, method = 'GET', body?: any) => {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`)
  if (res.status === 204) return null
  return res.json()
}

export const useAmbulanciasStore = defineStore('ambulancias', () => {
  // ── Estado ──────────────────────────────────────────────────
  const ambulancias = ref<Ambulancia[]>([])
  const loading = ref(false)

  // ── Obtener lista completa del backend ──────────────────────
  async function cargar() {
    loading.value = true
    try {
      ambulancias.value = await apiFetch('/api/Ambulancia')
    } finally {
      loading.value = false
    }
  }

  // ── Crear nueva ambulancia y añadirla al estado local ───────
  async function crear(datos: { nombre: string; matricula: string }) {
    const nueva = await apiFetch('/api/Ambulancia', 'POST', datos)
    ambulancias.value.push(nueva)
    return nueva
  }

  // ── Actualizar ambulancia en backend y en estado local ──────
  async function actualizar(id: number, datos: { nombre: string; matricula: string }) {
    await apiFetch(`/api/Ambulancia/${id}`, 'PUT', datos)
    const idx = ambulancias.value.findIndex(a => a.idAmbulancia === id)
    if (idx !== -1) ambulancias.value[idx] = { ...ambulancias.value[idx], ...datos }
  }

  // ── Eliminar ambulancia del backend y del estado local ──────
  async function eliminar(id: number) {
    await apiFetch(`/api/Ambulancia/${id}`, 'DELETE')
    ambulancias.value = ambulancias.value.filter(a => a.idAmbulancia !== id)
  }

  return { ambulancias, loading, cargar, crear, actualizar, eliminar }
})