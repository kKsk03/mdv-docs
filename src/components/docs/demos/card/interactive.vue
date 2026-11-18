<script setup lang="ts">
import { ref } from 'vue'
import { MdvCard, MdvCheckbox } from '@mdv-ui/mdv'

const disabled = ref(false)
const opened = ref(0)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="disabled" label="Disable card actions" />
    <div class="grid gap-5 sm:grid-cols-2">
      <MdvCard clickable :disabled="disabled" title="Open collection" subtitle="Whole-card button" @click="opened++">
        <p class="text-sm">Click anywhere on the card, or focus it and press Enter or Space.</p>
      </MdvCard>
      <MdvCard href="https://m3.material.io/components/cards/overview" target="_blank" rel="noreferrer" :disabled="disabled" title="Card design guidance" subtitle="Opens in a new tab">
        <p class="text-sm">A native link supports browser navigation and opening in a new tab.</p>
      </MdvCard>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Collection opened {{ opened }} times.</p>
  </div>
</template>
