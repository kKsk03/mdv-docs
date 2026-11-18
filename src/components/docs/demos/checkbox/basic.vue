<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'

const checked = ref(false)
</script>

<template>
  <div class="grid justify-items-start gap-2">
    <MdvCheckbox v-model="checked" label="Enable notifications" />
    <p class="text-sm text-mdv-on-surface-variant" role="status">Checked: {{ checked }}</p>
  </div>
</template>
