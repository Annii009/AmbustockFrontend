import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUsuarios,
  getUsuarioById,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  type UsuarioResponsable
} from '@core/services/api'

export const useUsuariosStore = defineStore('usuarios', () => {
  // ── Estado ──────────────────────────────────────────────────
  const usuarios = ref<UsuarioResponsable[]>([])
  const loading = ref(false)

  // ── Obtener lista completa del backend ──────────────────────
  async function cargar() {
    loading.value = true
    try {
      usuarios.value = await getUsuarios()
    } finally {
      loading.value = false
    }
  }

  // ── Obtener un usuario por id (para edición) ────────────────
  async function obtenerPorId(id: number) {
    return getUsuarioById(id)
  }

  // ── Crear usuario y añadirlo al estado local ────────────────
  async function crear(datos: UsuarioResponsable) {
    const nuevo = await crearUsuario(datos)
    await cargar() // recarga para obtener el id generado
    return nuevo
  }

  // ── Actualizar usuario en backend y en estado local ─────────
  async function actualizar(id: number, datos: Partial<UsuarioResponsable>) {
    await actualizarUsuario(id, datos)
    const idx = usuarios.value.findIndex(u => u.idUsuario === id)
    if (idx !== -1) usuarios.value[idx] = { ...usuarios.value[idx], ...datos }
  }

  // ── Eliminar usuario del backend y del estado local ─────────
  async function eliminar(id: number) {
    await eliminarUsuario(id)
    usuarios.value = usuarios.value.filter(u => u.idUsuario !== id)
  }

  return { usuarios, loading, cargar, obtenerPorId, crear, actualizar, eliminar }
})