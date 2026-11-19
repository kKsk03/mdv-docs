<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvList, MdvListItem } from '@mdv-ui/mdv'
import notificationsIcon from '@iconify-icons/material-symbols/notifications-outline'

const rtl = ref(false)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="rtl" label="Use right-to-left lists" />
    <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" :dir="rtl ? 'rtl' : 'ltr'" class="min-w-0 rounded-xl bg-mdv-surface-container-lowest p-2 text-mdv-on-surface">
      <MdvList layout="segmented" :aria-label="`${theme} list preview`">
        <MdvListItem :lines="3" headline="A long notification headline that stays within the row" supporting-text="Supporting text can wrap onto two lines in a three-line row without an overline, while its trailing content keeps its space." :icon="notificationsIcon" trailing-text="Now" />
        <MdvListItem :lines="3" headline="Archive export" supporting-text="ReportArchive2026WithALongUnbrokenSupportingValueToCheckWrapping" avatar-name="Alex Morgan" trailing="checkbox" :trailing-value="true" selected />
      </MdvList>
    </div>
  </div>
</template>
