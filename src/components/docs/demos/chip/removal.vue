<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvChip, MdvChipSet, MdvIcon } from '@mdv-ui/mdv'
import cancel from '@iconify-icons/material-symbols/cancel-outline'

const initial = ['Design', 'Review', 'Release']
const tags = ref([...initial])
const removeOnly = ref(false)
const message = ref('Open a tag, or remove it with its separate action.')

function remove(tag: string) {
  tags.value = tags.value.filter(item => item !== tag)
  message.value = `Removed ${tag}.`
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="removeOnly" label="Make the whole chip remove only" />
    <MdvChipSet label="Project tags">
      <MdvChip v-for="tag in tags" :key="tag" variant="input" :label="tag" :remove-only="removeOnly" :remove-label="`Remove ${tag}`" @click="message = `Opened ${tag}.`" @remove="remove(tag)">
        <template #trailing><MdvIcon :icon="cancel" /></template>
      </MdvChip>
      <span v-if="!tags.length" class="text-sm text-mdv-on-surface-variant">All tags removed.</span>
    </MdvChipSet>
    <MdvButton class="justify-self-start" variant="text" @click="tags = [...initial]; message = 'Tags restored.'">Restore tags</MdvButton>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
