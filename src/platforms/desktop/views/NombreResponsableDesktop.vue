<template>
  <DesktopInspectionLayout :current-step="3" :progress="66">
    <div class="step-wrap">
      <div class="step-card">
        <div class="step-card__head">
          <div class="step-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div>
            <h2 class="step-card__title">NOMBRE DEL RESPONSABLE</h2>
            <p class="step-card__sub">Introduce el nombre del técnico responsable</p>
          </div>
        </div>
        <div class="step-card__body">
          <label class="field-label">Responsable del servicio <span class="req">*</span></label>
          <div class="autocomplete">
            <div class="input-wrap">
              <input
                type="text"
                v-model="nombre"
                class="field-input"
                placeholder="Nombre del responsable del servicio"
                autocomplete="off"
                @keyup.enter="continuar"
                @blur="closeSugerencias"
              />
              <span v-if="searching" class="spinner" />
            </div>
            <ul v-if="showList" class="sugerencias">
              <li v-for="(s, i) in sugerencias" :key="i" class="sugerencias__item"
                @mousedown.prevent="pick(s)" v-html="highlight(s, nombre.trim())" />
            </ul>
          </div>
          <div class="btn-row">
            <button class="btn-back" @click="goBack">Atrás</button>
            <button class="btn-next" :disabled="nombre.trim().length < 2" @click="continuar">Continuar</button>
          </div>
        </div>
      </div>
    </div>
  </DesktopInspectionLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { saveNombreResponsable, searchResponsables } from '@core/services/api'
import DesktopInspectionLayout from '../layouts/DesktopInspectionLayout.vue'

const router     = useRouter()
const nombre     = ref('')
const sugerencias = ref<string[]>([])
const searching  = ref(false)
let debounce: ReturnType<typeof setTimeout> | null = null

watch(nombre, (val) => {
  if (val.trim().length < 2) { sugerencias.value = []; return }
  if (debounce) clearTimeout(debounce)
  debounce = setTimeout(async () => {
    searching.value = true
    try   { sugerencias.value = await searchResponsables(val.trim()) }
    catch { sugerencias.value = [] }
    finally { searching.value = false }
  }, 300)
})

const showList = computed(() => sugerencias.value.length > 0 && nombre.value.trim().length >= 2)
const pick     = (s: string) => { nombre.value = s; sugerencias.value = [] }
const closeSugerencias = () => setTimeout(() => { sugerencias.value = [] }, 150)

const highlight = (text: string, q: string) => {
  if (!q) return text
  return text.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<strong>$1</strong>')
}

const goBack   = () => router.push('/principal/tipo-servicio')
const continuar = () => {
  const n = nombre.value.trim()
  if (n.length >= 2) { saveNombreResponsable(n); router.push('/principal/revision') }
}
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

.step-wrap { display: flex; align-items: flex-start; justify-content: center; padding: 2rem 1rem; }

.step-card {
  background: $white; border-radius: 14px; border: 1px solid $border-color;
  box-shadow: $shadow-card; width: 100%; max-width: 520px; overflow: hidden;
}

.step-card__head {
  display: flex; align-items: center; gap: 1rem;
  padding: 1.375rem 1.5rem; border-bottom: 1px solid $border-color;
}

.step-card__icon {
  width: 46px; height: 46px; border-radius: 50%; background: $primary-red;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  svg { width: 20px; height: 20px; }
}

.step-card__title {
  font-family: $font-display; font-size: 20px; letter-spacing: $font-display-spacing;
  color: $text-dark; margin: 0 0 3px; line-height: 1;
}

.step-card__sub { font-family: $font-primary; font-size: 12.5px; color: $text-gray; margin: 0; }
.step-card__body { padding: 1.5rem; }

.field-label {
  display: block; font-family: $font-primary; font-size: 12.5px;
  font-weight: $font-bold; color: $text-dark; margin-bottom: 0.4rem;
}

.req { color: $primary-red; }

.autocomplete { position: relative; margin-bottom: 1.375rem; }
.input-wrap { position: relative; }

.field-input {
  width: 100%; padding: 0.6875rem 2.25rem 0.6875rem 0.8125rem;
  font-family: $font-primary; font-size: 14px; border: 1.5px solid $border-gray;
  border-radius: 9px; background: $white; color: $text-dark;
  transition: border-color 0.15s; box-sizing: border-box;
  &::placeholder { color: $placeholder-color; }
  &:focus { outline: none; border-color: $primary-red; box-shadow: 0 0 0 3px rgba($primary-red, 0.07); }
}

@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }
.spinner {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  width: 14px; height: 14px; border: 2px solid $border-color;
  border-top-color: $primary-red; border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.sugerencias {
  position: absolute; top: calc(100% + 4px); left: 0; right: 0;
  background: $white; border: 1px solid $border-color; border-radius: 9px;
  box-shadow: $shadow-dropdown; list-style: none; margin: 0; padding: 4px 0;
  z-index: 100; max-height: 200px; overflow-y: auto;
}

.sugerencias__item {
  padding: 0.5625rem 0.875rem; font-family: $font-primary; font-size: 13.5px;
  color: $text-dark; cursor: pointer; transition: background 0.12s;
  &:hover { background: $bg-page; }
  :deep(strong) { color: $primary-red; font-weight: $font-bold; }
}

.btn-row { display: flex; gap: 0.625rem; }

.btn-back {
  flex: 1; padding: 0.75rem; background: $white; color: $primary-red;
  border: 1.5px solid $primary-red; border-radius: 9px; font-family: $font-primary;
  font-size: 14px; font-weight: $font-semibold; cursor: pointer; transition: background 0.15s;
  &:hover { background: rgba($primary-red, 0.04); }
}

.btn-next {
  @include button-base; flex: 1; padding: 0.75rem; background: $primary-red;
  color: $white; font-size: 14px; font-weight: $font-semibold; border-radius: 9px;
  &:not(:disabled):hover { background: $primary-red-hover; }
  &:disabled { background: $btn-disabled-bg; cursor: not-allowed; }
}
</style>