<script setup lang="ts">
import { ref } from 'vue'
import { MdvRadio, MdvRadioGroup } from '@mdv-ui/mdv'
import type { MdvRadioColor, MdvRadioModelValue } from '@mdv-ui/mdv'

const selected = ref<MdvRadioModelValue>('primary')
const colors: MdvRadioColor[] = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info', '#006c4c']
const preference = ref<MdvRadioModelValue>('inherited')
</script>

<template>
  <div class="grid gap-5">
    <MdvRadioGroup v-model="selected" label="Theme roles and seed colors" orientation="horizontal">
      <MdvRadio v-for="color in colors" :key="color" :value="color" :color="color" :label="color" />
    </MdvRadioGroup>
    <div class="grid gap-4 sm:grid-cols-2">
      <div v-for="theme in ['light', 'dark'] as const" :key="theme" :data-mdv-theme="theme" :dir="theme === 'dark' ? 'rtl' : 'ltr'" class="rounded-xl bg-mdv-surface-container-low p-4 text-mdv-on-surface">
        <MdvRadioGroup v-model="preference" color="tertiary" :label="`${theme} theme${theme === 'dark' ? ' · RTL' : ''}`">
          <MdvRadio value="inherited" label="Inherited tertiary" />
          <MdvRadio value="override" color="#006c4c" label="Local seed override" />
          <MdvRadio value="disabled" label="Disabled" disabled />
        </MdvRadioGroup>
      </div>
    </div>
  </div>
</template>
