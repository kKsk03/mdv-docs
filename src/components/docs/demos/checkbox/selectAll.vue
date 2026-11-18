<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCheckboxModelValue, MdvCheckboxValue } from '@mdv-ui/mdv'

const options = ['Email', 'SMS', 'Push']
const selected = ref<MdvCheckboxValue[]>(['Email'])
const allSelected = computed(() => selected.value.length === options.length)
const partlySelected = computed(() => selected.value.length > 0 && !allSelected.value)

function selectAll(value: MdvCheckboxModelValue) {
  selected.value = value === true ? [...options] : []
}
</script>

<template>
  <div class="grid gap-3">
    <fieldset class="min-w-0">
      <legend class="mb-2 font-medium">Notification channels</legend>
      <MdvCheckbox
        :model-value="allSelected"
        :indeterminate="partlySelected"
        label="Select all"
        @update:model-value="selectAll"
      />
      <div class="ms-6 grid justify-items-start">
        <MdvCheckbox
          v-for="option in options"
          :key="option"
          v-model="selected"
          :value="option"
          :label="option"
        />
      </div>
    </fieldset>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      Selected: {{ selected.length ? selected.join(', ') : 'None' }}
    </p>
  </div>
</template>
