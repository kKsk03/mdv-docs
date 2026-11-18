<script setup lang="ts">
import { ref } from 'vue'
import { MdvBottomSheet, MdvButton, MdvCheckbox } from '@mdv-ui/mdv'

const open = ref(false)
const showHandle = ref(false)
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="showHandle" label="Show drag handle" />
    <MdvButton @click="open = true">Open reading sheet</MdvButton>
    <MdvBottomSheet
      v-model="open"
      title="Reading list"
      :show-handle="showHandle"
      :draggable="false"
      :partial="0.35"
      max-height="70dvh"
      expand-label="Expand sheet"
      collapse-label="Collapse sheet"
      close-label="Close sheet"
    >
      <div class="grid gap-4">
        <p>Dragging is disabled. Without a handle, a separate expand/collapse action appears when two height states are available.</p>
        <p v-for="index in 10" :key="index">Reading note {{ index }}: leave room to think and revisit ideas.</p>
      </div>
      <template #actions="{ close }">
        <MdvButton @click="close()">Close reading list</MdvButton>
      </template>
    </MdvBottomSheet>
  </div>
</template>
