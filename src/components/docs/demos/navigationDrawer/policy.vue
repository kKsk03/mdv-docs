<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvCheckbox, MdvModalNavigationDrawer, MdvNavigationDrawerItem, MdvTextField } from '@mdv-ui/mdv'
import type { MdvNavigationDrawerCloseDetail } from '@mdv-ui/mdv'

const id = `policy-example-${useId()}`
const open = ref(false)
const closeOnEsc = ref(true)
const closeOnScrim = ref(true)
const closeOnSelect = ref(true)
const closeOnSwipe = ref(true)
const destroy = ref(false)
const blockClose = ref(false)
const acceptClose = ref(true)
const message = ref('No close requested.')
function beforeClose(detail: Readonly<MdvNavigationDrawerCloseDetail>) {
  message.value = `Guard ${detail.reason}: ${blockClose.value ? 'blocked' : 'allowed'}.`
  return !blockClose.value
}
function update(value: boolean) {
  if (value || acceptClose.value) open.value = value
  else message.value = 'The parent rejected the close request.'
}
async function closeDrawer(close: () => Promise<boolean>) {
  message.value = `Close accepted: ${await close()}.`
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="closeOnEsc" label="Close on Escape" />
      <MdvCheckbox v-model="closeOnScrim" label="Close on scrim" />
      <MdvCheckbox v-model="closeOnSelect" label="Close on selection" />
      <MdvCheckbox v-model="closeOnSwipe" label="Close on swipe" />
      <MdvCheckbox v-model="destroy" label="Destroy closed content" />
      <MdvCheckbox v-model="blockClose" label="Block guarded closes" />
      <MdvCheckbox v-model="acceptClose" label="Accept close requests" />
    </div>
    <div><MdvButton :aria-controls="id" :aria-expanded="open" @click="open = true">Open policy drawer</MdvButton></div>
    <MdvModalNavigationDrawer :id="id" :model-value="open" title="Drawer close policy" :close-on-esc="closeOnEsc" :close-on-scrim="closeOnScrim" :close-on-select="closeOnSelect" :close-on-swipe="closeOnSwipe" :destroy-on-close="destroy" :before-close="beforeClose" @update:model-value="update">
      <MdvNavigationDrawerItem label="Choose this destination" />
      <template #footer="{ close }">
        <div class="grid gap-3">
          <MdvTextField label="Retained navigation note" placeholder="Type, close, and reopen" full-width />
          <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
          <div class="flex flex-wrap gap-2">
            <MdvButton variant="text" @click="closeDrawer(close)">Request guarded close</MdvButton>
            <MdvButton variant="text" @click="open = false">Close by model</MdvButton>
          </div>
        </div>
      </template>
    </MdvModalNavigationDrawer>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
