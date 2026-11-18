<script setup lang="ts">
import { MdvAppBar } from '@mdv-ui/mdv'
import type { MdvAppBarAppearance } from '@mdv-ui/mdv'

const appearances: MdvAppBarAppearance[] = ['default', 'elevated', 'bordered']
</script>

<template>
  <div class="grid gap-6">
    <div v-for="appearance in appearances" :key="appearance" class="grid gap-2">
      <p class="text-sm text-mdv-on-surface-variant">{{ appearance }}</p>
      <MdvAppBar :appearance="appearance" title="My library" :scrolled="true" :heading-level="3" />
    </div>
  </div>
</template>
