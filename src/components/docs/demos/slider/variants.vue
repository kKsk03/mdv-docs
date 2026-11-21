<script setup lang="ts">
import { ref } from 'vue'
import { MdvSlider } from '@mdv-ui/mdv'
import type { MdvSliderModelValue } from '@mdv-ui/mdv'

const volume = ref<MdvSliderModelValue>(42)
const exposure = ref<MdvSliderModelValue>(-10)
const price = ref<MdvSliderModelValue>([20, 80])
const inputCount = ref(0)
const changeCount = ref(0)
const percent = (value: number) => `${value}%`
const celsius = (value: number) => `${value} °C`
function recordInput() { inputCount.value++ }
function recordChange() { changeCount.value++ }
</script>

<template>
  <div class="grid min-w-0 gap-6">
    <MdvSlider v-model="volume" label="Volume" value-indicator :format-value="percent" @input="recordInput" @change="recordChange" />
    <MdvSlider v-model="exposure" variant="centered" :min="-100" :max="100" :step="5" :center-value="0" label="Exposure" value-indicator :format-value="celsius" />
    <MdvSlider v-model="price" variant="range" :min="0" :max="100" :step="5" label="Price range" start-aria-label="Minimum price" end-aria-label="Maximum price" value-indicator :format-value="value => `$${value}`" />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Volume: {{ volume }}% · input {{ inputCount }} · change {{ changeCount }} · Exposure: {{ exposure }} · Price: {{ JSON.stringify(price) }}</p>
  </div>
</template>