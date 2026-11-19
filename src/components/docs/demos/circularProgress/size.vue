<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvCircularProgress } from '@mdv-ui/mdv'

const thick = ref(false)
const sizes = [24, 40, 64, 96]
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="thick" label="Use an 8px stroke" />
    <div class="flex flex-wrap items-center gap-6">
      <MdvCircularProgress v-for="size in sizes" :key="size" :size="size" :thickness="thick ? 8 : 4" :value="65" :label="`${size}px`" />
    </div>
  </div>
</template>
