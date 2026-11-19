<script setup lang="ts">
import { ref } from 'vue'
import { MdvAppBar, MdvAppBarScaffold, MdvCheckbox, MdvNavigationDrawer, MdvNavigationDrawerGroup, MdvNavigationDrawerItem } from '@mdv-ui/mdv'

const open = ref(true)
const dark = ref(false)
const rtl = ref(false)
const current = ref('Inbox')
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="open" label="Show composed drawer" />
      <MdvCheckbox v-model="dark" label="Use a local dark theme" />
      <MdvCheckbox v-model="rtl" label="Use right-to-left composition" />
    </div>
    <div class="overflow-x-auto rounded-xl" role="region" aria-label="Drawer and app bar composition" tabindex="0">
      <div :data-mdv-theme="dark ? 'dark' : 'light'" :dir="rtl ? 'rtl' : 'ltr'" class="flex h-80 min-w-0 overflow-hidden bg-mdv-surface-container-low text-mdv-on-surface" style="inline-size: max(100%, 640px)">
        <MdvNavigationDrawer v-model="open" title="Mail" width="240px">
          <MdvNavigationDrawerItem label="Inbox" :active="current === 'Inbox'" @click="current = 'Inbox'" />
          <MdvNavigationDrawerGroup label="Folders" divider>
            <MdvNavigationDrawerItem v-for="number in 12" :key="number" :label="`Project ${number}: a long destination label`" :active="current === `Project ${number}`" :badge="number" @click="current = `Project ${number}`" />
          </MdvNavigationDrawerGroup>
        </MdvNavigationDrawer>
        <MdvAppBarScaffold class="min-w-0 flex-1" :content-attrs="{ 'aria-label': 'Composed workspace content' }">
          <template #appbar><MdvAppBar :title="current" :heading-level="3" /></template>
          <div class="grid gap-4 p-5 text-sm">
            <p v-for="number in 8" :key="number">Workspace section {{ number }}. Scroll this content and compare the drawer corner with the app bar.</p>
          </div>
        </MdvAppBarScaffold>
      </div>
    </div>
  </div>
</template>
