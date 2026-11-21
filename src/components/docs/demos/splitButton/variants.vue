<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvSplitButton } from '@mdv-ui/mdv'
import type { MdvButtonSize, MdvSplitButtonVariant } from '@mdv-ui/mdv'

const variants: MdvSplitButtonVariant[] = ['filled', 'tonal', 'outlined', 'elevated']
const sizes: MdvButtonSize[] = ['xs', 's', 'm', 'l', 'xl']
const disabled = ref(true)
const result = ref('Each half has its own action and focus target.')
</script>

<template>
  <div class="grid min-w-0 gap-6">
    <div class="flex flex-wrap items-center gap-3">
      <MdvSplitButton v-for="variant in variants" :key="variant" :variant="variant" :menu-button-label="`More ${variant} actions`" @click="result = `${variant} action`">{{ variant }}</MdvSplitButton>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <MdvSplitButton v-for="size in sizes" :key="size" :size="size" :menu-button-label="`More size ${size} actions`">{{ size }}</MdvSplitButton>
    </div>
    <MdvCheckbox v-model="disabled" label="Disable the example main action" />
    <div class="flex flex-wrap items-center gap-3">
      <MdvSplitButton :action-disabled="disabled" menu-button-label="More available actions" @menu-click="result = 'The menu side remains available.'">Independent action state</MdvSplitButton>
      <MdvSplitButton loading loading-text="Saving" menu-button-label="More save actions">Save</MdvSplitButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>