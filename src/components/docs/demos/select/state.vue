<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const value = ref<MdvSelectValue | null>('email')
const disabled = ref(false)
const error = ref(false)
const lastOption = ref('No option selected in this session.')
const options: MdvSelectOption[] = [{ value: 'email', label: 'Email' }, { value: 'push', label: 'Push notification' }, { value: 'sms', label: 'SMS', disabled: true }]
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="disabled" label="Disable channel" />
      <MdvCheckbox v-model="error" label="Show external error" />
    </div>
    <MdvSelect v-model="value" label="Notification channel" placeholder="Choose a channel" supporting-text="Only available channels can be selected." :options="options" :disabled="disabled" :error="error" error-text="This channel cannot be used for the current account." full-width @select="lastOption = `Selected option: ${$event.label}`" />
    <div><MdvButton variant="outlined" :disabled="disabled || value === null" @click="value = null">Clear channel</MdvButton></div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Model: {{ JSON.stringify(value) }} · {{ lastOption }}</p>
  </div>
</template>
