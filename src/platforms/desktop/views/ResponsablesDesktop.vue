<template>
  <div class="page">
    <div class="page__inner">

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

      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, rol o email..." autocomplete="off" />
      </div>

      <div v-if="store.loading" class="loading-state">
        <div class="spinner" />
      </div>

      <div v-else-if="responsablesFiltrados.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <p>No hay responsables registrados</p>
      </div>

      <!-- El pintado de cada fila está delegado al subcomponente ResponsableRow -->
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
            <ResponsableRow v-for="r in responsablesFiltrados" :key="r.idUsuario" :responsable="r"
              @editar="editarResponsable" @eliminar="confirmarEliminar" />
          </tbody>
        </table>
      </div>

      <p v-if="!store.loading && responsablesFiltrados.length > 0" class="table-count">
        {{ responsablesFiltrados.length }} responsable{{ responsablesFiltrados.length !== 1 ? 's' : '' }}
        <template v-if="searchQuery"> · filtrado{{ responsablesFiltrados.length !== 1 ? 's' : '' }}</template>
      </p>
    </div>

    <!-- ══ MODAL CREAR / EDITAR — VeeValidate + Yup ══ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModalResponsable" class="modal-overlay" @click.self="cerrarModalResponsable">
          <div class="modal">
            <div class="modal__header">
              <div class="modal__avatar">{{ editingResponsable ? getInitials(editingResponsable.nombreUsuario) : '+' }}
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

            <!-- VeeValidate valida el schema Yup antes de llamar a guardarResponsable -->
            <Form class="modal__form" :validation-schema="schema" @submit="guardarResponsable">
              <div class="form-grid">
                <div class="form-field">
                  <label>Nombre de usuario</label>
                  <Field name="nombreUsuario" v-slot="{ field, errors }">
                    <input v-bind="field" v-model="formData.nombreUsuario" type="text" placeholder="Nombre completo"
                      :class="{ 'input--error': errors.length }" />
                    <span class="field-error">{{ errors[0] }}</span>
                  </Field>
                </div>
                <div class="form-field">
                  <label>Rol</label>
                  <Field name="rol" v-slot="{ field, errors }">
                    <select v-bind="field" v-model="formData.rol" :class="{ 'input--error': errors.length }">
                      <option value="">Seleccione un rol</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Socorrista">Socorrista</option>
                      <option value="Sanitario">Sanitario</option>
                      <option value="Técnico de emergencias">Técnico de emergencias</option>
                    </select>
                    <span class="field-error">{{ errors[0] }}</span>
                  </Field>
                </div>
                <div class="form-field form-field--full">
                  <label>Email</label>
                  <Field name="email" v-slot="{ field, errors }">
                    <input v-bind="field" v-model="formData.email" type="email" placeholder="ejemplo@correo.com"
                      :class="{ 'input--error': errors.length }" />
                    <span class="field-error">{{ errors[0] }}</span>
                  </Field>
                </div>
                <div v-if="!editingResponsable" class="form-field form-field--full">
                  <label>Contraseña</label>
                  <Field name="password" v-slot="{ field, errors }">
                    <input v-bind="field" v-model="formData.password" type="password" placeholder="Mínimo 6 caracteres"
                      :class="{ 'input--error': errors.length }" />
                    <span class="field-error">{{ errors[0] }}</span>
                  </Field>
                </div>
              </div>
              <div class="modal__footer">
                <button type="button" class="btn-cancel" @click="cerrarModalResponsable">Cancelar</button>
                <button type="submit" class="btn-confirm" :disabled="saving">
                  {{ saving ? 'Guardando...' : (editingResponsable ? 'Guardar cambios' : 'Crear responsable') }}
                </button>
              </div>
            </Form>
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
              <button class="btn-delete" :disabled="deleting" @click="eliminarResponsableConfirmar">
                {{ deleting ? 'Eliminando...' : 'Eliminar' }}
              </button>
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
import { Form, Field } from 'vee-validate'   // librería de validación de formularios
import * as yup from 'yup'                   // schema de reglas de validación
import { isAdmin, getUsuarioById, type UsuarioResponsable } from '@core/services/api'
import { useUsuariosStore } from '@/stores/useUsuariosStore'
import { useToast } from '@core/composables/useToast'
import ResponsableRow from '../components/ResponsableRow.vue'

const router = useRouter()
const store = useUsuariosStore()
const { toast } = useToast()

// ── Estado local de UI ────────────────────────────────────────
const searchQuery = ref('')
const showModalResponsable = ref(false)
const showModalEliminar = ref(false)
const saving = ref(false)
const deleting = ref(false)
const editingResponsable = ref<UsuarioResponsable | null>(null)
const responsableToDelete = ref<{ id: number; nombre: string } | null>(null)
const formData = ref<UsuarioResponsable>({ nombreUsuario: '', rol: '', email: '', password: '' })

// ── Schema Yup — reglas de validación del formulario ─────────
const schema = computed(() =>
  yup.object({
    nombreUsuario: yup.string().required('El nombre es obligatorio').min(3, 'Mínimo 3 caracteres'),
    rol: yup.string().required('Selecciona un rol'),
    email: yup.string().email('Email no válido').required('El email es obligatorio'),
    // La contraseña solo es requerida al crear (no al editar)
    password: editingResponsable.value
      ? yup.string().optional()
      : yup.string().required('La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres')
  })
)

// ── Filtrado local ────────────────────────────────────────────
const responsablesFiltrados = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return store.usuarios
  return store.usuarios.filter(r =>
    (r.nombreUsuario || '').toLowerCase().includes(q) ||
    (r.rol || '').toLowerCase().includes(q) ||
    (r.email || '').toLowerCase().includes(q)
  )
})

const getInitials = (nombre: string) =>
  (nombre || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

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
  } catch {
    toast.error('Error de carga', 'No se pudo obtener el responsable')
  }
}

// VeeValidate llama a esta función solo si el schema es válido
const guardarResponsable = async () => {
  saving.value = true
  try {
    const datos: any = {
      nombreUsuario: formData.value.nombreUsuario.trim(),
      rol: formData.value.rol,
      email: formData.value.email.trim()
    }
    if (formData.value.password) datos.password = formData.value.password

    const wasEditing = !!editingResponsable.value
    wasEditing
      ? await store.actualizar(editingResponsable.value!.idUsuario!, datos)
      : await store.crear(datos)

    cerrarModalResponsable()
    toast.success(wasEditing ? 'Responsable actualizado' : 'Responsable creado', 'Los datos se guardaron correctamente')
  } catch {
    toast.error('Error al guardar', 'No se pudo guardar el responsable')
  } finally {
    saving.value = false
  }
}

const confirmarEliminar = (id: number, nombre: string) => {
  responsableToDelete.value = { id, nombre }
  showModalEliminar.value = true
}

const eliminarResponsableConfirmar = async () => {
  if (!responsableToDelete.value) return
  deleting.value = true
  try {
    await store.eliminar(responsableToDelete.value.id)
    cerrarModalEliminar()
    toast.success('Responsable eliminado', 'El usuario ha sido eliminado del sistema')
  } catch {
    toast.error('Error al eliminar', 'No se pudo eliminar el responsable')
  } finally {
    deleting.value = false
  }
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
  store.cargar()
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
  box-shadow: 0 4px 14px rgba($primary-red, 0.3);
  white-space: nowrap;
  flex-shrink: 0;
  transition: filter 0.15s;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    filter: brightness(0.9);
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
    width: 48px;
    height: 48px;
  }

  p {
    font-family: $font-primary;
    font-size: 15px;
  }
}

.table-wrap {
  background: $white;
  border-radius: 16px;
  border: 1.5px solid $border-color;
  overflow: hidden;
}

.resp-table {
  width: 100%;
  border-collapse: collapse;

  thead tr {
    border-bottom: 1.5px solid $border-color;
    background: $bg-page;
  }

  th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-family: $font-primary;
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.06em;
    color: $text-gray;
    text-transform: uppercase;

    &.th-actions {
      text-align: right;
    }
  }
}

.table-count {
  font-family: $font-primary;
  font-size: 12.5px;
  color: $text-gray;
  margin-top: 0.875rem;
}

// ── Modal ──────────────────────────────────────────────────────
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: $white;
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
  overflow: hidden;

  &--sm {
    max-width: 400px;
    padding: 2rem;
  }
}

.modal__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid $border-color;
}

.modal__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba($primary-red, 0.1);
  color: $primary-red;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: $font-display;
  font-size: 16px;
  flex-shrink: 0;
}

.modal__eyebrow {
  font-family: $font-primary;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: $text-gray;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.modal__title {
  font-family: $font-display;
  font-size: 26px;
  letter-spacing: $font-display-spacing;
  color: $text-dark;
  line-height: 1;

  &--center {
    text-align: center;
  }
}

.modal__close {
  width: 32px;
  height: 32px;
  margin-left: auto;
  border: none;
  background: transparent;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: $text-gray;
  flex-shrink: 0;
  transition: background 0.15s;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: $bg-page;
  }
}

.modal__form {
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.25rem;
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
    font-size: 12.5px;
    font-weight: 700;
    color: $text-dark;
    letter-spacing: 0.02em;
  }

  input,
  select {
    padding: 0.625rem 0.875rem;
    border: 1.5px solid $border-color;
    border-radius: 9px;
    font-family: $font-primary;
    font-size: 14px;
    color: $text-dark;
    background: $white;
    outline: none;
    transition: border-color 0.15s;

    &::placeholder {
      color: $text-gray;
    }

    &:focus {
      border-color: $primary-red;
    }

    &.input--error {
      border-color: $primary-red;
      background: rgba($primary-red, 0.03);
    }
  }
}

// Mensaje de error inline de VeeValidate
.field-error {
  font-family: $font-primary;
  font-size: 11.5px;
  color: $primary-red;
  min-height: 16px;
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid $border-color;
  margin-top: 1.25rem;

  &--center {
    justify-content: center;
  }
}

.modal__sub {
  font-family: $font-primary;
  font-size: 14px;
  color: $text-gray;
  text-align: center;
  margin: 0.875rem 0 1.5rem;
}

.modal__name {
  color: $primary-red;
}

.modal__danger-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba($primary-red, 0.1);
  color: $primary-red;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;

  svg {
    width: 24px;
    height: 24px;
  }
}

.btn-cancel {
  padding: 0.625rem 1.25rem;
  border: 1.5px solid $border-color;
  border-radius: 9px;
  background: $white;
  font-family: $font-primary;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: $bg-page;
  }
}

.btn-confirm {
  padding: 0.625rem 1.5rem;
  background: $primary-red;
  color: $white;
  border: none;
  border-radius: 9px;
  font-family: $font-primary;
  font-size: 14px;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: filter 0.15s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }
}

.btn-delete {
  padding: 0.625rem 1.5rem;
  background: $primary-red;
  color: $white;
  border: none;
  border-radius: 9px;
  font-family: $font-primary;
  font-size: 14px;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: filter 0.15s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}
</style>