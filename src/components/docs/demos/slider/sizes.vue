<script setup lang="ts">
import { reactive, ref } from 'vue'
import { MdvCheckbox, MdvSlider } from '@mdv-ui/mdv'
import type { MdvSliderSize } from '@mdv-ui/mdv'

const sizes: MdvSliderSize[] = ['xs', 's', 'm', 'l', 'xl']
const values = reactive<Record<MdvSliderSize, number>>({ xs: 30, s: 30, m: 30, l: 30, xl: 30 })
const disabled = ref(true)
</script>

<template>
  <div class="grid min-w-0 gap-5">
    <MdvSlider v-for="size in sizes" :key="size" v-model="values[size]" :size="size" :stops="true" :step="10" :label="`Size ${size}`" />
    <MdvCheckbox v-model="disabled" label="Disable the example slider" />
    <MdvSlider :model-value="45" label="Disabled example" :disabled="disabled" supporting-text="Disabled sliders are omitted from form submission." />
  </div>
</template>