<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvIcon, MdvIconButton, MdvSelect, MdvTextField } from '@mdv-ui/mdv'
import type { MdvIconButtonColor, MdvIconButtonVariant } from '@mdv-ui/mdv'
import favoriteIcon from '@iconify-icons/material-symbols/favorite'

const variant = ref<MdvIconButtonVariant>('filled')
const dark = ref(false)
const seedDraft = ref('#006c4c')
const seed = ref<`#${string}`>('#006c4c')
const error = ref('')
const variants = ['filled', 'tonal', 'outlined', 'standard'].map(value => ({ value, label: value }))
const presets: MdvIconButtonColor[] = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info']
const colors = computed<{ label: string; value: MdvIconButtonColor | undefined }[]>(() => [
  { label: 'default', value: undefined },
  ...presets.map(value => ({ label: value, value })),
  { label: seed.value, value: seed.value },
])

function applySeed() {
  if (!/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(seedDraft.value)) {
    error.value = 'Use #RGB or #RRGGBB, for example #06C or #006c4c.'
    return
  }
  seed.value = seedDraft.value as `#${string}`
  error.value = ''
}
</script>

<template>
  <div class="grid gap-5">
    <MdvSelect :model-value="variant" :options="variants" label="Color preview variant" @update:model-value="variant = $event as MdvIconButtonVariant" />
    <form class="flex flex-wrap items-start gap-3" novalidate @submit.prevent="applySeed">
      <MdvTextField v-model="seedDraft" label="Local seed color" :error="!!error" :error-text="error" />
      <MdvButton type="submit" variant="tonal">Apply seed</MdvButton>
    </form>
    <MdvCheckbox v-model="dark" label="Local dark theme" />
    <div :data-mdv-theme="dark ? 'dark' : undefined" class="flex flex-wrap gap-6 rounded-xl bg-mdv-surface-container-low p-5 text-mdv-on-surface">
      <div v-for="color in colors" :key="color.label" class="grid justify-items-center gap-2">
        <MdvIconButton :variant="variant" :color="color.value" :aria-label="`Favorite, ${color.label}`"><MdvIcon :icon="favoriteIcon" /></MdvIconButton>
        <span class="text-sm">{{ color.label }}</span>
      </div>
    </div>
  </div>
</template>
