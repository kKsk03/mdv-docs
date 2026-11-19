<script setup lang="ts">
import { ref } from 'vue'
import { MdvList, MdvListItem, MdvTextField } from '@mdv-ui/mdv'

const name = ref('')
const message = ref('Enter a display name before submitting.')

function submit(event: Event) {
  const submitter = (event as SubmitEvent).submitter as HTMLButtonElement | null
  message.value = `Submitted ${name.value} with intent=${submitter?.value || '(none)'}.`
}
</script>

<template>
  <div class="grid gap-4">
    <form class="grid gap-3" @submit.prevent="submit" @reset="name = ''; message = 'Profile reset.'">
      <MdvTextField v-model="name" label="Display name" name="displayName" required full-width />
      <MdvList aria-label="Profile form actions">
        <MdvListItem interactive type="submit" name="intent" value="save" headline="Submit profile" supporting-text="Uses native required-field validation." />
        <MdvListItem interactive type="reset" headline="Reset profile" />
        <MdvListItem interactive headline="Preview profile" @click="message = `Preview: ${name || '(empty)'}`" />
      </MdvList>
    </form>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
