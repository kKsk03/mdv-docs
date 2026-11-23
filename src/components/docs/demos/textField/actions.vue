<script setup lang="ts">
import edit from '@iconify-icons/material-symbols/edit-outline'
import search from '@iconify-icons/material-symbols/search'
import { ref, useTemplateRef } from 'vue'
import { MdvIcon, MdvIconButton, MdvTextField } from '@mdv-ui/mdv'

const query = ref('Packaging')
const password = ref('demo-only')
const projectCode = ref('')
const codeField = useTemplateRef<InstanceType<typeof MdvTextField>>('codeField')

function fillProjectCode() {
  projectCode.value = 'PROJECT-01'
  codeField.value?.focus()
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvTextField v-model="query" type="search" label="Search examples" clearable clear-label="Clear search examples" full-width>
      <template #leading><MdvIcon :icon="search" /></template>
    </MdvTextField>
    <MdvTextField
      v-model="password"
      type="password"
      label="Demo password"
      autocomplete="new-password"
      supporting-text="Use sample text, not a real password."
      password-toggle
      show-password-label="Show demo password"
      hide-password-label="Hide demo password"
      full-width
    />
    <MdvTextField ref="codeField" v-model="projectCode" label="Project code" full-width>
      <template #trailing>
        <MdvIconButton
          type="button"
          variant="standard"
          aria-label="Use suggested project code"
          @click="fillProjectCode"
        >
          <MdvIcon :icon="edit" />
        </MdvIconButton>
      </template>
    </MdvTextField>
  </div>
</template>
