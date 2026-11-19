<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon } from '@mdv-ui/mdv'
import favorite from '@iconify-icons/material-symbols/favorite'
import favoriteOutline from '@iconify-icons/material-symbols/favorite-outline'
import favoriteRounded from '@iconify-icons/material-symbols/favorite-rounded'
import favoriteOutlineRounded from '@iconify-icons/material-symbols/favorite-outline-rounded'
import favoriteSharp from '@iconify-icons/material-symbols/favorite-sharp'
import favoriteOutlineSharp from '@iconify-icons/material-symbols/favorite-outline-sharp'

const filled = ref(false)
const styles = [
  { name: 'Outlined', outline: favoriteOutline, filled: favorite },
  { name: 'Rounded', outline: favoriteOutlineRounded, filled: favoriteRounded },
  { name: 'Sharp', outline: favoriteOutlineSharp, filled: favoriteSharp },
]
</script>

<template>
  <div class="grid gap-5">
    <MdvCheckbox v-model="filled" label="Use filled artwork" />
    <div class="flex flex-wrap gap-6">
      <div v-for="style in styles" :key="style.name" class="grid min-w-24 justify-items-center gap-3">
        <MdvIcon :icon="filled ? style.filled : style.outline" :size="32" />
        <span class="text-sm">{{ style.name }}</span>
      </div>
    </div>
  </div>
</template>
