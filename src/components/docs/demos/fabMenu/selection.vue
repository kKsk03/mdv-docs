<script setup lang="ts">
import { ref } from 'vue'
import { MdvFabMenu, MdvFabMenuItem, MdvSelect } from '@mdv-ui/mdv'
import type { MdvFabMenuSelectEvent, MdvFabMenuVariant } from '@mdv-ui/mdv'

const variant = ref<MdvFabMenuVariant>('expressive')
const added = ref(0)
const message = ref('Try keeping the menu open or cancelling a link action.')
const variants = ['expressive', 'baseline'].map(value => ({ value, label: value }))

function cancel(event: MdvFabMenuSelectEvent) {
  event.preventDefault()
  message.value = 'Link selection cancelled; navigation and automatic closing were prevented.'
}
</script>

<template>
  <div class="grid gap-4">
    <MdvSelect :model-value="variant" :options="variants" label="Action presentation" @update:model-value="variant = $event as MdvFabMenuVariant" />
    <div class="relative min-h-88 rounded-xl bg-mdv-surface-container-low p-5 pb-24">
      <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }} · Items added: {{ added }}</p>
      <MdvFabMenu :variant="variant" label="Try selection rules" close-label="Close selection menu" position="absolute" :offset="16">
        <MdvFabMenuItem label="Run and close" value="finish" @select="message = `Selected ${$event.detail.value}.`" />
        <MdvFabMenuItem label="Add another" :value="0" keep-open @select="added++; message = 'Added an item; menu remains open.'" />
        <MdvFabMenuItem label="Cancel link action" href="#cancelled-fab-action" @select="cancel" />
        <MdvFabMenuItem label="Unavailable export" href="#unavailable-fab-action" disabled @select="message = 'This must not run.'" />
      </MdvFabMenu>
    </div>
  </div>
</template>
