<script setup lang="ts">
import { ref } from 'vue'
import { MdvSegmentedButton, MdvSegmentedButtonItem } from '@mdv-ui/mdv'
import type { MdvSegmentedButtonModelValue } from '@mdv-ui/mdv'

const optional = ref<MdvSegmentedButtonModelValue>(null)
const required = ref<MdvSegmentedButtonModelValue>(['email'])
const typed = ref<MdvSegmentedButtonModelValue>(1)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="grid gap-1">
      <p class="text-sm text-mdv-on-surface-variant">Optional single selection: activate again to clear.</p>
      <MdvSegmentedButton v-model="optional" :selection-required="false" aria-label="Optional alignment">
        <MdvSegmentedButtonItem value="left" label="Left" />
        <MdvSegmentedButtonItem value="center" label="Center" />
        <MdvSegmentedButtonItem value="right" label="Right" />
      </MdvSegmentedButton>
    </div>
    <div class="grid gap-1">
      <p class="text-sm text-mdv-on-surface-variant">Keep at least one channel selected.</p>
      <MdvSegmentedButton v-model="required" selection="multiple" selection-required aria-label="Notification channels">
        <MdvSegmentedButtonItem value="email" label="Email" />
        <MdvSegmentedButtonItem value="push" label="Push" />
        <MdvSegmentedButtonItem value="sms" label="SMS" disabled />
      </MdvSegmentedButton>
    </div>
    <MdvSegmentedButton v-model="typed" aria-label="Strict value types">
      <MdvSegmentedButtonItem :value="1" label="Number 1" />
      <MdvSegmentedButtonItem value="1" label="String 1" />
    </MdvSegmentedButton>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">Optional: {{ JSON.stringify(optional) }} · Channels: {{ JSON.stringify(required) }} · Typed: {{ typeof typed }} {{ JSON.stringify(typed) }}</p>
  </div>
</template>
