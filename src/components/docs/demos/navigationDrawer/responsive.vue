<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId, useTemplateRef, watch } from 'vue'
import { MdvAppBar, MdvAppBarScaffold, MdvCheckbox, MdvIcon, MdvIconButton, MdvModalNavigationDrawer, MdvNavigationDrawer, MdvNavigationDrawerItem } from '@mdv-ui/mdv'
import menuIcon from '@iconify-icons/material-symbols/menu'

const workspace = useTemplateRef<HTMLElement>('workspace')
const id = `responsive-example-${useId()}`
const wide = ref(false)
const compact = ref(true)
const modal = ref(false)
const current = ref('Inbox')
const destinations = ['Inbox', 'Saved', 'Archive']
let observer: ResizeObserver | undefined
onMounted(() => {
  const element = workspace.value
  if (!element) return
  const measure = () => { compact.value = element.clientWidth < 600 }
  measure()
  observer = new ResizeObserver(measure)
  observer.observe(element)
})
watch(compact, value => { if (!value) modal.value = false })
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="wide" label="Use a 720px workspace" />
    <div class="overflow-x-auto rounded-xl" role="region" aria-label="Responsive drawer workspace" tabindex="0">
      <div ref="workspace" class="relative isolate flex h-96 overflow-hidden bg-mdv-surface-container-low [contain:layout]" :style="{ inlineSize: wide ? '720px' : 'min(100%, 360px)' }">
        <MdvNavigationDrawer v-if="!compact" title="Mail" width="240px" aria-label="Expanded workspace destinations">
          <MdvNavigationDrawerItem v-for="destination in destinations" :key="destination" :label="destination" :active="current === destination" @click="current = destination" />
        </MdvNavigationDrawer>
        <MdvAppBarScaffold class="min-w-0 flex-1" :content-attrs="{ 'aria-label': 'Responsive workspace content' }">
          <template #appbar>
            <MdvAppBar :title="current" :heading-level="3">
              <template v-if="compact" #leading>
                <MdvIconButton variant="standard" aria-label="Open workspace navigation" :aria-controls="id" :aria-expanded="modal" @click="modal = true"><MdvIcon :icon="menuIcon" /></MdvIconButton>
              </template>
            </MdvAppBar>
          </template>
          <p class="p-5 text-sm text-mdv-on-surface-variant">{{ compact ? 'Compact: modal navigation.' : 'Expanded: standard navigation.' }}</p>
        </MdvAppBarScaffold>
        <MdvModalNavigationDrawer v-if="compact" :id="id" v-model="modal" title="Workspace destinations">
          <MdvNavigationDrawerItem v-for="destination in destinations" :key="destination" :label="destination" :active="current === destination" @click="current = destination" />
        </MdvModalNavigationDrawer>
      </div>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current destination: {{ current }}</p>
  </div>
</template>
