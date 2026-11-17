<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton hover-shadow>Button</MdvButton>
    <MdvButton variant="tonal" hover-shadow>Tonal</MdvButton>
    <MdvButton variant="elevated" hover-shadow>Elevated</MdvButton>
  </div>
</template>
