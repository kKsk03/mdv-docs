<script setup lang="ts">
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'
import { MdvIcon } from '@mdv-ui/mdv'
import checkIcon from '@iconify-icons/material-symbols/check'
import { paletteIds, paletteSeeds, type PaletteId } from '@/color-palettes'

defineProps<{ selected: PaletteId }>()
const emit = defineEmits<{ select: [id: PaletteId] }>()
const { t } = useI18n({ useScope: 'global' })
const name = `docs-palette-${useId()}`
const darkCheck = new Set<PaletteId>(['lime', 'amber', 'orange'])
</script>

<template>
  <div class="palette-picker">
    <div class="palette-swatches" role="radiogroup" :aria-label="t('palette.label')">
      <label
        v-for="id in paletteIds"
        :key="id"
        class="palette-swatches__option"
        :title="t(`palette.names.${id}`)"
      >
        <input
          class="palette-swatches__radio"
          type="radio"
          :name="name"
          :value="id"
          :aria-label="t(`palette.names.${id}`)"
          :checked="selected === id"
          @change="emit('select', id)"
        />
        <span
          class="palette-swatches__dot"
          :style="{ '--palette-swatch': paletteSeeds[id], color: darkCheck.has(id) ? '#000' : '#fff' }"
          aria-hidden="true"
        >
          <MdvIcon v-if="selected === id" :icon="checkIcon" :size="20" />
        </span>
      </label>
    </div>
    <p class="palette-picker__selection" aria-hidden="true">{{ t(`palette.names.${selected}`) }}</p>
  </div>
</template>

<style scoped>
.palette-swatches {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  inline-size: 15rem;
  max-inline-size: 100%;
  margin-inline: auto;
}

.palette-swatches__option {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  cursor: pointer;
}

.palette-swatches__radio {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  margin: 0;
  opacity: 0;
  cursor: inherit;
}

.palette-swatches__dot {
  display: grid;
  place-items: center;
  inline-size: min(75%, 2.25rem);
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--palette-swatch);
  pointer-events: none;
}

@media (hover: hover) {
  .palette-swatches__option:hover .palette-swatches__dot {
    filter: brightness(1.12);
  }
}

.palette-swatches__radio:checked + .palette-swatches__dot {
  outline: 2px solid var(--mdv-sys-color-on-surface);
  outline-offset: 2px;
}

.palette-swatches__radio:focus-visible + .palette-swatches__dot {
  outline: 2px dashed var(--mdv-sys-color-on-surface);
  outline-offset: 3px;
}

.palette-picker__selection {
  margin: 0.25rem 0;
  color: var(--mdv-sys-color-on-surface-variant);
  font-size: var(--mdv-sys-typescale-body-small-size);
  text-align: center;
}

@media (forced-colors: active) {
  .palette-swatches__dot { forced-color-adjust: none; }
  .palette-swatches__radio:is(:checked, :focus-visible) + .palette-swatches__dot {
    outline-color: CanvasText;
  }
}
</style>
