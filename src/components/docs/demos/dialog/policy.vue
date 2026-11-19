<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvDialog, MdvTextField } from '@mdv-ui/mdv'

const open = ref(false)
const escape = ref(true)
const scrim = ref(true)
const destroy = ref(false)
const reject = ref(false)
const result = ref('The parent normally accepts closing requests.')

function update(value: boolean) {
  result.value = reject.value ? 'The parent rejected closing.' : 'The parent accepted closing.'
  if (!reject.value) open.value = value
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="escape" label="Close on Escape" />
      <MdvCheckbox v-model="scrim" label="Close on scrim" />
      <MdvCheckbox v-model="destroy" label="Destroy content after closing" />
    </div>
    <MdvButton class="justify-self-start" @click="open = true">Try close policy</MdvButton>
    <MdvDialog :model-value="open" title="Close policy" role="dialog" :close-on-esc="escape" :close-on-scrim="scrim" :destroy-on-close="destroy" @update:model-value="update">
      <div class="grid gap-4">
        <MdvTextField label="Temporary note" autofocus />
        <MdvCheckbox v-model="reject" label="Reject closing requests" />
        <p class="text-sm">This note is managed inside the field. Reopen to check whether it was retained.</p>
        <p class="text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
      </div>
      <template #actions="{ close }">
        <MdvButton variant="text" @click="close('cancel')">Cancel</MdvButton>
        <MdvButton variant="text" @click="close('done')">Done</MdvButton>
      </template>
    </MdvDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
