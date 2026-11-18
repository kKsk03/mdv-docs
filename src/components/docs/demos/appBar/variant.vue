<script setup lang="ts">
import { MdvAppBar } from '@mdv-ui/mdv'
import type { MdvAppBarVariant } from '@mdv-ui/mdv'

const variants: MdvAppBarVariant[] = ['small', 'medium', 'large']
</script>

<template>
  <div class="grid gap-5">
    <div v-for="variant in variants" :key="variant" class="grid gap-2">
      <p class="text-sm text-mdv-on-surface-variant">{{ variant }}</p>
      <MdvAppBar :variant="variant" title="Weekend plans" subtitle="Make time for something new" :heading-level="3" />
    </div>
  </div>
</template>
