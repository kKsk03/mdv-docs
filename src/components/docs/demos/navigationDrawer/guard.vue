<script setup lang="ts">
import { onBeforeUnmount, ref, useId } from 'vue'
import { MdvButton, MdvDialog, MdvModalNavigationDrawer, MdvNavigationDrawerItem, MdvTextField } from '@mdv-ui/mdv'

const id = `guard-example-${useId()}`
const open = ref(false)
const confirming = ref(false)
const note = ref('')
const message = ref('Type a note in the drawer, then try closing it.')
let resolveClose: ((allowed: boolean) => void) | undefined
function beforeClose() {
  if (!note.value.trim()) return true
  confirming.value = true
  return new Promise<boolean>(resolve => { resolveClose = resolve })
}
function answer(allowed: boolean) {
  confirming.value = false
  if (allowed) note.value = ''
  message.value = allowed ? 'The note was discarded.' : 'Keep editing the note.'
  resolveClose?.(allowed)
  resolveClose = undefined
}
onBeforeUnmount(() => resolveClose?.(false))
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton :aria-controls="id" :aria-expanded="open" @click="open = true">Open guarded drawer</MdvButton>
    <MdvModalNavigationDrawer :id="id" v-model="open" title="Draft workspace" :before-close="beforeClose">
      <MdvNavigationDrawerItem label="Draft destination" active />
      <template #footer="{ close }">
        <div class="grid gap-3">
          <MdvTextField v-model="note" label="Unsaved navigation note" full-width />
          <MdvButton variant="text" @click="close()">Leave draft workspace</MdvButton>
        </div>
      </template>
    </MdvModalNavigationDrawer>
    <MdvDialog :model-value="confirming" title="Discard navigation note?" role="dialog" description="This local note has not been saved." @update:model-value="answer(false)">
      <template #actions>
        <MdvButton variant="text" @click="answer(false)">Keep editing</MdvButton>
        <MdvButton variant="text" @click="answer(true)">Discard and close</MdvButton>
      </template>
    </MdvDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
