<script setup lang="ts">
import { MdvBadge, MdvButton } from '@mdv-ui/mdv'

const values = [0, 7, 99, '99+', 'New']
</script>

<template>
  <div class="flex flex-wrap items-center gap-8 py-2">
    <MdvBadge v-for="value in values" :key="value" variant="large" :content="value" :aria-label="`Status: ${value}`">
      <MdvButton variant="tonal">Inbox</MdvButton>
    </MdvBadge>
  </div>
</template>
