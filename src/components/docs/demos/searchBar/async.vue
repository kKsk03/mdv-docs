<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { MdvButton, MdvCheckbox, MdvLinearProgress, MdvList, MdvListItem, MdvSearchView } from '@mdv-ui/mdv'

const query = ref('design')
const loading = ref(false)
const failed = ref(false)
const failNext = ref(false)
const results = ref<string[]>([])
const searched = ref(false)
const catalog = ['Material Design introduction', 'Designing accessible forms', 'Search interaction guide', 'Navigation patterns']
let timer: ReturnType<typeof setTimeout> | undefined
let request = 0
const status = computed(() => loading.value ? 'Searching documents.' : failed.value ? 'Search failed. Retry is available.' : searched.value ? `${results.value.length} documents found.` : 'Edit the query, then press Enter.')
function cancel() {
  request++
  clearTimeout(timer)
  loading.value = false
  failed.value = false
  searched.value = false
  results.value = []
}
function search(value: string) {
  cancel()
  loading.value = true
  const ticket = request
  const reject = failNext.value
  failNext.value = false
  timer = setTimeout(() => {
    if (ticket !== request) return
    loading.value = false
    searched.value = true
    failed.value = reject
    if (!reject) results.value = catalog.filter(title => title.toLowerCase().includes(value.trim().toLowerCase()))
  }, 650)
}
watch(query, cancel)
onBeforeUnmount(cancel)
</script>

<template>
  <MdvSearchView v-model="query" placeholder="Search the catalog" results-label="Catalog results" clear-label="Clear catalog query" back-label="Close catalog search" :loading="loading" :status-text="status" @search="search">
    <template #default="{ close }">
      <div class="px-4 pb-2"><MdvCheckbox v-model="failNext" label="Fail the next simulated request" /></div>
      <MdvLinearProgress v-if="loading" indeterminate aria-label="Searching catalog" />
      <div v-else-if="failed" class="grid gap-3 p-5"><p class="text-sm">The simulated service is unavailable.</p><MdvButton variant="tonal" @click="search(query)">Retry search</MdvButton></div>
      <MdvList v-else-if="results.length"><MdvListItem v-for="title in results" :key="title" :headline="title" interactive @click="close()" /></MdvList>
      <p v-else class="p-5 text-sm text-mdv-on-surface-variant">{{ searched ? 'No documents matched. Try “design”.' : 'Press Enter to run a simulated search. Editing cancels stale results.' }}</p>
    </template>
  </MdvSearchView>
</template>
