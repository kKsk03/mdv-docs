<script setup lang="ts">
import { ref } from 'vue'
import { MdvRadio, MdvRadioGroup } from '@mdv-ui/mdv'
import type { MdvRadioModelValue } from '@mdv-ui/mdv'

const plan = ref<MdvRadioModelValue>('basic')
const delivery = ref<MdvRadioModelValue>('email')
const typed = ref<MdvRadioModelValue>(1)
</script>

<template>
  <div class="grid gap-5">
    <MdvRadioGroup v-model="plan" label="Plan" supporting-text="Choose one plan. Arrow keys select the next available option.">
      <MdvRadio value="basic" label="Basic" />
      <MdvRadio value="pro" label="Pro" supporting-text="Includes shared workspaces." />
      <MdvRadio value="enterprise" label="Enterprise (unavailable)" disabled />
    </MdvRadioGroup>
    <MdvRadioGroup v-model="delivery" orientation="horizontal" label="Notifications">
      <MdvRadio value="email" label="Email" /><MdvRadio value="sms" label="SMS" /><MdvRadio value="push" label="Push" />
    </MdvRadioGroup>
    <MdvRadioGroup v-model="typed" orientation="horizontal" label="Strict values">
      <MdvRadio :value="1" label="Number 1" /><MdvRadio value="1" label="String 1" />
    </MdvRadioGroup>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Plan: {{ plan }} · Delivery: {{ delivery }} · Typed value: {{ typeof typed }} {{ JSON.stringify(typed) }}</p>
  </div>
</template>
