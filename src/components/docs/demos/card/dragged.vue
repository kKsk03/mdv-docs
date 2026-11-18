<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCard, MdvCheckbox } from '@mdv-ui/mdv'

const dragged = ref(false)
const disabled = ref(false)
const clicks = ref(0)
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="dragged" label="Show dragged appearance" />
      <MdvCheckbox v-model="disabled" label="Set card disabled" />
    </div>
    <MdvCard class="max-w-md" :dragged="dragged" :disabled="disabled" title="Static card with an action">
      <p class="text-sm">Dragged changes only the visual state. Disabled does not disable controls inside a static card.</p>
      <template #actions>
        <MdvButton variant="tonal" @click="clicks++">Independent action ({{ clicks }})</MdvButton>
      </template>
    </MdvCard>
  </div>
</template>
