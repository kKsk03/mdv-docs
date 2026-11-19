<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvMenu, MdvMenuGroup, MdvMenuItem, MdvSelect } from '@mdv-ui/mdv'
import type { MdvMenuModelValue, MdvMenuSubmenuMode } from '@mdv-ui/mdv'

const mode = ref<MdvMenuSubmenuMode>('flyout')
const rtl = ref(false)
const font = ref<MdvMenuModelValue>('roboto')
const message = ref('Choose a nested action.')
const modes = [{ value: 'flyout', label: 'flyout' }, { value: 'push', label: 'push' }]
</script>

<template>
  <div class="grid gap-4">
    <MdvSelect :model-value="mode" :options="modes" label="Submenu mode" @update:model-value="mode = $event as MdvMenuSubmenuMode" />
    <MdvCheckbox v-model="rtl" label="Use right-to-left menus" />
    <div :dir="rtl ? 'rtl' : 'ltr'">
      <MdvMenu :submenu-mode="mode" style="width: 240px">
        <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps">Formatting</MdvButton></template>
        <MdvMenuItem label="Text">
          <template #children>
            <MdvMenuItem label="Font">
              <template #children>
                <MdvMenuGroup v-model="font" selection-mode="single" label="Font family">
                  <MdvMenuItem value="roboto" label="Roboto" />
                  <MdvMenuItem value="system" label="System default" />
                </MdvMenuGroup>
              </template>
            </MdvMenuItem>
            <MdvMenuItem label="Reset formatting" @select="message = 'Formatting reset.'" />
          </template>
        </MdvMenuItem>
        <MdvMenuItem label="Insert table" @select="message = 'Table requested.'" />
      </MdvMenu>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Font: {{ font }} · {{ message }}</p>
  </div>
</template>
