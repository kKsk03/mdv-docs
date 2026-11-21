<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvFab, MdvIcon, MdvIconButton, MdvToolbar } from '@mdv-ui/mdv'
import addIcon from '@iconify-icons/material-symbols/add'
import editIcon from '@iconify-icons/material-symbols/edit-outline'
import moreIcon from '@iconify-icons/material-symbols/expand-more'
import lessIcon from '@iconify-icons/material-symbols/expand-less'
import pinIcon from '@iconify-icons/material-symbols/push-pin-outline'

const paired = ref(false)
const expanded = ref(true)
const pinned = ref(false)
const result = ref('No action yet.')
</script>

<template>
  <div class="grid min-w-0 justify-items-start gap-4">
    <MdvCheckbox v-model="paired" label="Pair with a floating action button" />
    <MdvToolbar
      v-model:expanded="expanded"
      variant="floating"
      color="vibrant"
      aria-label="Note actions"
      expand-label="Expand note actions"
      collapse-label="Collapse note actions"
    >
      <template #leading>
        <MdvIconButton v-model:selected="pinned" variant="standard" aria-label="Pin note">
          <MdvIcon :icon="pinIcon" />
        </MdvIconButton>
      </template>
      <MdvIconButton variant="filled" aria-label="Edit note" @click="result = 'Edited the note.'">
        <MdvIcon :icon="editIcon" />
      </MdvIconButton>
      <template v-if="paired" #fab>
        <MdvFab aria-label="Add note" @click="result = 'Added a note.'">
          <MdvIcon :icon="addIcon" />
        </MdvFab>
      </template>
      <template #toggle="{ expanded: isExpanded, toggleProps }">
        <MdvIconButton v-bind="toggleProps" variant="standard">
          <MdvIcon :icon="isExpanded ? lessIcon : moreIcon" />
        </MdvIconButton>
      </template>
    </MdvToolbar>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      {{ expanded ? 'Expanded' : 'Collapsed' }}. {{ pinned ? 'Pinned' : 'Not pinned' }}. {{ result }}
    </p>
  </div>
</template>
