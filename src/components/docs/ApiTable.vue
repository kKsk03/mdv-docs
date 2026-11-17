<script setup lang="ts">
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ApiTableItem } from './api-table.types'
import './api-table.css'

defineProps<{
  items: readonly ApiTableItem[]
}>()

const { t } = useI18n({ useScope: 'global' })
const tableId = `docs-api-${useId()}`

function templateAttribute(item: ApiTableItem) {
  return item.attribute ?? item.name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
}
</script>

<template>
  <div class="docs-api-table" role="region" :aria-label="t('api.props')" tabindex="0">
    <table class="docs-api-table__props">
      <caption class="docs-api-table__caption">{{ t('api.props') }}</caption>
      <colgroup>
        <col class="docs-api-table__attribute-column" />
        <col class="docs-api-table__property-column" />
        <col class="docs-api-table__type-column" />
        <col class="docs-api-table__default-column" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">{{ t('api.attribute') }}</th>
          <th scope="col">{{ t('api.property') }}</th>
          <th scope="col">{{ t('api.type') }}</th>
          <th scope="col">{{ t('api.default') }}</th>
        </tr>
      </thead>
      <tbody v-for="(item, index) in items" :key="item.name">
        <tr class="docs-api-table__metadata">
          <td><code>{{ templateAttribute(item) }}</code></td>
          <th :id="`${tableId}-${index}`" scope="rowgroup"><code>{{ item.name }}</code></th>
          <td><code>{{ item.type }}</code></td>
          <td>
            <code v-if="item.default !== undefined">{{ item.default }}</code>
            <span v-else>—</span>
          </td>
        </tr>
        <tr v-if="item.description || $slots[`description-${item.name}`]">
          <td :colspan="4" :headers="`${tableId}-${index}`" class="docs-api-table__description">
            <slot :name="`description-${item.name}`" :item="item">{{ item.description }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
