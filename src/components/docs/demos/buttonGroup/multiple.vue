<script setup lang="ts">
import { ref } from 'vue'
import { MdvButtonGroup, MdvButtonGroupItem, MdvIcon } from '@mdv-ui/mdv'
import type { MdvButtonGroupModelValue } from '@mdv-ui/mdv'
import check from '@iconify-icons/material-symbols/check'

const filters = ref<MdvButtonGroupModelValue>(['photos'])
</script>

<template>
  <div class="grid gap-4">
    <MdvButtonGroup v-model="filters" variant="connected" selection="multiple" aria-label="File filters">
      <MdvButtonGroupItem v-for="item in ['photos', 'videos', 'audio']" :key="item" :value="item" variant="tonal">
        {{ item.charAt(0).toUpperCase() + item.slice(1) }}
        <template #selected><MdvIcon :icon="check" /></template>
      </MdvButtonGroupItem>
    </MdvButtonGroup>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Filters: {{ JSON.stringify(filters) }}</p>
  </div>
</template>
