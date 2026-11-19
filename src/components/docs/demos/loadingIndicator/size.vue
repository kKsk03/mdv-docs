<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvLoadingIndicator } from '@mdv-ui/mdv'

const contained = ref(true)
</script>

<template>
  <div class="grid gap-5">
    <MdvCheckbox v-model="contained" label="Use contained indicators" />
    <div class="flex flex-wrap items-center gap-6">
      <div v-for="size in [24, 48, 96, 240]" :key="size" class="grid justify-items-center gap-3">
        <MdvLoadingIndicator :size="size" :contained="contained" :label="`Loading at ${size}px`" />
        <span class="text-sm">{{ size }}px</span>
      </div>
    </div>
  </div>
</template>
