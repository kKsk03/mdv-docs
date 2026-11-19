<script setup lang="ts">
import { ref } from 'vue'
import { MdvList, MdvListItem } from '@mdv-ui/mdv'
import type { MdvListModelValue } from '@mdv-ui/mdv'

const single = ref<MdvListModelValue>('profile')
const multiple = ref<MdvListModelValue>(['updates'])
</script>

<template>
  <div class="grid gap-6">
    <div class="grid gap-3">
      <MdvList v-model="single" selection-mode="single" aria-label="Account preference">
        <MdvListItem value="profile" headline="Profile" leading="radio" />
        <MdvListItem value="locked" headline="Unavailable setting" leading="radio" disabled />
        <MdvListItem :value="1" headline="Numeric value 1" leading="radio" />
        <MdvListItem value="1" headline="Text value 1" leading="radio" />
      </MdvList>
      <p class="text-sm text-mdv-on-surface-variant" role="status">Single: {{ typeof single }} {{ JSON.stringify(single) }}</p>
    </div>
    <div class="grid gap-3">
      <MdvList v-model="multiple" selection-mode="multiple" layout="segmented" aria-label="Notification categories">
        <MdvListItem value="updates" headline="Product updates" trailing="checkbox" />
        <MdvListItem value="security" headline="Security alerts" trailing="checkbox" />
        <MdvListItem value="billing" headline="Billing messages" trailing="checkbox" />
      </MdvList>
      <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Multiple: {{ JSON.stringify(multiple) }}</p>
    </div>
  </div>
</template>
