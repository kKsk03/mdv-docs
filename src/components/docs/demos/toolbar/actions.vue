<script setup lang="ts">
import { ref } from 'vue'
import { MdvIcon, MdvIconButton, MdvToolbar } from '@mdv-ui/mdv'
import boldIcon from '@iconify-icons/material-symbols/format-bold'
import italicIcon from '@iconify-icons/material-symbols/format-italic'
import underlineIcon from '@iconify-icons/material-symbols/format-underlined'

const bold = ref(false)
const italic = ref(false)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvToolbar align="between" aria-label="Text formatting">
      <MdvIconButton v-model:selected="bold" variant="standard" aria-label="Bold">
        <MdvIcon :icon="boldIcon" />
      </MdvIconButton>
      <MdvIconButton variant="standard" aria-label="Underline" disabled>
        <MdvIcon :icon="underlineIcon" />
      </MdvIconButton>
      <MdvIconButton v-model:selected="italic" variant="standard" aria-label="Italic">
        <MdvIcon :icon="italicIcon" />
      </MdvIconButton>
    </MdvToolbar>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      Bold: {{ bold ? 'on' : 'off' }}; italic: {{ italic ? 'on' : 'off' }}.
    </p>
  </div>
</template>
