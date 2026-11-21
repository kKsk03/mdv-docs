<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvDialog, MdvRichTooltip } from '@mdv-ui/mdv'
import type { MdvTooltipCloseDetail } from '@mdv-ui/mdv'

const dialogOpen = ref(false)
const tooltipOpen = ref(false)
const autoSelected = ref(false)
const lastClose = ref<MdvTooltipCloseDetail['reason'] | null>(null)
</script>

<template>
  <div class="grid min-w-0 justify-items-start gap-3">
    <MdvButton variant="outlined" @click="dialogOpen = true">Open preview settings</MdvButton>
    <MdvDialog v-model="dialogOpen" title="Preview settings">
      <p class="mb-3">Focus or hover over the resolution action for more context.</p>
      <MdvRichTooltip
        v-model="tooltipOpen"
        title="Automatic resolution"
        text="The preview size follows the available space."
        @close="lastClose = $event.reason"
      >
        <template #trigger="{ triggerProps }">
          <MdvButton v-bind="triggerProps" variant="outlined" @click="autoSelected = true">
            Use auto resolution
          </MdvButton>
        </template>
      </MdvRichTooltip>
      <template #actions="{ close }">
        <MdvButton variant="text" autofocus @click="close()">Close settings</MdvButton>
      </template>
    </MdvDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      {{ autoSelected ? 'Automatic resolution selected.' : 'Resolution unchanged.' }}
      Last tooltip close: {{ lastClose ?? 'none' }}.
    </p>
  </div>
</template>
