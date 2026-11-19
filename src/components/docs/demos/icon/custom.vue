<script setup lang="ts">
import { MdvButton, MdvIcon } from '@mdv-ui/mdv'
import type { MdvIconData } from '@mdv-ui/mdv'

// Trusted local artwork in Iconify's data format; no icon-data package is needed.
const diamond: MdvIconData = {
  width: 24,
  height: 24,
  body: '<path fill="currentColor" d="M12 2 22 12 12 22 2 12Z"/>',
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-6">
    <span class="inline-flex items-center gap-2 text-mdv-primary"><MdvIcon :icon="diamond" :size="32" />Local artwork</span>
    <MdvButton variant="tonal"><template #leading><MdvIcon :icon="diamond" /></template>Explore collection</MdvButton>
  </div>
</template>
