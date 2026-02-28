<template>
  <div class="page">
    <div class="page__inner">

      <div class="page__header">
        <div class="page__icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div>
          <h1 class="page__title">SUGERENCIAS</h1>
          <p class="page__sub">Añade comentarios o fotos opcionales antes de guardar la revisión</p>
        </div>
      </div>

      <div class="form-grid">

        <!-- Comentarios -->
        <div class="card">
          <h2 class="card__title">COMENTARIOS</h2>
          <textarea
            v-model="comentarios"
            class="textarea"
            placeholder="Escribe aquí cualquier observación sobre el material, el servicio o el estado de la ambulancia..."
            rows="8"
          />
        </div>

        <!-- Fotos -->
        <div class="card">
          <h2 class="card__title">FOTOS (OPCIONAL)</h2>

          <div class="photos-grid">
            <div
              v-for="(foto, i) in fotosSeleccionadas"
              :key="i"
              class="photo-item"
            >
              <img :src="foto.dataUrl" :alt="`Foto ${i + 1}`" />
              <button class="photo-item__remove" @click="eliminarFoto(i)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <button class="photo-add" @click="fileInputRef?.click()">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>Añadir foto</span>
            </button>
          </div>

          <input ref="fileInputRef" type="file" accept="image/*" multiple style="display:none" @change="onFileChange" />
        </div>
      </div>

      <div class="page__footer">
        <button class="btn-skip" @click="guardar">Omitir y guardar</button>
        <button class="btn-next" @click="guardar">
          Guardar revisión
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getReposicionData, guardarReposicion, guardarReposicionEnHistorial,
  getAmbulanciaById, getAmbulanciaSeleccionada,
  type FotoSeleccionada
} from '@core/services/api'

const router            = useRouter()
const comentarios       = ref('')
const fotosSeleccionadas = ref<FotoSeleccionada[]>([])
const fileInputRef      = ref<HTMLInputElement | null>(null)

const onFileChange = (e: Event) => {
  const files = Array.from((e.target as HTMLInputElement).files || [])
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = ev => fotosSeleccionadas.value.push({ file, dataUrl: ev.target?.result as string })
      reader.readAsDataURL(file)
    }
  })
  ;(e.target as HTMLInputElement).value = ''
}

const eliminarFoto = (i: number) => fotosSeleccionadas.value.splice(i, 1)

const guardar = async () => {
  try {
    const reposicionData = getReposicionData()
    if (!reposicionData) { router.push('/principal'); return }
    const ambulanciaId = getAmbulanciaSeleccionada()
    if (!ambulanciaId) return
    const ambulancia = await getAmbulanciaById(ambulanciaId).catch(() => null)
    const reposicion = {
      id: Date.now(), idReposicion: Date.now(), idAmbulancia: ambulanciaId,
      nombreAmbulancia: ambulancia?.nombre || 'N/A', matricula: ambulancia?.matricula || 'N/A',
      nombreResponsable: reposicionData.responsable || 'Sin responsable',
      fechaReposicion: new Date().toISOString(), fecha: new Date().toISOString(),
      estado: 'pendiente', origen: 'material-gastado',
      materiales: reposicionData.materiales, comentarios: comentarios.value
    } as any
    await guardarReposicion(reposicion)
    await guardarReposicionEnHistorial(reposicion)
  } catch { /* silencioso */ }
  router.push('/principal/todo-listo')
}
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.page { padding: 1.75rem 2rem; min-height: 100vh; background: $bg-page; }
.page__inner { max-width: 1400px; margin: 0 auto; }

.page__header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }

.page__icon {
  width: 52px; height: 52px; border-radius: 50%; background: $blue-accent; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  svg { width: 22px; height: 22px; }
}

.page__title { font-family: $font-display; font-size: 38px; letter-spacing: $font-display-spacing; color: $text-dark; line-height: 1; margin-bottom: 4px; }
.page__sub   { font-family: $font-primary; font-size: 14px; color: $text-gray; }

.form-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
}

.card { background: $white; border: 1px solid $border-color; border-radius: 14px; padding: 1.5rem; }
.card__title { font-family: $font-display; font-size: 22px; letter-spacing: $font-display-spacing; color: $text-dark; line-height: 1; margin-bottom: 1.25rem; }

.textarea {
  width: 100%; font-family: $font-primary; font-size: 14px; color: $text-dark;
  border: 1.5px solid $border-gray; border-radius: 9px; padding: 0.75rem;
  resize: vertical; line-height: 1.6; box-sizing: border-box;
  &::placeholder { color: $placeholder-color; }
  &:focus { outline: none; border-color: $primary-red; box-shadow: 0 0 0 3px rgba($primary-red, 0.06); }
}

.photos-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.photo-item {
  position: relative; border-radius: 10px; overflow: hidden; aspect-ratio: 1;
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
}

.photo-item__remove {
  position: absolute; top: 6px; right: 6px; width: 24px; height: 24px;
  background: rgba(0,0,0,0.55); border: none; border-radius: 50%; cursor: pointer;
  display: flex; align-items: center; justify-content: center; color: $white;
  svg { width: 11px; height: 11px; }
  &:hover { background: $primary-red; }
}

.photo-add {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.375rem; aspect-ratio: 1; border: 1.5px dashed $border-color;
  border-radius: 10px; background: $bg-page; cursor: pointer;
  color: $text-gray; transition: border-color 0.15s, color 0.15s;
  svg { width: 28px; height: 28px; }
  span { font-family: $font-primary; font-size: 11.5px; }
  &:hover { border-color: $primary-red; color: $primary-red; }
}

.page__footer { display: flex; justify-content: flex-end; align-items: center; gap: 0.75rem; }

.btn-skip {
  background: none; border: none; font-family: $font-primary; font-size: 14px;
  color: $text-gray; cursor: pointer; padding: 0.75rem 1rem;
  &:hover { color: $text-dark; }
}

.btn-next {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1.5rem; background: $primary-red; color: $white; border: none;
  border-radius: 10px; font-family: $font-primary; font-size: 14px; font-weight: $font-semibold;
  cursor: pointer; transition: filter 0.15s;
  svg { width: 16px; height: 16px; }
  &:hover { filter: brightness(0.9); }
}
</style>