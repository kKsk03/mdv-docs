<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvDialog } from '@mdv-ui/mdv'

const open = ref(false)
</script>

<template>
  <MdvButton @click="open = true">Read workspace guidelines</MdvButton>
  <MdvDialog v-model="open" title="Workspace guidelines" role="dialog" style="--mdv-dialog-width: 560px">
    <div class="space-y-5">
      <p v-for="index in 18" :key="index">Section {{ index }}. Keep shared project notes clear, record decisions where the team can find them, and review changes before publishing. This extended example lets you check scrolling while the title and actions remain visible.</p>
    </div>
    <template #actions="{ close }">
      <MdvButton variant="text" @click="close('back')">Back</MdvButton>
      <MdvButton variant="text" @click="close('acknowledged')">I understand</MdvButton>
    </template>
  </MdvDialog>
</template>
