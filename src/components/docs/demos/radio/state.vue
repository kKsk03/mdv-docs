<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvRadio, MdvRadioGroup } from '@mdv-ui/mdv'
import type { MdvRadioModelValue } from '@mdv-ui/mdv'

const disabled = ref(false)
const error = ref(false)
const value = ref<MdvRadioModelValue>('standard')
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-4"><MdvCheckbox v-model="disabled" label="Disable the group" /><MdvCheckbox v-model="error" label="Show server error" /></div>
    <MdvRadioGroup v-model="value" :disabled="disabled" :error="error" label="Delivery service" supporting-text="All prices include delivery." error-text="This delivery option is temporarily unavailable.">
      <template #label><span class="font-medium">Delivery service</span> <span class="text-mdv-on-surface-variant">(one option)</span></template>
      <MdvRadio value="standard" label="Standard delivery" supporting-text="Arrives in 3–5 working days." />
      <MdvRadio value="express" supporting-text="Available on working days.">Express delivery <span class="text-sm text-mdv-on-surface-variant">— includes tracking and a scheduled delivery window</span></MdvRadio>
      <MdvRadio value="overnight" label="Overnight delivery (unavailable)" disabled />
    </MdvRadioGroup>
    <MdvRadio model-value="blocked" value="blocked" label="Standalone error" error error-text="Please review this choice." />
  </div>
</template>
