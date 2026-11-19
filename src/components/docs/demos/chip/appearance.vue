<script setup lang="ts">
import { ref } from 'vue'
import { MdvChip, MdvChipSet } from '@mdv-ui/mdv'
import type { MdvChipColor } from '@mdv-ui/mdv'

const colors: MdvChipColor[] = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info', '#006c4c']
const message = ref('Try the elevated actions or toggle a color filter.')
</script>

<template>
  <div class="grid gap-4">
    <MdvChipSet label="Elevated chips">
      <MdvChip label="Assist" elevated @click="message = 'Elevated assist activated.'" />
      <MdvChip variant="suggestion" label="Suggestion" elevated @click="message = 'Elevated suggestion activated.'" />
      <MdvChip variant="filter" label="Filter" elevated />
    </MdvChipSet>
    <MdvChipSet label="Theme roles and a local seed">
      <MdvChip v-for="color in colors" :key="color" variant="filter" :label="color" :color="color" />
    </MdvChipSet>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
