<script setup lang="ts">
import { ref } from 'vue'
import { MdvBottomSheet, MdvButton, MdvTextField } from '@mdv-ui/mdv'
import type { MdvBottomSheetCloseDetail } from '@mdv-ui/mdv'

const open = ref(false)
const draft = ref('Weekend reading')
const result = ref('The draft is preserved when the sheet closes.')

function onClose(detail: MdvBottomSheetCloseDetail) {
  result.value = detail.returnValue === 'save' ? `Saved: ${draft.value}` : 'Closed without saving.'
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="open = true">Edit collection</MdvButton>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
    <MdvBottomSheet
      v-model="open"
      title="Collection details"
      :partial="false"
      expand-label="Expand sheet"
      collapse-label="Collapse sheet"
      close-label="Close sheet"
      @close="onClose"
    >
      <form method="dialog" class="grid gap-5">
        <MdvTextField v-model="draft" label="Collection name" name="collection" required full-width />
        <div class="flex flex-wrap justify-end gap-3">
          <MdvButton type="submit" value="cancel" variant="text" formnovalidate>Cancel</MdvButton>
          <MdvButton type="submit" value="save">Save</MdvButton>
        </div>
      </form>
    </MdvBottomSheet>
  </div>
</template>
