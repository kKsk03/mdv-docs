<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvAppBar, MdvAppBarScaffold, MdvButton, MdvCheckbox, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectValue } from '@mdv-ui/mdv'

const behavior = ref<MdvSelectValue | null>('exit-until-collapsed')
const transparent = ref(false)
const scaffold = useTemplateRef<InstanceType<typeof MdvAppBarScaffold>>('scaffold')
const behaviors = [
  { value: 'none', label: 'None' },
  { value: 'pinned', label: 'Pinned' },
  { value: 'exit-until-collapsed', label: 'Exit until collapsed' },
  { value: 'enter-always', label: 'Enter always' },
]
const scrollBehaviors = ['none', 'pinned', 'exit-until-collapsed', 'enter-always'] as const
const scrollBehavior = () => scrollBehaviors.find(value => value === behavior.value) ?? 'none'

function backToTop() {
  scaffold.value?.contentElement?.scrollTo({
    top: 0,
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  })
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap items-center gap-3">
      <MdvSelect v-model="behavior" label="Scroll behavior" :options="behaviors" />
      <MdvCheckbox v-model="transparent" label="Transparent on scroll" />
      <MdvButton variant="outlined" @click="backToTop">Back to top</MdvButton>
    </div>
    <MdvAppBarScaffold
      ref="scaffold"
      class="h-80 rounded-mdv-large border border-mdv-outline-variant bg-mdv-surface-container-low"
      :content-attrs="{ 'aria-label': 'App Bar demo content' }"
    >
      <template #appbar>
        <MdvAppBar
          variant="large"
          appearance="elevated"
          title="Weekend adventures"
          collapsed-title="Adventures"
          subtitle="Scroll the content below"
          :heading-level="3"
          :scroll-behavior="scrollBehavior()"
          :transparent-on-scroll="transparent"
        >
          <template #actions="{ collapsed }">
            <MdvButton variant="text" @click="backToTop">{{ collapsed ? 'Top' : 'Back to top' }}</MdvButton>
          </template>
        </MdvAppBar>
      </template>
      <div class="grid gap-4 p-4">
        <div v-for="index in 12" :key="index" class="rounded-mdv-medium bg-mdv-surface p-4">
          <p class="font-medium">Destination {{ index }}</p>
          <p class="mt-2 text-sm text-mdv-on-surface-variant">Scroll here to explore the App Bar behavior.</p>
        </div>
      </div>
    </MdvAppBarScaffold>
  </div>
</template>
