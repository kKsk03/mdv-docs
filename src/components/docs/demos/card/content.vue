<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCard } from '@mdv-ui/mdv'

const saved = ref(false)
const message = ref('Discover a quiet place along the water.')
</script>

<template>
  <MdvCard class="max-w-md" variant="filled" title="A day by the river" subtitle="Travel journal · 5 min read">
    <template #media>
      <svg viewBox="0 0 480 200" class="w-full bg-mdv-secondary-container text-mdv-secondary" role="img" aria-label="Abstract hills and a river">
        <circle cx="360" cy="50" r="26" fill="currentColor" opacity=".35" />
        <path d="M0 155 100 65 220 145 330 90 480 160V200H0Z" fill="currentColor" opacity=".3" />
        <path d="M0 185Q120 115 240 175T480 155V200H0Z" fill="currentColor" opacity=".6" />
      </svg>
    </template>
    <p class="text-sm" role="status">{{ message }}</p>
    <template #actions>
      <MdvButton variant="text" @click="message = 'The riverside walk is 4 km long and open all year.'">Details</MdvButton>
      <MdvButton variant="tonal" @click="saved = !saved">{{ saved ? 'Saved' : 'Save article' }}</MdvButton>
    </template>
  </MdvCard>
</template>
