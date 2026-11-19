<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvDivider } from '@mdv-ui/mdv'

const rtl = ref(false)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="rtl" label="Right-to-left layout" />
    <div class="grid gap-4 sm:grid-cols-2" :dir="rtl ? 'rtl' : 'ltr'">
      <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" class="grid gap-4 rounded-xl bg-mdv-surface-container-low py-4 text-mdv-on-surface">
        <p class="px-4 font-medium">{{ theme }} · logical start inset</p>
        <MdvDivider variant="inset" />
        <p class="px-4 text-sm">The 16px inset follows the text direction.</p>
      </div>
    </div>
    <div class="grid gap-4 rounded-xl bg-mdv-surface-container-low py-4" style="--mdv-sys-color-outline-variant: var(--mdv-sys-color-primary)">
      <p class="px-4 text-sm">A local color role and a 2px line</p>
      <MdvDivider variant="middle-inset" style="height: 2px" />
    </div>
  </div>
</template>
