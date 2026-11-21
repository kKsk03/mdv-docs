<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvIcon, MdvIconButton, MdvToolbar } from '@mdv-ui/mdv'
import editIcon from '@iconify-icons/material-symbols/edit-outline'
import saveIcon from '@iconify-icons/material-symbols/save'

const scrollArea = useTemplateRef<HTMLElement>('scrollArea')
const expanded = ref(true)
const result = ref('No action yet.')
const notes = [
  'Set up the workspace before inviting reviewers.',
  'Outline the first draft and identify open questions.',
  'Collect feedback from the pilot group.',
  'Review the navigation and common actions.',
  'Check the preview on a narrow viewport.',
  'Prepare a short summary for the next meeting.',
  'Review the final changes before sharing.',
  'Archive the previous draft after approval.',
]
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="relative h-80 overflow-hidden rounded-2xl border border-mdv-outline-variant">
      <div
        ref="scrollArea"
        role="region"
        aria-label="Scrollable draft notes"
        tabindex="0"
        class="h-full overflow-y-auto py-4 ps-4 pe-28 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mdv-primary"
      >
        <ol class="grid list-decimal gap-4 ps-5">
          <li v-for="note in notes" :key="note" class="rounded-lg bg-mdv-surface-container-low p-3 text-sm">
            {{ note }}
          </li>
        </ol>
      </div>
      <MdvToolbar
        v-model:expanded="expanded"
        variant="floating"
        orientation="vertical"
        position="absolute"
        placement="end"
        scroll-behavior="collapse"
        :scroll-target="() => scrollArea"
        aria-label="Draft editing"
        expand-label="Expand draft actions"
        collapse-label="Collapse draft actions"
      >
        <template #leading>
          <MdvIconButton variant="standard" aria-label="Edit draft" @click="result = 'Edited the draft.'">
            <MdvIcon :icon="editIcon" />
          </MdvIconButton>
        </template>
        <MdvIconButton variant="filled" aria-label="Save draft" @click="result = 'Saved the draft.'">
          <MdvIcon :icon="saveIcon" />
        </MdvIconButton>
      </MdvToolbar>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      {{ expanded ? 'Expanded' : 'Collapsed' }}. {{ result }}
    </p>
  </div>
</template>
