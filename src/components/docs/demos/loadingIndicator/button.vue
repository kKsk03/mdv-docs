<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { MdvButton, MdvIcon, MdvLoadingIndicator } from '@mdv-ui/mdv'
import saveIcon from '@iconify-icons/material-symbols/save'

const saving = ref(false)
const saves = ref(0)
let timer: ReturnType<typeof setTimeout> | undefined

function save() {
  if (saving.value) return
  saving.value = true
  timer = setTimeout(() => {
    timer = undefined
    saves.value++
    saving.value = false
  }, 900)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton :aria-busy="saving" :disabled="saving" style="--mdv-button-icon-size: 24px" @click="save">
      <template #leading>
        <MdvLoadingIndicator v-if="saving" :size="24" decorative style="--mdv-loading-indicator-active-color: currentColor" />
        <MdvIcon v-else :icon="saveIcon" />
      </template>
      {{ saving ? 'Saving draft…' : 'Save draft' }}
    </MdvButton>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ saving ? 'Saving the draft.' : `Saved ${saves} times.` }}</p>
  </div>
</template>
