<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton :loading="true">loading</MdvButton>
    <MdvButton :disabled="true" :loading="true">disabled & loading</MdvButton>
    <MdvButton :disabled="true" :loading="true" loading-text="Loading...">disabled & loading</MdvButton>
  </div>
</template>
