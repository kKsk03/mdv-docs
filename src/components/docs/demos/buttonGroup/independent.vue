<script setup lang="ts">
import { ref } from 'vue'
import { MdvButtonGroup, MdvButtonGroupItem, MdvIcon } from '@mdv-ui/mdv'
import boldIcon from '@iconify-icons/material-symbols/format-bold'
import italicIcon from '@iconify-icons/material-symbols/format-italic'
import underlineIcon from '@iconify-icons/material-symbols/format-underlined'

const bold = ref(false)
const italic = ref(false)
const underline = ref(false)
</script>

<template>
  <div class="grid gap-4">
    <MdvButtonGroup selection="none" aria-label="Text formatting">
      <MdvButtonGroupItem v-model:selected="bold" icon-only variant="tonal" aria-label="Bold">
        <MdvIcon :icon="boldIcon" />
      </MdvButtonGroupItem>
      <MdvButtonGroupItem v-model:selected="italic" icon-only variant="tonal" aria-label="Italic">
        <MdvIcon :icon="italicIcon" />
      </MdvButtonGroupItem>
      <MdvButtonGroupItem v-model:selected="underline" icon-only variant="tonal" aria-label="Underline">
        <MdvIcon :icon="underlineIcon" />
      </MdvButtonGroupItem>
    </MdvButtonGroup>
    <p :class="{ 'font-bold': bold, italic, underline }">A short note with independent formatting.</p>
  </div>
</template>
