<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvButtonGroup, MdvButtonGroupItem } from '@mdv-ui/mdv'
import type { MdvButtonGroupModelValue } from '@mdv-ui/mdv'

const channels = ref<MdvButtonGroupModelValue>(['email'])
const result = ref('Submit to inspect all selected channels.')

function submit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = JSON.stringify({ channel: data.getAll('channel') })
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="submit" @reset="result = 'Form reset.'">
    <MdvButtonGroup v-model="channels" name="channel" variant="connected" selection="multiple" aria-label="Notification channels">
      <MdvButtonGroupItem value="email">Email</MdvButtonGroupItem>
      <MdvButtonGroupItem value="sms">SMS</MdvButtonGroupItem>
      <MdvButtonGroupItem value="push">Push</MdvButtonGroupItem>
    </MdvButtonGroup>
    <div class="flex flex-wrap gap-3">
      <MdvButton type="submit">Submit</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset</MdvButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </form>
</template>
