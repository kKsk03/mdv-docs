<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvRichTooltip } from '@mdv-ui/mdv'

const detailsId = `storage-details-${useId()}`
const acknowledged = ref(false)
</script>

<template>
  <div class="grid min-w-0 justify-items-start gap-3">
    <MdvRichTooltip persistent title="Offline access" placement="bottom-start">
      <template #trigger="{ triggerProps }">
        <MdvButton v-bind="triggerProps" variant="outlined">About offline access</MdvButton>
      </template>
      <p>
        Downloads are available without a connection.
        <a :href="`#${detailsId}`" class="text-mdv-primary underline">Storage details</a>
      </p>
      <template #actions="{ close }">
        <MdvButton variant="text" @click="acknowledged = true; close()">Got it</MdvButton>
      </template>
    </MdvRichTooltip>
    <p :id="detailsId" tabindex="-1" class="text-sm text-mdv-on-surface-variant">
      Storage details: downloads stay on this device until removed.
    </p>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      {{ acknowledged ? 'Offline help acknowledged.' : 'Offline help not acknowledged.' }}
    </p>
  </div>
</template>
