<script setup lang="ts">
import { ref } from 'vue'
import { MdvButtonGroup, MdvButtonGroupItem, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvButtonSize } from '@mdv-ui/mdv'

const sizes: MdvButtonSize[] = ['xs', 's', 'm', 'l', 'xl']
const square = ref(false)
const dense = ref(false)
const message = ref('Choose a size example.')
</script>

<template>
  <div class="grid gap-5">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="square" label="Square shape" />
      <MdvCheckbox v-model="dense" label="Density -2" />
    </div>
    <div v-for="size in sizes" :key="size" class="grid min-w-0 gap-2">
      <span class="text-sm text-mdv-on-surface-variant">{{ size }}</span>
      <MdvButtonGroup :size="size" :shape="square ? 'square' : 'round'" :density="dense ? -2 : 0" :aria-label="`${size} actions`">
        <MdvButtonGroupItem @click="message = `Selected ${size} start.`">Start</MdvButtonGroupItem>
        <MdvButtonGroupItem variant="tonal" @click="message = `Selected ${size} stop.`">Stop</MdvButtonGroupItem>
      </MdvButtonGroup>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
