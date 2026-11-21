<script setup lang="ts">
import close from '@iconify-icons/material-symbols/close'
import { ref } from 'vue'
import { MdvIcon, MdvSwitch } from '@mdv-ui/mdv'

const sync = ref(false)
const quiet = ref(true)
const offline = ref(true)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvSwitch v-model="sync" label="Sync over Wi-Fi" color="#006C66">
      <template #unselected-icon><MdvIcon :icon="close" size="16" /></template>
    </MdvSwitch>
    <div
      data-mdv-theme="dark"
      dir="rtl"
      class="rounded-xl bg-mdv-surface-container p-4 text-mdv-on-surface"
    >
      <MdvSwitch v-model="quiet" label="Quiet hours" color="tertiary">
        <template #selected-icon></template>
      </MdvSwitch>
    </div>
    <MdvSwitch
      v-model="offline"
      label="Offline access"
      color="tertiary"
      :error="offline"
      error-text="Your organization does not allow offline access."
    />
  </div>
</template>
