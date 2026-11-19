<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvMenu, MdvMenuGroup, MdvMenuItem } from '@mdv-ui/mdv'
import type { MdvMenuModelValue } from '@mdv-ui/mdv'

const scale = ref<MdvMenuModelValue>(1)
const styles = ref<MdvMenuModelValue>(['bold'])
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvMenu layout="grouped">
      <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps">Text preferences</MdvButton></template>
      <MdvMenuGroup v-model="scale" selection-mode="single" label="Display scale">
        <MdvMenuItem :value="1" label="Numeric value 1" />
        <MdvMenuItem value="1" label="Text value 1" />
        <MdvMenuItem :value="2" label="Double scale" />
      </MdvMenuGroup>
      <MdvMenuGroup v-model="styles" selection-mode="multiple" label="Text styles">
        <MdvMenuItem value="bold" label="Bold" />
        <MdvMenuItem value="italic" label="Italic" />
        <MdvMenuItem value="underline" label="Underline" disabled />
      </MdvMenuGroup>
    </MdvMenu>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Scale: {{ typeof scale }} {{ JSON.stringify(scale) }} · Styles: {{ JSON.stringify(styles) }}</p>
  </div>
</template>
