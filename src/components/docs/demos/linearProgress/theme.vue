<script setup lang="ts">
import { MdvLinearProgress } from '@mdv-ui/mdv'
</script>

<template>
  <div class="grid gap-4">
    <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" class="grid gap-6 rounded-xl bg-mdv-surface-container p-5 text-mdv-on-surface">
      <MdvLinearProgress :value="60" :label="`${theme}: primary`" />
      <MdvLinearProgress :value="60" variant="wavy" :label="`${theme}: tertiary`" style="--mdv-progress-active-color: var(--mdv-sys-color-tertiary); --mdv-progress-track-color: var(--mdv-sys-color-tertiary-container)" />
    </div>
  </div>
</template>
