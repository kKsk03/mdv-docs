<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvButton, MdvCheckbox } from '@mdv-ui/mdv'

const visible = ref(true)
const clicks = ref(0)
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="visible" label="Show badge" />
    <MdvBadge :visible="visible" aria-label="New updates available">
      <MdvButton variant="tonal" @click="clicks++">Open updates</MdvButton>
    </MdvBadge>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Opened {{ clicks }} times.</p>
  </div>
</template>
