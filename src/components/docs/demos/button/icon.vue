<script setup lang="ts">
import { MdvButton, MdvIcon } from '@mdv-ui/mdv'
import addIcon from '@iconify-icons/material-symbols/add'
import arrowForwardIcon from '@iconify-icons/material-symbols/arrow-forward'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton>
      <template #leading>
        <MdvIcon :icon="addIcon" />
      </template>
      Add
    </MdvButton>

    <MdvButton variant="tonal">
      Next
      <template #trailing>
        <MdvIcon :icon="arrowForwardIcon" />
      </template>
    </MdvButton>
  </div>
</template>
