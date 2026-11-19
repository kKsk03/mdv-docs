<script setup lang="ts">
import { MdvCircularProgress } from '@mdv-ui/mdv'
import type { MdvProgressVariant } from '@mdv-ui/mdv'

const variants: MdvProgressVariant[] = ['flat', 'wavy']
</script>

<template>
  <div class="grid gap-6">
    <div v-for="variant in variants" :key="variant" class="flex flex-wrap items-center gap-8">
      <MdvCircularProgress :value="60" :variant="variant" :label="`${variant}: 60%`" />
      <MdvCircularProgress indeterminate :variant="variant" :label="`${variant}: waiting`" />
    </div>
  </div>
</template>
