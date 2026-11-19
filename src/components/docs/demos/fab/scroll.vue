<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvAppBar, MdvAppBarScaffold, MdvCheckbox, MdvExtendedFab, MdvIcon } from '@mdv-ui/mdv'
import editIcon from '@iconify-icons/material-symbols/edit-outline'

const scaffold = useTemplateRef<InstanceType<typeof MdvAppBarScaffold>>('scaffold')
const expanded = ref(true)
const collapseOnScroll = ref(true)
const notes = ref(0)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="collapseOnScroll" label="Collapse on downward scroll" />
    <div class="relative h-88 overflow-hidden rounded-xl border border-mdv-outline-variant bg-mdv-surface-container-low">
      <MdvAppBarScaffold ref="scaffold" class="h-full" :content-attrs="{ 'aria-label': 'Scrollable field notes', tabindex: 0 }">
        <template #appbar><MdvAppBar title="Field notes" variant="small" /></template>
        <div class="grid gap-6 p-5 pb-28">
          <p v-for="index in 18" :key="index" class="text-sm">Note {{ index }}: scroll this preview down to collapse the action, then scroll up to show its label.</p>
        </div>
      </MdvAppBarScaffold>
      <MdvExtendedFab v-model:expanded="expanded" position="absolute" :scroll-behavior="collapseOnScroll ? 'collapse' : 'none'" :scroll-target="() => scaffold?.contentElement" @click="notes++">
        <template #leading><MdvIcon :icon="editIcon" /></template>
        Write note
      </MdvExtendedFab>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Label: {{ expanded ? 'expanded' : 'collapsed' }} · Notes: {{ notes }}</p>
  </div>
</template>
