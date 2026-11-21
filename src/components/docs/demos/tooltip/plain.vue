<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvCheckbox, MdvIcon, MdvIconButton, MdvTooltip } from '@mdv-ui/mdv'
import refreshIcon from '@iconify-icons/material-symbols/refresh'

const noteId = `refresh-note-${useId()}`
const disabled = ref(false)
const count = ref(0)
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
      <MdvTooltip text="Fetch the latest preview data." :disabled="disabled">
        <template #trigger="{ triggerProps }">
          <MdvIconButton
            v-bind="triggerProps"
            variant="standard"
            aria-label="Refresh preview"
            :aria-describedby="noteId"
            @click="count++"
          >
            <MdvIcon :icon="refreshIcon" />
          </MdvIconButton>
        </template>
      </MdvTooltip>
      <MdvCheckbox v-model="disabled" label="Disable the tooltip" />
    </div>
    <p :id="noteId" class="text-sm text-mdv-on-surface-variant">Refreshing never changes the saved draft.</p>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Refreshes: {{ count }}</p>
  </div>
</template>
