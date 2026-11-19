<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvFullscreenDialog, MdvTextField } from '@mdv-ui/mdv'

const open = ref(false)
const closable = ref(true)
const escape = ref(true)
const destroy = ref(false)
const reject = ref(false)
const message = ref('Closing requests are accepted.')

function update(value: boolean) {
  message.value = reject.value ? 'The parent rejected closing.' : 'The parent accepted closing.'
  if (!reject.value) open.value = value
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="closable" label="Show the close action" />
      <MdvCheckbox v-model="escape" label="Close on Escape" />
      <MdvCheckbox v-model="destroy" label="Destroy content after closing" />
    </div>
    <MdvButton variant="tonal" @click="open = true">Try fullscreen policy</MdvButton>
    <MdvFullscreenDialog :model-value="open" title="Close policy" close-label="Close policy preview" :closable="closable" :close-on-esc="escape" :destroy-on-close="destroy" @update:model-value="update">
      <div class="mx-auto grid max-w-2xl gap-5">
        <MdvTextField label="Temporary note" full-width autofocus />
        <MdvCheckbox v-model="reject" label="Reject closing requests" />
        <p class="text-sm" role="status">{{ message }}</p>
      </div>
      <template #footer="{ close }"><MdvButton variant="text" @click="close('done')">Done</MdvButton></template>
    </MdvFullscreenDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
