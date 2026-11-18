<script setup lang="ts">
import { MdvCard } from '@mdv-ui/mdv'
import type { MdvCardVariant } from '@mdv-ui/mdv'

const variants: MdvCardVariant[] = ['outlined', 'filled', 'elevated']
</script>

<template>
  <div class="grid gap-5 sm:grid-cols-3">
    <MdvCard v-for="variant in variants" :key="variant" :variant="variant" :title="variant.charAt(0).toUpperCase() + variant.slice(1)" subtitle="Collection">
      <p class="text-sm">Keep related information together in one surface.</p>
    </MdvCard>
  </div>
</template>
