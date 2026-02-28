<template>
  <div class="m-ac" ref="container">
    <input
      v-model="query"
      class="m-ac__input"
      :placeholder="placeholder"
      autocomplete="off"
      inputmode="text"
      @input="onInput"
      @keydown="onKeydown"
      @focus="showDropdown = filtered.length > 0"
      @blur="onBlur"
    />

    <div v-if="showDropdown && filtered.length > 0" class="m-ac__dropdown">
      <div
        v-for="(item, i) in filtered"
        :key="item"
        class="m-ac__item"
        :class="{ 'm-ac__item--active': i === activeIndex }"
        @mousedown.prevent="select(item)"
        @touchstart.prevent="select(item)"
      >
        <span v-html="highlight(item)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  allMaterials: string[]
}>()

const emit = defineEmits<{ 'update:modelValue': [string] }>()

const container    = ref<HTMLElement | null>(null)
const query        = ref(props.modelValue)
const showDropdown = ref(false)
const activeIndex  = ref(-1)

watch(() => props.modelValue, v => { if (v !== query.value) query.value = v })

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q || q.length < 2) return []
  return props.allMaterials.filter(m => m.toLowerCase().includes(q)).slice(0, 6)
})

const onInput = () => {
  emit('update:modelValue', query.value)
  activeIndex.value = -1
  showDropdown.value = filtered.value.length > 0
}

const onBlur = () => setTimeout(() => { showDropdown.value = false }, 200)

const onKeydown = (e: KeyboardEvent) => {
  if (!showDropdown.value || !filtered.value.length) return
  if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex.value = Math.min(activeIndex.value + 1, filtered.value.length - 1) }
  else if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex.value = Math.max(activeIndex.value - 1, 0) }
  else if (e.key === 'Enter' && activeIndex.value >= 0) { e.preventDefault(); select(filtered.value[activeIndex.value]) }
  else if (e.key === 'Escape') { showDropdown.value = false }
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
@import '@ui/assets/styles/variables';

.m-ac { position: relative; flex: 1; }

.m-ac__input {
  width: 100%; border: none; outline: none; background: transparent;
  font-family: $font-primary; font-size: 13px; color: $text-dark;
  &::placeholder { color: $text-gray; }
}

.m-ac__dropdown {
  position: absolute; top: calc(100% + 6px); left: -10px; right: -60px;
  background: $white; border: 1.5px solid $border-color; border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12); z-index: 100; overflow: hidden;
  max-height: 200px; overflow-y: auto;
}

.m-ac__item {
  padding: 10px 14px;
  font-family: $font-primary; font-size: 13px; color: $text-dark;
  cursor: pointer; transition: background 0.1s;
  border-bottom: 1px solid $border-color;
  &:last-child { border-bottom: none; }
  &:active, &--active { background: rgba($primary-red, 0.06); }

  :deep(mark) {
    background: none; color: $primary-red; font-weight: 700;
  }
}
</style>