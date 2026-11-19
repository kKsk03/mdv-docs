<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { MdvCheckbox, MdvIcon, MdvNavigationBar, MdvNavigationBarItem } from '@mdv-ui/mdv'
import bookIcon from '@iconify-icons/material-symbols/menu-book'
import settingsIcon from '@iconify-icons/material-symbols/settings'
import navigationIcon from '@iconify-icons/material-symbols/navigation-outline'

const route = useRoute()
const disableSetup = ref(false)
const locale = computed(() => route.meta.locale === 'zh-CN' ? 'zh-CN' : 'en-US')
const destinations = [
  { slug: 'getting-started/introduction', label: 'Intro', icon: bookIcon },
  { slug: 'getting-started/setup', label: 'Setup', icon: settingsIcon },
  { slug: 'components/navigation-bar', label: 'Navigation', icon: navigationIcon },
]
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="disableSetup" label="Disable the Setup destination" />
    <div class="relative isolate h-56 overflow-hidden rounded-xl bg-mdv-surface-container-low [contain:layout]">
      <p class="p-6 pb-28 text-sm text-mdv-on-surface-variant">These links navigate to real documentation pages.</p>
      <MdvNavigationBar aria-label="Documentation example destinations">
        <RouterLink v-for="destination in destinations" :key="destination.slug" :to="`/${locale}/${destination.slug}`" custom v-slot="{ href, isExactActive, navigate }">
          <MdvNavigationBarItem :href="href" :label="destination.label" :active="isExactActive" :disabled="disableSetup && destination.label === 'Setup'" @click="disableSetup && destination.label === 'Setup' ? $event.preventDefault() : navigate($event)">
            <template #icon><MdvIcon :icon="destination.icon" /></template>
          </MdvNavigationBarItem>
        </RouterLink>
      </MdvNavigationBar>
    </div>
  </div>
</template>
