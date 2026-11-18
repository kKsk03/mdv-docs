<script setup lang="ts">
import { MdvAppBar } from '@mdv-ui/mdv'
</script>

<template>
  <MdvAppBar variant="large" title="Explore new places" subtitle="A little inspiration for your next trip" :heading-level="3">
    <template #image>
      <svg width="96" height="32" viewBox="0 0 96 32" role="img" aria-label="Explore brand">
        <path d="M16 0 32 16 16 32 0 16Z" fill="currentColor" />
        <text x="40" y="23" font-size="20" fill="currentColor">MDV</text>
      </svg>
    </template>
  </MdvAppBar>
</template>
