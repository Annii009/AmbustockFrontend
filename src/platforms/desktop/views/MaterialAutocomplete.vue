<template>
  <div class="autocomplete" ref="container">
    <input
      ref="inputRef"
      v-model="query"
      class="mat-input mat-input--name"
      :placeholder="placeholder"
      autocomplete="off"
      @input="onInput"
      @keydown="onKeydown"
      @focus="onFocus"
      @blur="onBlur"
    />

    <Teleport to="body">
      <div
        v-if="showDropdown && filtered.length > 0"
        class="ac-dropdown"
        :style="dropdownStyle"
        @mousedown.prevent
      >
        <div
          v-for="(item, i) in filtered"
          :key="item"
          class="ac-item"
          :class="{ 'ac-item--active': i === activeIndex }"
          @click="select(item)"
        >
          <span class="ac-item__text" v-html="highlight(item)" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  allMaterials: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [string]
}>()

const inputRef   = ref<HTMLInputElement | null>(null)
const container  = ref<HTMLElement | null>(null)
const query      = ref(props.modelValue)
const showDropdown = ref(false)
const activeIndex  = ref(-1)
const dropdownStyle = ref({} as Record<string, string>)

watch(() => props.modelValue, v => { if (v !== query.value) query.value = v })

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q || q.length < 2) return []
  return props.allMaterials
    .filter(m => m.toLowerCase().includes(q))
    .slice(0, 8)
})

const computePosition = () => {
  const el = inputRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  dropdownStyle.value = {
    position: 'fixed',
    top:  `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    width: `${Math.max(rect.width, 240)}px`,
    zIndex: '9999'
  }
}

const onInput = () => {
  emit('update:modelValue', query.value)
  activeIndex.value = -1
  computePosition()
  showDropdown.value = true
}

const onFocus = () => {
  computePosition()
  if (filtered.value.length > 0) showDropdown.value = true
}

const onBlur = () => {
  // pequeño delay para permitir click en item
  setTimeout(() => { showDropdown.value = false }, 150)
}

const onKeydown = (e: KeyboardEvent) => {
  if (!showDropdown.value || filtered.value.length === 0) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, filtered.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (e.key === 'Enter' && activeIndex.value >= 0) {
    e.preventDefault()
    select(filtered.value[activeIndex.value])
  } else if (e.key === 'Escape') {
    showDropdown.value = false
  }
}

const select = (item: string) => {
  query.value = item
  emit('update:modelValue', item)
  showDropdown.value = false
  activeIndex.value  = -1
}

const highlight = (text: string) => {
  const q = query.value.trim()
  if (!q) return text
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(re, '<mark>$1</mark>')
}
</script>

<style scoped lang="scss">
.autocomplete { position: relative; flex: 1; display: flex; }

// Hereda estilos del padre via clase global
.mat-input {
  flex: 1; border: 1px solid transparent; border-radius: 6px; background: transparent;
  font-family: inherit; font-size: 13px; color: inherit; outline: none; transition: all 0.12s;
  padding: 0.25rem 0.5rem;
  &::placeholder { color: #9ca3af; }
  &:focus { background: white; border-color: #891D1A; }
  &--name { width: 100%; }
}
</style>

<style lang="scss">
// Global - dropdown esta n body via Teleport
.ac-dropdown {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  overflow: hidden;
  max-height: 240px;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }
}

.ac-item {
  padding: 0.5rem 0.875rem;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: #210706;
  cursor: pointer;
  transition: background 0.1s;

  &:hover, &--active { background: rgba(137, 29, 26, 0.06); }

  mark {
    background: none;
    color: #891D1A;
    font-weight: 700;
  }
}
</style>