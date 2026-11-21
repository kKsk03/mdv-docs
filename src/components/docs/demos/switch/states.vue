<script setup lang="ts">
import { ref } from 'vue'
import { MdvSwitch } from '@mdv-ui/mdv'

const notifications = ref(false)
const previews = ref(true)
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <MdvSwitch
      v-model="notifications"
      label="Delivery notifications"
      supporting-text="Receive updates when a package is on its way."
    />
    <MdvSwitch
      v-model="previews"
      label="Show previews of upcoming scheduled messages in the activity feed"
      label-position="start"
    />
    <MdvSwitch :model-value="true" label="Organization audit log" disabled />
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      Delivery notifications: {{ notifications ? 'on' : 'off' }}
    </p>
  </div>
</template>
