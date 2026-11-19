<script setup lang="ts">
import { ref } from 'vue'
import { MdvIcon, MdvIconButton, MdvTooltip } from '@mdv-ui/mdv'
import refreshIcon from '@iconify-icons/material-symbols/refresh'

const refreshes = ref(0)
</script>

<template>
  <div class="flex flex-wrap items-center gap-5">
    <MdvTooltip text="Refresh results" placement="top">
      <template #trigger="{ triggerProps }">
        <MdvIconButton v-bind="triggerProps" variant="standard" aria-label="Refresh results" @click="refreshes++"><MdvIcon :icon="refreshIcon" /></MdvIconButton>
      </template>
    </MdvTooltip>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Refreshed {{ refreshes }} times. Hover or focus the action to see its tooltip.</p>
  </div>
</template>
