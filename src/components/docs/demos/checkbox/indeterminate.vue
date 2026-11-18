<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox } from '@mdv-ui/mdv'

const checked = ref(false)
const indeterminate = ref(true)
</script>

<template>
  <div class="grid justify-items-start gap-3">
    <MdvCheckbox v-model="checked" v-model:indeterminate="indeterminate" label="Partially selected" />
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      Checked: {{ checked }} · Indeterminate: {{ indeterminate }}
    </p>
    <MdvButton variant="outlined" @click="indeterminate = true">Set indeterminate</MdvButton>
  </div>
</template>
