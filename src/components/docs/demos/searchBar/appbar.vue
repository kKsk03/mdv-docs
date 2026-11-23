<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdvAppBarScaffold, MdvButton, MdvDialog, MdvIcon, MdvIconButton, MdvList, MdvListItem, MdvSearchAppBar } from '@mdv-ui/mdv'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import moreIcon from '@iconify-icons/material-symbols/more-vert'

const query = ref('')
const about = ref(false)
const selected = ref('Inbox')
const subjects = ['Design review', 'Weekend travel', 'Accessibility checklist', 'Project updates']
const results = computed(() => subjects.filter(title => title.toLowerCase().includes(query.value.toLowerCase())))
</script>

<template>
  <div class="grid gap-4">
    <div class="h-[28rem] min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low">
      <MdvAppBarScaffold class="h-full" :content-attrs="{ 'aria-label': 'Search application messages', tabindex: 0 }">
        <template #appbar>
          <MdvSearchAppBar v-model="query" appearance="bordered" scroll-behavior="enter-always" placeholder="Search inbox" results-label="Inbox results" clear-label="Clear inbox query" back-label="Back to inbox" :status-text="`${results.length} inbox results`">
            <template #leading><MdvIcon :icon="homeIcon" /></template>
            <template #actions><MdvIconButton variant="standard" aria-label="About search example" @click="about = true"><MdvIcon :icon="moreIcon" /></MdvIconButton></template>
            <template #default="{ close }">
              <MdvList v-if="results.length"><MdvListItem v-for="title in results" :key="title" :headline="title" interactive @click="selected = title; close()" /></MdvList>
              <p v-else class="p-5 text-sm">No matching inbox messages.</p>
            </template>
          </MdvSearchAppBar>
        </template>
        <div class="p-4 text-sm text-mdv-on-surface-variant">Selected: {{ selected }}. Scroll this pane down and then up to reveal the search App Bar.</div>
        <MdvList><MdvListItem v-for="index in 20" :key="index" :headline="subjects[(index - 1) % subjects.length]!" supporting-text="Message preview · The scaffold owns this scroll container." /></MdvList>
      </MdvAppBarScaffold>
    </div>
    <MdvDialog v-model="about" title="Search App Bar" description="The search field belongs to a 64px App Bar. Its scroll target comes from the surrounding scaffold."><template #actions="{ close }"><MdvButton variant="text" @click="close()">Done</MdvButton></template></MdvDialog>
  </div>
</template>
