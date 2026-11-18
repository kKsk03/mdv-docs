<script setup lang="ts">
import { MdvBadge, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import notifications from '@iconify-icons/material-symbols/notifications-outline'
import mail from '@iconify-icons/material-symbols/mail-outline'
</script>

<template>
  <div class="flex flex-wrap items-center gap-8">
    <MdvBadge>
      <MdvIconButton variant="standard" aria-label="Notifications, new updates available">
        <MdvIcon :icon="notifications" />
      </MdvIconButton>
    </MdvBadge>
    <MdvBadge variant="large" :content="3">
      <MdvIconButton variant="standard" aria-label="Mail, 3 unread messages">
        <MdvIcon :icon="mail" />
      </MdvIconButton>
    </MdvBadge>
  </div>
</template>
