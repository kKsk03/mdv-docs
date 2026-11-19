<script setup lang="ts">
import { ref } from 'vue'
import { MdvDivider, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import boldIcon from '@iconify-icons/material-symbols/format-bold'
import italicIcon from '@iconify-icons/material-symbols/format-italic'
import underlineIcon from '@iconify-icons/material-symbols/format-underlined'

const bold = ref(false)
const italic = ref(false)
const underline = ref(false)
</script>

<template>
  <div class="grid gap-5">
    <div role="group" aria-label="Text formatting" class="flex h-16 items-center gap-2 rounded-xl bg-mdv-surface-container-low px-3">
      <MdvIconButton v-model:selected="bold" aria-label="Bold"><MdvIcon :icon="boldIcon" /></MdvIconButton>
      <MdvDivider orientation="vertical" />
      <MdvIconButton v-model:selected="italic" aria-label="Italic"><MdvIcon :icon="italicIcon" /></MdvIconButton>
      <MdvDivider orientation="vertical" class="h-8 self-center" />
      <MdvIconButton v-model:selected="underline" aria-label="Underline"><MdvIcon :icon="underlineIcon" /></MdvIconButton>
    </div>
    <p :class="{ 'font-bold': bold, italic, underline }">A line separates actions without becoming another Tab stop.</p>
    <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-4 rounded-xl bg-mdv-surface-container-low p-4">
      <p>Short note</p>
      <MdvDivider orientation="vertical" variant="middle-inset" />
      <p class="text-sm text-mdv-on-surface-variant">The divider stretches with this grid row, even when one side contains more text.</p>
    </div>
  </div>
</template>
