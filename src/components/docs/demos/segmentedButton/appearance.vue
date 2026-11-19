<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvSegmentedButton, MdvSegmentedButtonItem } from '@mdv-ui/mdv'
import type { MdvSegmentedButtonDensity, MdvSegmentedButtonModelValue } from '@mdv-ui/mdv'

const densities: MdvSegmentedButtonDensity[] = [0, -1, -2, -3]
const value = ref<MdvSegmentedButtonModelValue>('week')
const disabled = ref(false)
const dark = ref(false)
const rtl = ref(false)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="disabled" label="Disable all segments" />
      <MdvCheckbox v-model="dark" label="Local dark theme" />
      <MdvCheckbox v-model="rtl" label="Right to left" />
    </div>
    <div :data-mdv-theme="dark ? 'dark' : 'light'" :dir="rtl ? 'rtl' : 'ltr'" class="grid min-w-0 gap-4 rounded-xl bg-mdv-surface p-4 text-mdv-on-surface">
      <div v-for="density in densities" :key="density" class="grid min-w-0 gap-1">
        <p class="text-sm">Density {{ density }} · Surface {{ 40 + density * 4 }}px</p>
        <MdvSegmentedButton v-model="value" :density="density" :disabled="disabled" :aria-label="`Period at density ${density}`" full-width>
          <MdvSegmentedButtonItem value="day" label="Day" />
          <MdvSegmentedButtonItem value="week" label="Week" />
          <MdvSegmentedButtonItem value="month" label="Month" />
        </MdvSegmentedButton>
      </div>
      <div class="w-full max-w-[240px] min-w-0">
        <MdvSegmentedButton :disabled="disabled" aria-label="Scrollable long labels" full-width>
          <MdvSegmentedButtonItem value="workspace" label="Shared workspace" />
          <MdvSegmentedButtonItem value="library" label="Personal library" />
          <MdvSegmentedButtonItem value="archive" label="Archived projects" />
        </MdvSegmentedButton>
      </div>
    </div>
  </div>
</template>
