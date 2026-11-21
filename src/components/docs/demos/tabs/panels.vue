<script setup lang="ts">
import { ref } from 'vue'
import { MdvTab, MdvTabPanel, MdvTabs, MdvTextField } from '@mdv-ui/mdv'
import type { MdvTabValue } from '@mdv-ui/mdv'

const selected = ref<MdvTabValue>('retained')
</script>

<template>
  <MdvTabs
    v-model="selected"
    class="min-w-0 max-w-md"
    scrollable
    swipeable
    aria-label="Draft workspace"
  >
    <MdvTab value="retained" label="Retained draft" />
    <MdvTab value="lazy" label="First-visit draft" />
    <MdvTab value="reset" label="Reset on return" />
    <MdvTab value="notes" label="Review and release notes" />
    <template #panels>
      <MdvTabPanel value="retained" class="space-y-3 p-3">
        <p>This field stays mounted when the panel is hidden.</p>
        <MdvTextField label="Retained draft" full-width />
      </MdvTabPanel>
      <MdvTabPanel value="lazy" class="space-y-3 p-3" lazy>
        <p>This field mounts on your first visit and keeps its draft afterward.</p>
        <MdvTextField label="First-visit draft" full-width />
      </MdvTabPanel>
      <MdvTabPanel value="reset" class="space-y-3 p-3" destroy-on-hide>
        <p>This field starts fresh each time you return.</p>
        <MdvTextField label="Temporary draft" full-width />
      </MdvTabPanel>
      <MdvTabPanel value="notes" class="p-3">
        On a touch screen, swipe across this text to go back to the previous panel.
      </MdvTabPanel>
    </template>
  </MdvTabs>
</template>
