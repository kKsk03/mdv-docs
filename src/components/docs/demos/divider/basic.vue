<script setup lang="ts">
import { MdvDivider } from '@mdv-ui/mdv'
import type { MdvDividerVariant } from '@mdv-ui/mdv'

const variants: MdvDividerVariant[] = ['full-width', 'inset', 'middle-inset']
</script>

<template>
  <div class="grid gap-5">
    <div v-for="variant in variants" :key="variant" class="rounded-xl bg-mdv-surface-container-low">
      <p class="p-4 font-medium">{{ variant }}</p>
      <MdvDivider :variant="variant" />
      <p class="p-4 text-sm text-mdv-on-surface-variant">Related content stays together; the line separates the next group.</p>
    </div>
  </div>
</template>
