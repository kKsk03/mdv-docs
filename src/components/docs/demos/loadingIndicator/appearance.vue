<script setup lang="ts">
import { MdvLoadingIndicator } from '@mdv-ui/mdv'
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" class="grid justify-items-center gap-4 rounded-xl bg-mdv-surface-container p-5 text-mdv-on-surface">
      <span class="text-sm font-medium">{{ theme }}</span>
      <div class="flex flex-wrap justify-center gap-8">
        <div class="grid justify-items-center gap-3">
          <MdvLoadingIndicator :label="`${theme}: loading preview`" />
          <span class="text-sm">Default</span>
        </div>
        <div class="grid justify-items-center gap-3">
          <MdvLoadingIndicator contained :label="`${theme}: loading contained preview`" />
          <span class="text-sm">Contained</span>
        </div>
      </div>
    </div>
  </div>
</template>
