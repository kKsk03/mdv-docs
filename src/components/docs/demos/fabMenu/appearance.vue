<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvFabMenu, MdvFabMenuItem, MdvSelect } from '@mdv-ui/mdv'
import type { MdvFabMenuColor, MdvFabMenuSize } from '@mdv-ui/mdv'

const size = ref<MdvFabMenuSize>('regular')
const color = ref<MdvFabMenuColor>('primary-container')
const elevated = ref(true)
const disabled = ref(false)
const rtl = ref(false)
const dark = ref(false)
const sizes = ['regular', 'medium', 'large'].map(value => ({ value, label: value }))
const colors = ['primary-container', 'secondary-container', 'tertiary-container', 'primary', 'secondary', 'tertiary'].map(value => ({ value, label: value }))
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-4">
      <MdvSelect :model-value="size" :options="sizes" label="Trigger size" @update:model-value="size = $event as MdvFabMenuSize" />
      <MdvSelect :model-value="color" :options="colors" label="Trigger color" @update:model-value="color = $event as MdvFabMenuColor" />
    </div>
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="elevated" label="Elevated surfaces" />
      <MdvCheckbox v-model="disabled" label="Disable trigger" />
      <MdvCheckbox v-model="rtl" label="Right-to-left layout" />
      <MdvCheckbox v-model="dark" label="Local dark theme" />
    </div>
    <div :dir="rtl ? 'rtl' : 'ltr'" :data-mdv-theme="dark ? 'dark' : undefined" class="relative min-h-80 rounded-xl bg-mdv-surface-container-low p-5 pb-32 text-mdv-on-surface">
      <p class="text-sm">Large triggers keep their original layout space while the close action becomes 56px.</p>
      <MdvFabMenu :size="size" :color="color" :elevated="elevated" :trigger-attrs="{ disabled }" label="More creation options" close-label="Close creation options" position="absolute" :offset="16">
        <MdvFabMenuItem label="New note" />
        <MdvFabMenuItem label="Create a shared project folder with a longer label" />
        <MdvFabMenuItem label="Import a template" />
      </MdvFabMenu>
    </div>
  </div>
</template>
