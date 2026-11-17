<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton variant="filled">filled</MdvButton>
    <MdvButton variant="tonal">tonal</MdvButton>
    <MdvButton variant="outlined">outlined</MdvButton>
    <MdvButton variant="elevated">elevated</MdvButton>
    <MdvButton variant="text">text</MdvButton>
    <MdvButton variant="link" href="https://www.google.com" target="_blank">link</MdvButton>
  </div>
</template>
