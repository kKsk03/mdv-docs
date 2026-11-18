<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'

const updates = ref(true)
const priority = ref(false)
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox
      v-model="updates"
      label="Product updates"
      supporting-text="Receive occasional news about new components."
    />
    <MdvCheckbox v-model="priority" supporting-text="The default slot replaces the label prop.">
      Include <strong>priority notifications</strong>
    </MdvCheckbox>
  </div>
</template>
