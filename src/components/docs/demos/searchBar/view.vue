<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvList, MdvListItem, MdvSearchView, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSearchLayout, MdvSearchSlotProps, MdvSearchVariant } from '@mdv-ui/mdv'
import mailIcon from '@iconify-icons/material-symbols/mail-outline'

const query = ref('')
const open = ref(false)
const variant = ref<MdvSearchVariant>('contained')
const layout = ref<MdvSearchLayout>('auto')
const unreadOnly = ref(false)
const selected = ref('No result selected.')
const variants = ['contained', 'divided'].map(value => ({ value, label: value }))
const layouts = ['auto', 'docked', 'fullscreen'].map(value => ({ value, label: value }))
const rows = [
  { title: 'Material Design guidelines', detail: 'Design team · Updated this morning', unread: true },
  { title: 'Travel plans for the weekend', detail: 'Travel club · Routes and meeting points', unread: false },
  { title: 'Accessible search patterns', detail: 'Engineering · Keyboard and focus review', unread: true },
  { title: 'Shared photo collection', detail: 'Community · Last week in pictures', unread: false },
  { title: 'A longer project update about design systems and shared workspaces', detail: 'Product team · A longer subject with supporting context', unread: true },
]
const results = computed(() => rows.filter(row => (!unreadOnly.value || row.unread) && `${row.title} ${row.detail}`.toLowerCase().includes(query.value.trim().toLowerCase())))
function choose(title: string, close: MdvSearchSlotProps['close']) {
  query.value = title
  selected.value = `Selected: ${title}`
  void close()
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-3">
      <MdvSelect :model-value="variant" :options="variants" label="Search appearance" @update:model-value="variant = $event as MdvSearchVariant" />
      <MdvSelect :model-value="layout" :options="layouts" label="Search layout" @update:model-value="layout = $event as MdvSearchLayout" />
    </div>
    <div class="rounded-xl bg-mdv-surface-container-low py-6">
      <MdvSearchView v-model="query" v-model:open="open" :variant="variant" :layout="layout" placeholder="Search messages" results-label="Message search results" clear-label="Clear messages query" back-label="Back to messages" :status-text="`${results.length} matching messages`" @search="selected = `Submitted: ${$event || '(all messages)'}`">
        <template #default="{ close }">
          <div class="px-4 pb-2"><MdvCheckbox v-model="unreadOnly" label="Unread only" /></div>
          <MdvList v-if="results.length" :variant="variant === 'contained' ? 'expressive' : 'baseline'">
            <MdvListItem v-for="row in results" :key="row.title" :headline="row.title" :supporting-text="row.detail" interactive @click="choose(row.title, close)"><template #leading><MdvIcon :icon="mailIcon" /></template></MdvListItem>
          </MdvList>
          <p v-else class="p-6 text-sm text-mdv-on-surface-variant">No matching messages. Try “design” or “travel”.</p>
        </template>
      </MdvSearchView>
    </div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ selected }} · Open: {{ open }}</p>
  </div>
</template>
