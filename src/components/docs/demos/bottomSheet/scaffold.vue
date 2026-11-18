<script setup lang="ts">
import { ref } from 'vue'
import { MdvBottomSheetScaffold, MdvButton } from '@mdv-ui/mdv'
import type { MdvBottomSheetState } from '@mdv-ui/mdv'

const state = ref<MdvBottomSheetState>('partial')
const visits = ref(0)
</script>

<template>
  <div class="h-[480px] overflow-hidden rounded-xl border border-mdv-outline-variant bg-mdv-surface">
    <MdvBottomSheetScaffold
      v-model="state"
      title="Nearby places"
      :peek-height="88"
      hideable
      expand-label="Expand places"
      collapse-label="Collapse places"
      close-label="Hide places"
    >
      <div class="grid justify-items-start gap-4 p-5">
        <p class="text-lg font-medium">Explore your neighborhood</p>
        <p class="text-sm text-mdv-on-surface-variant" role="status">Sheet: {{ state }} · Visits: {{ visits }}</p>
        <div class="flex flex-wrap gap-3">
          <MdvButton variant="tonal" @click="visits++">Visit a place</MdvButton>
          <MdvButton variant="outlined" @click="state = 'expanded'">Show places</MdvButton>
        </div>
        <p class="text-sm">The main page remains interactive while this standard sheet is open.</p>
      </div>
      <template #sheet>
        <div class="grid gap-4">
          <p v-for="place in ['Riverside park', 'Community library', 'Art museum', 'Botanical garden', 'Coffee house', 'City market']" :key="place">
            {{ place }}
          </p>
        </div>
      </template>
      <template #actions="{ collapse, close }">
        <MdvButton variant="text" @click="collapse()">Collapse</MdvButton>
        <MdvButton variant="text" @click="close()">Hide</MdvButton>
      </template>
    </MdvBottomSheetScaffold>
  </div>
</template>
