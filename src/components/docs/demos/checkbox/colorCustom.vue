<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCheckboxColor, MdvCheckboxValue } from '@mdv-ui/mdv'

const colors: MdvCheckboxColor[] = ['#6750A4', '#00796B', '#00ACC1']
const selected = ref<MdvCheckboxValue[]>([...colors])
</script>

<template>
  <div class="flex flex-wrap gap-x-6 gap-y-3">
    <MdvCheckbox
      v-for="color in colors"
      :key="color"
      v-model="selected"
      :value="color"
      :color="color"
      :label="color"
    />
  </div>
</template>
