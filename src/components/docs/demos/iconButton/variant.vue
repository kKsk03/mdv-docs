<script setup lang="ts">
import { ref } from 'vue'
import { MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import type { MdvIconButtonVariant } from '@mdv-ui/mdv'
import favoriteIcon from '@iconify-icons/material-symbols/favorite'
import favoriteOutlineIcon from '@iconify-icons/material-symbols/favorite-outline'

const variants: MdvIconButtonVariant[] = ['filled', 'tonal', 'outlined', 'standard']
const selected = ref<Record<MdvIconButtonVariant, boolean>>({ filled: false, tonal: false, outlined: false, standard: false })
const actions = ref(0)
</script>

<template>
  <div class="grid gap-5">
    <div class="grid gap-4 sm:grid-cols-2">
      <div v-for="variant in variants" :key="variant" class="grid gap-3 rounded-xl bg-mdv-surface-container-low p-4">
        <p class="font-medium">{{ variant }}</p>
        <div class="flex flex-wrap gap-5">
          <div class="grid justify-items-center gap-2">
            <MdvIconButton :variant="variant" :aria-label="`Favorite action, ${variant}`" @click="actions++"><MdvIcon :icon="favoriteIcon" /></MdvIconButton>
            <span class="text-sm">Action</span>
          </div>
          <div class="grid justify-items-center gap-2">
            <MdvIconButton v-model:selected="selected[variant]" :variant="variant" :aria-label="`Favorite toggle, ${variant}`">
              <MdvIcon :icon="favoriteOutlineIcon" />
              <template #selected><MdvIcon :icon="favoriteIcon" /></template>
            </MdvIconButton>
            <span class="text-sm">Toggle</span>
          </div>
        </div>
      </div>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Actions: {{ actions }}</p>
  </div>
</template>
