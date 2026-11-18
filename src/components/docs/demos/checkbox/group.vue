<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCheckboxValue } from '@mdv-ui/mdv'

const selected = ref<MdvCheckboxValue[]>(['email'])
</script>

<template>
  <div class="grid gap-3">
    <fieldset class="min-w-0">
      <legend class="mb-2 font-medium">Notification channels</legend>
      <div class="flex flex-wrap gap-x-6 gap-y-2">
        <MdvCheckbox v-model="selected" value="email" label="Email" />
        <MdvCheckbox v-model="selected" value="sms" label="SMS" />
        <MdvCheckbox v-model="selected" value="push" label="Push" />
      </div>
    </fieldset>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      Selected: {{ selected.length ? selected.join(', ') : 'None' }}
    </p>
  </div>
</template>
