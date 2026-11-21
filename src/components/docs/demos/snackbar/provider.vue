<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'
import { MdvButton, MdvSnackbarProvider, useSnackbar } from '@mdv-ui/mdv'

const ProviderControls = defineComponent({
  name: 'ProviderControls',
  setup() {
    const snackbar = useSnackbar()
    const result = ref('No provider messages yet.')
    let activeId: string | undefined
    let queuedId: string | undefined
    function showFirst() {
      activeId = snackbar.show({ message: 'Draft saved.', key: 'draft', duration: 0, closable: true })
      result.value = `Active message id: ${activeId}`
    }
    function queueSecond() {
      queuedId = snackbar.show({ message: 'Ready to sync.', duration: 0, closable: true })
      result.value = `Queued message id: ${queuedId}`
    }
    function updateFirst() {
      result.value = `Update accepted: ${activeId ? snackbar.update(activeId, { message: 'Draft saved. Ready to review.' }) : false}`
    }
    function closeFirst() {
      result.value = `Close accepted: ${activeId ? snackbar.close(activeId) : false}`
    }
    function clearAll() {
      snackbar.clear()
      activeId = undefined
      queuedId = undefined
      result.value = 'Provider queue cleared.'
    }
    return () => h('div', { class: 'grid min-w-0 gap-4' }, [
      h('div', { class: 'flex flex-wrap gap-3' }, [
        h(MdvButton, { onClick: showFirst }, { default: () => 'Show first' }),
        h(MdvButton, { variant: 'tonal', onClick: queueSecond }, { default: () => 'Queue second' }),
        h(MdvButton, { variant: 'outlined', onClick: updateFirst }, { default: () => 'Update first' }),
        h(MdvButton, { variant: 'outlined', onClick: closeFirst }, { default: () => 'Close first' }),
        h(MdvButton, { variant: 'text', onClick: clearAll }, { default: () => 'Clear queue' }),
      ]),
      h('p', { class: 'break-words text-sm text-mdv-on-surface-variant', role: 'status' }, result.value),
    ])
  },
})
</script>

<template>
  <MdvSnackbarProvider>
    <ProviderControls />
  </MdvSnackbarProvider>
</template>