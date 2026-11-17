<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
import { useI18n } from 'vue-i18n'
import DemoBlock from '@/components/docs/DemoBlock.vue'

const { t } = useI18n({ useScope: 'global' })
const code = `<MdvButton variant="filled">Filled</MdvButton>
<MdvButton variant="tonal">Tonal</MdvButton>
<MdvButton variant="outlined">Outlined</MdvButton>
<MdvButton variant="elevated">Elevated</MdvButton>
<MdvButton variant="text">Text</MdvButton>`
</script>

<template>
  <DemoBlock :title="t('demo.buttonVariants')" :code="code">
    <div class="flex flex-wrap items-center gap-3">
      <MdvButton variant="filled">{{ t('demo.variants.filled') }}</MdvButton>
      <MdvButton variant="tonal">{{ t('demo.variants.tonal') }}</MdvButton>
      <MdvButton variant="outlined">{{ t('demo.variants.outlined') }}</MdvButton>
      <MdvButton variant="elevated">{{ t('demo.variants.elevated') }}</MdvButton>
      <MdvButton variant="text">{{ t('demo.variants.text') }}</MdvButton>
    </div>
  </DemoBlock>
</template>
