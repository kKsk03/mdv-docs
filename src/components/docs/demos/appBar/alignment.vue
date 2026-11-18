<script setup lang="ts">
import { MdvAppBar, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import type { MdvAppBarTitleAlignment } from '@mdv-ui/mdv'
import arrowBack from '@iconify-icons/material-symbols/arrow-back'

const alignments: MdvAppBarTitleAlignment[] = ['start', 'center']
</script>

<template>
  <div class="grid gap-5">
    <div v-for="alignment in alignments" :key="alignment" class="grid gap-2">
      <p class="text-sm text-mdv-on-surface-variant">{{ alignment }}</p>
      <MdvAppBar title="My library" :title-alignment="alignment" :heading-level="3">
        <template #leading>
          <MdvIconButton variant="standard" aria-label="Go back">
            <MdvIcon :icon="arrowBack" />
          </MdvIconButton>
        </template>
      </MdvAppBar>
    </div>
  </div>
</template>
