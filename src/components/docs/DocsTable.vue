<script setup lang="ts">
import './docs-table.css'

withDefaults(defineProps<{
  label: string
  minWidth?: string
}>(), {
  minWidth: '24rem',
})
</script>

<template>
  <div
    class="docs-table"
    role="region"
    :aria-label="label"
    :style="{ '--docs-table-min-width': minWidth }"
    tabindex="0"
  >
    <slot />
  </div>
</template>
