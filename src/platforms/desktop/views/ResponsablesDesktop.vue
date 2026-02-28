<template>
  <div class="page">
    <div class="page__inner">

      <!-- ══ HEADER ══ -->
      <div class="page__header">
        <div>
          <p class="page__eyebrow">ADMINISTRACIÓN</p>
          <h1 class="page__title">RESPONSABLES</h1>
        </div>
        <button class="btn-add" @click="abrirModalAñadir">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Añadir responsable
        </button>
      </div>

      <!-- ══ BUSCADOR ══ -->
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, rol o email..." autocomplete="off" />
      </div>

      <!-- ══ LOADING ══ -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner" />
      </div>

      <!-- ══ EMPTY ══ -->
      <div v-else-if="responsablesFiltrados.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <p>No hay responsables registrados</p>
      </div>

      <!-- ══ TABLA ══ -->
      <div v-else class="table-wrap">
        <table class="resp-table">
          <thead>
            <tr>
              <th>Responsable</th>
              <th>Rol</th>
              <th>Email</th>
              <th class="th-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in responsablesFiltrados" :key="r.idUsuario" class="resp-row">
              <td class="td-name">
                <div class="user-cell">
                  <div class="user-avatar">{{ getInitials(r.nombreUsuario) }}</div>
                  <span class="user-name">{{ r.nombreUsuario }}</span>
                </div>
              </td>
              <td>
                <span class="rol-badge" :class="getRolClass(r.rol)">{{ r.rol }}</span>
              </td>
              <td class="td-email">{{ r.email }}</td>
              <td class="td-actions">
                <div class="actions-cell">
                  <button class="action-btn action-btn--edit" title="Editar" @click="editarResponsable(r.idUsuario!)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                  </button>
                  <button class="action-btn action-btn--delete" title="Eliminar"
                    @click="confirmarEliminar(r.idUsuario!, r.nombreUsuario)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="!isLoading && responsablesFiltrados.length > 0" class="table-count">
        {{ responsablesFiltrados.length }} responsable{{ responsablesFiltrados.length !== 1 ? 's' : '' }}
        <template v-if="searchQuery"> · filtrado{{ responsablesFiltrados.length !== 1 ? 's' : '' }}</template>
      </p>

    </div>

    <!-- ══ MODAL CREAR / EDITAR ══ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModalResponsable" class="modal-overlay" @click.self="cerrarModalResponsable">
          <div class="modal">
            <div class="modal__header">
              <div class="modal__avatar">
                {{ editingResponsable ? getInitials(formData.nombreUsuario || editingResponsable.nombreUsuario) : '+' }}
              </div>
              <div class="modal__header-text">
                <p class="modal__eyebrow">{{ editingResponsable ? 'EDITAR' : 'NUEVO' }}</p>
                <h2 class="modal__title">{{ editingResponsable ? editingResponsable.nombreUsuario : 'Responsable' }}
                </h2>
              </div>
              <button class="modal__close" @click="cerrarModalResponsable">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form class="modal__form" @submit.prevent="guardarResponsable">
              <div class="form-grid">
                <div class="form-field">
                  <label>Nombre de usuario</label>
                  <input v-model="formData.nombreUsuario" type="text" placeholder="Nombre completo" required />
                </div>
                <div class="form-field">
                  <label>Rol</label>
                  <select v-model="formData.rol" required>
                    <option value="">Seleccione un rol</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Socorrista">Socorrista</option>
                    <option value="Sanitario">Sanitario</option>
                    <option value="Técnico de emergencias">Técnico de emergencias</option>
                  </select>
                </div>
                <div class="form-field form-field--full">
                  <label>Email</label>
                  <input v-model="formData.email" type="email" placeholder="ejemplo@correo.com" required />
                </div>
                <div v-if="!editingResponsable" class="form-field form-field--full">
                  <label>Contraseña</label>
                  <input v-model="formData.password" type="password" placeholder="Contraseña" required />
                </div>
              </div>
              <div class="modal__footer">
                <button type="button" class="btn-cancel" @click="cerrarModalResponsable">Cancelar</button>
                <button type="submit" class="btn-confirm">
                  {{ editingResponsable ? 'Guardar cambios' : 'Crear responsable' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══ MODAL ELIMINAR ══ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModalEliminar" class="modal-overlay" @click.self="cerrarModalEliminar">
          <div class="modal modal--sm">
            <div class="modal__danger-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h2 class="modal__title modal__title--center">
              ¿Eliminar a<br><span class="modal__name">{{ responsableToDelete?.nombre }}</span>?
            </h2>
            <p class="modal__sub">Esta acción no se puede deshacer.</p>
            <div class="modal__footer modal__footer--center">
              <button class="btn-cancel" @click="cerrarModalEliminar">Cancelar</button>
              <button class="btn-delete" @click="eliminarResponsableConfirmar">Eliminar</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import {
  getUsuarios, getUsuarioById, crearUsuario,
  actualizarUsuario, eliminarUsuario, isAdmin,
  type UsuarioResponsable
} from '@core/services/api'

const router = useRouter()

const allResponsables = ref<UsuarioResponsable[]>([])
const searchQuery = ref('')
const isLoading = ref(true)
const showModalResponsable = ref(false)
const editingResponsable = ref<UsuarioResponsable | null>(null)
const formData = ref<UsuarioResponsable>({ nombreUsuario: '', rol: '', email: '', password: '' })
const showModalEliminar = ref(false)
const responsableToDelete = ref<{ id: number; nombre: string } | null>(null)

const responsablesFiltrados = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return allResponsables.value
  return allResponsables.value.filter(r =>
    (r.nombreUsuario || '').toLowerCase().includes(q) ||
    (r.rol || '').toLowerCase().includes(q) ||
    (r.email || '').toLowerCase().includes(q)
  )
})

const getInitials = (nombre: string) =>
  (nombre || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

const getRolClass = (rol: string) => {
  const r = (rol || '').toLowerCase()
  if (r.includes('admin')) return 'rol--admin'
  if (r.includes('socorrista')) return 'rol--socorrista'
  if (r.includes('técnico') || r.includes('tecnico')) return 'rol--tecnico'
  return 'rol--sanitario'
}

const cargarResponsables = async () => {
  try {
    isLoading.value = true
    allResponsables.value = await getUsuarios()
  } catch { alert('Error al cargar la lista de responsables') }
  finally { isLoading.value = false }
}

const abrirModalAñadir = () => {
  editingResponsable.value = null
  formData.value = { nombreUsuario: '', rol: '', email: '', password: '' }
  showModalResponsable.value = true
}

const editarResponsable = async (id: number) => {
  try {
    const r = await getUsuarioById(id)
    editingResponsable.value = r
    formData.value = { nombreUsuario: r.nombreUsuario, rol: r.rol, email: r.email, password: '' }
    showModalResponsable.value = true
  } catch { alert('Error al cargar el responsable') }
}

const guardarResponsable = async () => {
  try {
    if (!formData.value.nombreUsuario || !formData.value.rol || !formData.value.email) {
      alert('Por favor complete todos los campos obligatorios'); return
    }
    if (!editingResponsable.value && !formData.value.password) {
      alert('La contraseña es obligatoria para nuevos usuarios'); return
    }
    const datos: any = {
      nombreUsuario: formData.value.nombreUsuario.trim(),
      rol: formData.value.rol,
      email: formData.value.email.trim()
    }
    if (formData.value.password) datos.password = formData.value.password
    editingResponsable.value
      ? await actualizarUsuario(editingResponsable.value.idUsuario!, datos)
      : await crearUsuario(datos)
    cerrarModalResponsable()
    await cargarResponsables()
  } catch { alert('Error al guardar el responsable') }
}

const confirmarEliminar = (id: number, nombre: string) => {
  responsableToDelete.value = { id, nombre }
  showModalEliminar.value = true
}

const eliminarResponsableConfirmar = async () => {
  if (!responsableToDelete.value) return
  try {
    await eliminarUsuario(responsableToDelete.value.id)
    cerrarModalEliminar()
    await cargarResponsables()
  } catch { alert('Error al eliminar el responsable') }
}

const cerrarModalResponsable = () => {
  showModalResponsable.value = false
  editingResponsable.value = null
  formData.value = { nombreUsuario: '', rol: '', email: '', password: '' }
}
const cerrarModalEliminar = () => {
  showModalEliminar.value = false
  responsableToDelete.value = null
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (showModalResponsable.value) cerrarModalResponsable()
    if (showModalEliminar.value) cerrarModalEliminar()
  }
}

onMounted(() => {
  if (!isAdmin()) { router.push('/principal'); return }
  cargarResponsables()
  document.addEventListener('keydown', onKeyDown)
})
onBeforeUnmount(() => document.removeEventListener('keydown', onKeyDown))
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
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
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

.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: $primary-red;
  color: $white;
  border: none;
  border-radius: 10px;
  font-family: $font-primary;
  font-size: 14px;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: filter 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 14px rgba($primary-red, 0.3);
  white-space: nowrap;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    filter: brightness(0.9);
    box-shadow: 0 6px 20px rgba($primary-red, 0.4);
  }
}

.search-box {
  position: relative;
  margin-bottom: 1.25rem;

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
    width: 56px;
    height: 56px;
    opacity: 0.3;
  }

  p {
    font-family: $font-primary;
    font-size: 15px;
  }
}

// ── Tabla ─────────────────────────────────────────────────────
.table-wrap {
  background: $white;
  border: 1.5px solid $border-color;
  border-radius: 14px;
  overflow: hidden;
}

.resp-table {
  width: 100%;
  border-collapse: collapse;
}

.resp-table thead tr {
  border-bottom: 1.5px solid $border-color;
  background: $bg-page;
}

.resp-table th {
  font-family: $font-primary;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: $text-gray;
  padding: 0.875rem 1.25rem;
  text-align: left;

  &.th-actions {
    text-align: right;
  }
}

.resp-row {
  border-bottom: 1px solid $border-color;
  transition: background 0.12s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba($primary-red, 0.025);
  }
}

.resp-table td {
  padding: 1rem 1.25rem;
  vertical-align: middle;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  background: $primary-red;
  color: $white;
  font-family: $font-primary;
  font-size: 13px;
  font-weight: $font-bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-family: $font-primary;
  font-size: 14px;
  font-weight: $font-semibold;
  color: $text-dark;
}

.rol-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-family: $font-primary;
  font-size: 12px;
  font-weight: $font-bold;

  &.rol--admin {
    background: rgba($primary-red, 0.1);
    color: $primary-red;
  }

  &.rol--socorrista {
    background: rgba($blue-accent, 0.1);
    color: $blue-accent;
  }

  &.rol--tecnico {
    background: rgba($green-accent, 0.12);
    color: darken($green-accent, 12%);
  }

  &.rol--sanitario {
    background: rgba(#F59E0B, 0.12);
    color: #B45309;
  }
}

.td-email {
  font-family: $font-primary;
  font-size: 13.5px;
  color: $text-gray;
}

.td-actions {
  text-align: right;
}

.actions-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.375rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;

  svg {
    width: 15px;
    height: 15px;
  }

  &:active {
    transform: scale(0.92);
  }

  &--edit {
    background: rgba($primary-red, 0.08);
    color: $primary-red;

    &:hover {
      background: rgba($primary-red, 0.16);
    }
  }

  &--delete {
    background: rgba(#e74c3c, 0.08);
    color: #e74c3c;

    &:hover {
      background: rgba(#e74c3c, 0.16);
    }
  }
}

.table-count {
  font-family: $font-primary;
  font-size: 12px;
  color: $text-gray;
  margin-top: 0.75rem;
  text-align: right;
}

// ── Modales ───────────────────────────────────────────────────
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}

.modal {
  background: $white;
  border-radius: 20px;
  width: 100%;
  max-width: 560px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  &--sm {
    max-width: 400px;
  }
}

.modal__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 1.75rem 0;
}

.modal__header-text {
  flex: 1;
}

.modal__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
  background: $primary-red;
  color: $white;
  font-family: $font-primary;
  font-size: 16px;
  font-weight: $font-bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal__danger-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin: 1.75rem auto 0;
  background: rgba(#e74c3c, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
    color: #e74c3c;
  }
}

.modal__eyebrow {
  font-family: $font-primary;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: $text-gray;
  text-transform: uppercase;
}

.modal__title {
  font-family: $font-display;
  font-size: 24px;
  letter-spacing: $font-display-spacing;
  color: $text-dark;
  line-height: 1.1;

  &--center {
    text-align: center;
    margin-top: 0.75rem;
    padding: 0 1.75rem;
  }
}

.modal__name {
  color: $primary-red;
}

.modal__sub {
  font-family: $font-primary;
  font-size: 13px;
  color: $text-gray;
  text-align: center;
  padding: 0.375rem 1.75rem 0;
}

.modal__close {
  margin-left: auto;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: $bg-page;
  color: $text-gray;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: $border-color;
  }
}

.modal__form {
  padding: 1.25rem 1.75rem 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  &--full {
    grid-column: 1 / -1;
  }

  label {
    font-family: $font-primary;
    font-size: 12px;
    font-weight: $font-bold;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: $text-gray;
  }

  input,
  select {
    padding: 0.75rem 1rem;
    border: 1.5px solid $border-color;
    border-radius: 10px;
    background: $white;
    font-family: $font-primary;
    font-size: 14px;
    color: $text-dark;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;

    &::placeholder {
      color: lighten($text-gray, 15%);
    }

    &:focus {
      border-color: $primary-red;
    }
  }

  select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235E657B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.875rem center;
    background-size: 16px;
    padding-right: 2.5rem;
  }
}

.modal__footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1.25rem 1.75rem 1.75rem;

  &--center {
    justify-content: center;
  }
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  border: 1.5px solid $border-color;
  background: $white;
  font-family: $font-primary;
  font-size: 14px;
  font-weight: $font-semibold;
  color: $text-gray;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;

  &:hover {
    border-color: $primary-red;
    color: $primary-red;
  }
}

.btn-confirm {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  border: none;
  background: $primary-red;
  color: $white;
  font-family: $font-primary;
  font-size: 14px;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: filter 0.15s;
  box-shadow: 0 4px 14px rgba($primary-red, 0.3);

  &:hover {
    filter: brightness(0.9);
  }
}

.btn-delete {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  border: none;
  background: #e74c3c;
  color: $white;
  font-family: $font-primary;
  font-size: 14px;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: filter 0.15s;
  box-shadow: 0 4px 14px rgba(#e74c3c, 0.25);

  &:hover {
    filter: brightness(0.9);
  }
}

// Transición modal
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>