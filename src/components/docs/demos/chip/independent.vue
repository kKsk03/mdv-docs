<script setup lang="ts">
import { ref } from 'vue'
import { MdvChip, MdvChipSet } from '@mdv-ui/mdv'

const saved = ref(false)
const person = ref(false)
</script>

<template>
  <div class="grid gap-4">
    <MdvChipSet label="Independent selections">
      <MdvChip v-model:selected="saved" variant="filter" label="Saved only" />
      <MdvChip v-model:selected="person" variant="input" label="Alex" selectable :removable="false">
        <template #avatar>
          <span class="grid size-full place-items-center bg-mdv-primary-container text-xs text-mdv-on-primary-container">AL</span>
        </template>
        <template #default="{ selected }">Alex{{ selected ? ' (selected)' : '' }}</template>
      </MdvChip>
    </MdvChipSet>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Saved only: {{ saved }} · Alex: {{ person }}</p>
  </div>
</template>
