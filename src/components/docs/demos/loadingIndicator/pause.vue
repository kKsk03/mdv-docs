<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvLoadingIndicator } from '@mdv-ui/mdv'

const paused = ref(false)
const visible = ref(true)
</script>

<template>
  <div class="grid justify-items-start gap-5">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="paused" label="Pause the animation" />
      <MdvCheckbox v-model="visible" label="Show the indicator" />
    </div>
    <div class="grid min-h-24 min-w-24 place-items-center">
      <MdvLoadingIndicator v-show="visible" :paused="paused || !visible" :size="96" contained label="Loading the preview" />
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ !visible ? 'Hidden and paused.' : paused ? 'Paused at the current frame. Loading is still in progress.' : 'Animating while the indicator is visible.' }}</p>
  </div>
</template>
