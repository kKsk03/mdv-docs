<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvSegmentedButton, MdvSegmentedButtonItem } from '@mdv-ui/mdv'
import type { MdvSegmentedButtonModelValue } from '@mdv-ui/mdv'

const formId = `segmented-export-${useId()}`
const group = useTemplateRef<InstanceType<typeof MdvSegmentedButton>>('group')
const period = ref<MdvSegmentedButtonModelValue>('week')
const formats = ref<MdvSegmentedButtonModelValue>(['pdf'])
const disabled = ref(false)
const submitted = ref('Not submitted.')
function submit(event: Event) {
  submitted.value = JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvCheckbox v-model="disabled" label="Disable export fields" />
    <fieldset :disabled="disabled" class="grid min-w-0 gap-3">
      <legend class="mb-2 text-sm">Export options</legend>
      <MdvSegmentedButton ref="group" v-model="period" :form="formId" name="period" aria-label="Export period">
        <MdvSegmentedButtonItem value="week" label="Week" />
        <MdvSegmentedButtonItem value="month" label="Month" />
      </MdvSegmentedButton>
      <MdvSegmentedButton v-model="formats" :form="formId" selection="multiple" name="format" aria-label="Export formats">
        <MdvSegmentedButtonItem value="pdf" label="PDF" />
        <MdvSegmentedButtonItem value="html" label="HTML" />
        <MdvSegmentedButtonItem value="csv" label="CSV" disabled />
      </MdvSegmentedButton>
    </fieldset>
    <form :id="formId" class="flex flex-wrap gap-2" @submit.prevent="submit" @reset="submitted = 'Reset to the initial values.'">
      <MdvButton type="submit">Submit export</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset export</MdvButton>
      <MdvButton variant="text" @click="group?.focus()">Focus period</MdvButton>
    </form>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">Period: {{ period }} · Formats: {{ JSON.stringify(formats) }} · {{ submitted }}</p>
  </div>
</template>
