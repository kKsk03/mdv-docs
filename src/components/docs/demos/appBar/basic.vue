<script setup lang="ts">
import { ref } from 'vue'
import { MdvAppBar, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import menu from '@iconify-icons/material-symbols/menu'
import favorite from '@iconify-icons/material-symbols/favorite-outline'

const message = ref('Choose an action.')
</script>

<template>
  <div class="grid gap-3">
    <MdvAppBar title="My library" :heading-level="3">
      <template #leading>
        <MdvIconButton variant="standard" aria-label="Open navigation" @click="message = 'Navigation requested.'">
          <MdvIcon :icon="menu" />
        </MdvIconButton>
      </template>
      <template #actions>
        <MdvIconButton variant="standard" aria-label="Show favorites" @click="message = 'Favorites requested.'">
          <MdvIcon :icon="favorite" />
        </MdvIconButton>
      </template>
    </MdvAppBar>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
