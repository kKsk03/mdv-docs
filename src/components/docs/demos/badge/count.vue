<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvButton, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import mail from '@iconify-icons/material-symbols/mail-outline'

const unread = ref(3)
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <MdvBadge variant="large" :content="unread > 99 ? '99+' : unread" :visible="unread > 0">
        <MdvIconButton variant="tonal" :aria-label="`Read mail, ${unread} unread messages`" @click="unread = 0">
          <MdvIcon :icon="mail" />
        </MdvIconButton>
      </MdvBadge>
      <MdvButton variant="outlined" @click="unread++">Add message</MdvButton>
      <MdvButton variant="outlined" @click="unread += 100">Add 100</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Unread: {{ unread }}</p>
  </div>
</template>
