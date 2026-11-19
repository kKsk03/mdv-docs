<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvLinearProgress, MdvSelect } from '@mdv-ui/mdv'

const thickness = ref(4)
const narrow = ref(false)
const rtl = ref(false)
const options = [2, 4, 8, 12].map(value => ({ value, label: `${value}px` }))
</script>

<template>
  <div class="grid gap-5">
    <MdvSelect :model-value="thickness" :options="options" label="Stroke thickness" @update:model-value="thickness = Number($event)" />
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="narrow" label="Use a narrow container" />
      <MdvCheckbox v-model="rtl" label="Right-to-left progress" />
    </div>
    <div :dir="rtl ? 'rtl' : 'ltr'" class="grid w-full gap-6" :style="{ maxInlineSize: narrow ? '220px' : '100%' }">
      <MdvLinearProgress :value="55" :thickness="thickness" label="Flat stroke" />
      <MdvLinearProgress :value="55" :thickness="thickness" variant="wavy" label="Wavy stroke" />
    </div>
  </div>
</template>
