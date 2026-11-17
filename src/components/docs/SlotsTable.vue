<script setup lang="ts">
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SlotTableItem } from './api-table.types'
import './api-table.css'

defineProps<{
  items: readonly SlotTableItem[]
}>()

const { t } = useI18n({ useScope: 'global' })
const tableId = `docs-slots-${useId()}`
</script>

<template>
  <div class="docs-api-table" role="region" :aria-label="t('api.slots')" tabindex="0">
    <table>
      <caption class="docs-api-table__caption">{{ t('api.slots') }}</caption>
      <thead>
        <tr>
          <th scope="col">{{ t('api.name') }}</th>
        </tr>
      </thead>
      <tbody v-for="(item, index) in items" :key="item.name">
        <tr class="docs-api-table__metadata">
          <th :id="`${tableId}-${index}`" scope="rowgroup"><code>{{ item.name }}</code></th>
        </tr>
        <tr v-if="item.description || $slots[`description-${item.name}`]">
          <td :headers="`${tableId}-${index}`" class="docs-api-table__description">
            <slot :name="`description-${item.name}`" :item="item">{{ item.description }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
