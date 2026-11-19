<script setup lang="ts">
import { MdvLinearProgress } from '@mdv-ui/mdv'
import type { MdvProgressVariant } from '@mdv-ui/mdv'

const variants: MdvProgressVariant[] = ['flat', 'wavy']
</script>

<template>
  <div class="grid gap-7">
    <div v-for="variant in variants" :key="variant" class="grid gap-4">
      <MdvLinearProgress :variant="variant" :value="55" :label="`${variant}: determinate`" />
      <MdvLinearProgress :variant="variant" indeterminate :label="`${variant}: indeterminate`" />
    </div>
  </div>
</template>
