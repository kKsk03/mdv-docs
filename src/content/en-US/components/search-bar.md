<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import SearchBarDemo from '@/components/docs/demos/searchBar/bar.vue'
import SearchFormDemo from '@/components/docs/demos/searchBar/form.vue'
import SearchViewDemo from '@/components/docs/demos/searchBar/view.vue'
import SearchTriggerDemo from '@/components/docs/demos/searchBar/trigger.vue'
import SearchGuardDemo from '@/components/docs/demos/searchBar/guard.vue'
import SearchAsyncDemo from '@/components/docs/demos/searchBar/async.vue'
import SearchAppBarDemo from '@/components/docs/demos/searchBar/appbar.vue'
import SearchCompositionDemo from '@/components/docs/demos/searchBar/composition.vue'

const barProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'string', default: "'' (internal)", description: 'Query. Omit for internal state; an explicit value lets the parent accept or reject updates.' },
  { name: 'placeholder', type: 'string', default: "'搜索'", description: 'Input hint. Also provides the input/dialog name unless label is supplied. Set English labels explicitly in English applications.' },
  { name: 'label', type: 'string', default: 'placeholder', description: 'Accessible input name; SearchView also uses it to name its dialog.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field and blocks opening or submitting search.' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Prevents edits and clearing while allowing existing results to be opened and searched.' },
  { name: 'clearable', type: 'boolean', default: 'true', description: 'Shows a clear action for a nonempty editable query.' },
  { name: 'clearLabel', type: 'string', default: "'清空搜索'", description: 'Accessible name of the clear action.' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Sets aria-busy on the input, and on View results. Does not automatically fetch, show a spinner, or disable editing.' },
]
const viewProps: ApiTableItem[] = [
  { name: 'open', attribute: 'v-model:open', type: 'boolean', default: 'false', description: 'Expanded search state. Internally managed when unbound; bound models require parent acceptance.' },
  { name: 'variant', type: "'contained' | 'divided'", default: "'contained'", description: 'Separate rounded search/result surfaces or a joined surface with an input divider.' },
  { name: 'layout', type: "'auto' | 'docked' | 'fullscreen'", default: "'auto'", description: 'auto uses fullscreen below 600px viewport width and docked at 600px and above. Both are modal.' },
  { name: 'backLabel', type: 'string', default: "'返回'", description: 'Accessible name of the back action shown for fullscreen, divided, or custom-trigger search.' },
  { name: 'closeOnEsc', type: 'boolean', default: 'true', description: 'Allows Escape on the topmost search dialog to request closing.' },
  { name: 'closeOnScrim', type: 'boolean', default: 'true', description: 'Allows a completed scrim click to request closing.' },
  { name: 'destroyOnClose', type: 'boolean', default: 'false', description: 'Destroys expanded content after closing. External query/open models are retained.' },
  { name: 'beforeClose', type: 'MdvSearchBeforeClose', description: 'Synchronous/asynchronous close guard. false blocks a request. Direct changes to open bypass the guard.' },
  { name: 'inputAttrs', type: 'InputHTMLAttributes', description: 'Native attributes/listeners for the actual search input, such as id, name, form, required, and ARIA. Only the active field participates in the form.' },
  { name: 'statusText', type: 'string', default: "''", description: 'Concise polite result-status announcement, such as “3 documents found”. Does not announce the entire result list.' },
]
const appBarProps: ApiTableItem[] = [
  { name: 'appearance', type: "'default' | 'elevated' | 'bordered'", default: "'default'", description: 'App Bar surface treatment, matching MdvAppBar.' },
  { name: 'scrollBehavior', type: "'none' | 'pinned' | 'enter-always'", default: "'none'", description: 'Scroll behavior of the 64px search App Bar. Does not support exit-until-collapsed.' },
  { name: 'scrollTarget', type: 'MdvAppBarScrollTarget', description: 'Window, HTMLElement, selector, or a resolver. Omit to use the surrounding scaffold content, otherwise window. An unresolved explicit target does not fall back.' },
  { name: 'scrolled', type: 'boolean', default: 'Automatic', description: 'Overrides the scrolled surface state, not the bar hiding/expansion progress.' },
]
const barSlots: SlotTableItem[] = [
  { name: 'leading', description: 'Replaces the decorative search icon. No slot arguments.' },
  { name: 'trailing', description: 'Additional content after the built-in clear action. No slot arguments; name interactive actions.' },
]
const viewSlots: SlotTableItem[] = [
  { name: 'default', description: 'Application-owned suggestions, filters, loading/error/empty states, and results. Receives { query, expanded, close, search }.' },
  { name: 'trigger', description: 'Replaces the entry SearchBar. Receives search state plus triggerProps; bind the complete object, including ref, to one native button or single-button-root component.' },
  { name: 'leading', description: 'Entry-bar leading content, receiving search state. Expanded leading content follows the layout/back-action rules.' },
  { name: 'trailing', description: 'Receives search state. Rendered in both entry and expanded bars; avoid fixed duplicate IDs and duplicated overlays.' },
]
const appBarSlots: SlotTableItem[] = [
  { name: 'default', description: 'Search results; receives { query, expanded, close, search }.' },
  { name: 'leading', description: 'Action outside the search field in the App Bar. Receives { scrolled, collapsed }.' },
  { name: 'actions', description: 'Trailing App Bar actions outside the field. Receives { scrolled, collapsed }.' },
  { name: 'search-leading', description: 'Entry search field leading content; receives search state.' },
  { name: 'search-trailing', description: 'Search field trailing content; receives search state and can render in both entry and expanded fields.' },
]
</script>

# Search Bar

`MdvSearchBar` is an editable search field. `MdvSearchView` adds suggestions/results in an expandable modal surface. `MdvSearchAppBar` places that experience inside an application bar. This page covers all three components in **MDV 0.1.5**.

The application owns its data, filtering, requests, history, and result actions. These components do not implement a search service or add implicit combobox/listbox semantics to arbitrary results.

## Standalone input, submission, and forms

Use SearchBar when search updates an existing page without opening a separate result surface. It is at least 56px high and fills its container. `v-model` tracks input; `search` is an explicit submission event. Pressing Enter emits search and prevents implicit native form submission, so the example provides a separate submit button for reading `FormData`.

Clearing emits the empty query and `clear`, then returns focus to the input. Readonly allows viewing/submitting the current query but prevents edits and clearing. Disabled blocks interaction. Native `name`, `form`, `id`, input events, and validation attributes go directly to the SearchBar input; `class` and `style` style its outer wrapper. Reset restores its initial query, subject to parent acceptance for a controlled value.

<DemoBlock>
  <SearchBarDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvCheckbox, MdvSearchBar } from '@mdv-ui/mdv'

const id = `search-bar-form-${useId()}`
const query = ref('Material')
const disabled = ref(false)
const readonly = ref(false)
const message = ref('Press Enter to search, or read the form data separately.')
function search(value: string) { message.value = `Search submitted: ${value || '(all documents)'}` }
function submit(event: Event) {
  message.value = `Form data: ${JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])}`
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-4"><MdvCheckbox v-model="disabled" label="Disable search" /><MdvCheckbox v-model="readonly" label="Read only" /></div>
    <form :id="id" class="grid gap-4" @submit.prevent="submit">
      <MdvSearchBar v-model="query" name="q" placeholder="Search documents" clear-label="Clear query" :disabled="disabled" :readonly="readonly" @search="search" @clear="message = 'Query cleared.'" />
      <div class="flex flex-wrap gap-3"><MdvButton type="submit">Read search form</MdvButton><MdvButton type="reset" variant="outlined">Reset query</MdvButton></div>
    </form>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ message }} · Query: {{ query || '(empty)' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## SearchView input ownership and forms

SearchView's entry and expanded inputs share a query, but only the active one owns the form name and supplied ID. Use `input-attrs` to provide native association instead of putting `name` on the component wrapper. This example reads the external form from either presentation without duplicating its `q` field, and resets to the initial query while search remains open. The buttons inside the modal explicitly reference the same form.

<DemoBlock>
  <SearchFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvSearchView } from '@mdv-ui/mdv'

const id = `search-view-form-${useId()}`
const inputId = `search-view-input-${useId()}`
const query = ref('design')
const message = ref('No form submission yet.')
function submit(event: Event) {
  message.value = `Form data: ${JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])}`
}
</script>

<template>
  <div class="grid gap-4">
    <MdvSearchView v-model="query" placeholder="Search external form" clear-label="Clear form query" back-label="Back to external form" variant="divided" :input-attrs="{ id: inputId, form: id, name: 'q' }">
      <template #default="{ close }">
        <div class="grid gap-4 p-5">
          <p class="text-sm">Only the active search input belongs to the external form.</p>
          <div class="flex flex-wrap gap-3"><MdvButton type="submit" :form="id">Submit from search</MdvButton><MdvButton type="reset" :form="id" variant="outlined">Reset from search</MdvButton><MdvButton variant="text" @click="close()">Close form search</MdvButton></div>
          <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ message }} · Query: {{ query }}</p>
        </div>
      </template>
    </MdvSearchView>
    <form :id="id" class="flex flex-wrap gap-3" @submit.prevent="submit">
      <MdvButton type="submit">Submit collapsed search</MdvButton><MdvButton type="reset" variant="outlined">Reset collapsed search</MdvButton>
    </form>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ message }} · Query: {{ query }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Suggestions, appearances, and responsive layouts

Focus or click the entry field to open SearchView. `contained` uses separated rounded input/result surfaces; `divided` uses a joined surface with a divider. The List appearance in the example changes alongside the search appearance, under application control.

`auto` responds to the **viewport**, not the demo container: below 600px it becomes fullscreen; at 600px and above it docks to the entry. Either layout is a native modal dialog with a scrim and focus containment. Docked results are therefore not an inline, nonmodal popover. Expanded contained search extends 12px beyond either side of its entry; the default wrapper supplies 24px horizontal padding. Give the component room instead of overriding internal positioning.

Enter emits `search` and moves focus into the results region; it does not select a result or close the view. The example chooses a result explicitly and calls its slot `close()` action. A clear action leaves search open. Filters and empty states are ordinary slot content.

<DemoBlock>
  <SearchViewDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvList, MdvListItem, MdvSearchView, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSearchLayout, MdvSearchSlotProps, MdvSearchVariant } from '@mdv-ui/mdv'
import mailIcon from '@iconify-icons/material-symbols/mail-outline'

const query = ref('')
const open = ref(false)
const variant = ref<MdvSearchVariant>('contained')
const layout = ref<MdvSearchLayout>('auto')
const unreadOnly = ref(false)
const selected = ref('No result selected.')
const variants = ['contained', 'divided'].map(value => ({ value, label: value }))
const layouts = ['auto', 'docked', 'fullscreen'].map(value => ({ value, label: value }))
const rows = [
  { title: 'Material Design guidelines', detail: 'Design team · Updated this morning', unread: true },
  { title: 'Travel plans for the weekend', detail: 'Travel club · Routes and meeting points', unread: false },
  { title: 'Accessible search patterns', detail: 'Engineering · Keyboard and focus review', unread: true },
  { title: 'Shared photo collection', detail: 'Community · Last week in pictures', unread: false },
  { title: 'A longer project update about design systems and shared workspaces', detail: 'Product team · A longer subject with supporting context', unread: true },
]
const results = computed(() => rows.filter(row => (!unreadOnly.value || row.unread) && `${row.title} ${row.detail}`.toLowerCase().includes(query.value.trim().toLowerCase())))
function choose(title: string, close: MdvSearchSlotProps['close']) {
  query.value = title
  selected.value = `Selected: ${title}`
  void close()
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-3">
      <MdvSelect :model-value="variant" :options="variants" label="Search appearance" @update:model-value="variant = $event as MdvSearchVariant" />
      <MdvSelect :model-value="layout" :options="layouts" label="Search layout" @update:model-value="layout = $event as MdvSearchLayout" />
    </div>
    <div class="rounded-xl bg-mdv-surface-container-low py-6">
      <MdvSearchView v-model="query" v-model:open="open" :variant="variant" :layout="layout" placeholder="Search messages" clear-label="Clear messages query" back-label="Back to messages" :status-text="`${results.length} matching messages`" @search="selected = `Submitted: ${$event || '(all messages)'}`">
        <template #default="{ close }">
          <div class="px-4 pb-2"><MdvCheckbox v-model="unreadOnly" label="Unread only" /></div>
          <MdvList v-if="results.length" :variant="variant === 'contained' ? 'expressive' : 'baseline'">
            <MdvListItem v-for="row in results" :key="row.title" :headline="row.title" :supporting-text="row.detail" interactive @click="choose(row.title, close)"><template #leading><MdvIcon :icon="mailIcon" /></template></MdvListItem>
          </MdvList>
          <p v-else class="p-6 text-sm text-mdv-on-surface-variant">No matching messages. Try “design” or “travel”.</p>
        </template>
      </MdvSearchView>
    </div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ selected }} · Open: {{ open }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Icon triggers and controlled models

Bind the complete `triggerProps` object to one trigger, including its `ref`, click handler, dialog relationship, expanded state, and disabled state. Supply an accessible name on icon-only triggers. Omitting the ref or splitting the bindings across elements breaks anchoring or focus restoration.

Query and open models are independent. Unbound models use internal state. An explicit `:model-value` or `:open` requires the parent to accept updates; rejecting a request leaves the accepted state unchanged. The demo exposes acceptance controls inside the modal so a rejected close can be enabled again without leaving keyboard focus trapped.

<DemoBlock>
  <SearchTriggerDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvIcon, MdvIconButton, MdvSearchView } from '@mdv-ui/mdv'
import searchIcon from '@iconify-icons/material-symbols/search'

const open = ref(false)
const query = ref('')
const acceptOpen = ref(true)
const acceptQuery = ref(true)
const message = ref('No request yet.')
function updateOpen(next: boolean) {
  message.value = `Open requested: ${next}${acceptOpen.value ? '' : ' (rejected)'}`
  if (acceptOpen.value) open.value = next
}
function updateQuery(next: string) {
  message.value = `Query requested: ${JSON.stringify(next)}${acceptQuery.value ? '' : ' (rejected)'}`
  if (acceptQuery.value) query.value = next
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="acceptOpen" label="Accept open requests" />
    <MdvSearchView :open="open" :model-value="query" placeholder="Search with an icon trigger" clear-label="Clear controlled query" back-label="Close controlled search" @update:open="updateOpen" @update:model-value="updateQuery">
      <template #trigger="{ triggerProps }"><MdvIconButton v-bind="triggerProps" variant="tonal" aria-label="Open controlled search"><MdvIcon :icon="searchIcon" /></MdvIconButton></template>
      <template #default="{ close }">
        <div class="grid gap-4 p-5">
          <MdvCheckbox v-model="acceptOpen" label="Accept open requests" />
          <MdvCheckbox v-model="acceptQuery" label="Accept query requests" />
          <p class="break-words text-sm">Accepted query: {{ query || '(empty)' }}</p>
          <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ message }}</p>
          <MdvButton variant="outlined" @click="close()">Request search close</MdvButton>
          <MdvButton variant="text" @click="open = false">Close search directly</MdvButton>
        </div>
      </template>
    </MdvSearchView>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ message }} · Open: {{ open }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Asynchronous closing confirmation

`beforeClose(detail)` can return `false` or resolve to `false` to reject closing. A successful `void`/`true` result allows a model request, which the parent can still reject. Directly assigning `open` bypasses this guard. Use `closed` for animation completion; `close()` resolves to acceptance before the animation necessarily finishes.

This demo suspends a requested close until the reader chooses Keep editing or Discard note. The pending promise is resolved during unmount so leaving the docs page cannot retain an abandoned confirmation. Clearing the query does not invoke the close guard.

<DemoBlock>
  <SearchGuardDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { MdvButton, MdvSearchView, MdvTextField } from '@mdv-ui/mdv'
import type { MdvSearchBeforeClose, MdvSearchCloseDetail } from '@mdv-ui/mdv'

const open = ref(false)
const note = ref('')
const dirty = ref(false)
const pendingReason = ref('')
const message = ref('No close request yet.')
let resolveClose: ((accepted: boolean) => void) | undefined
const beforeClose: MdvSearchBeforeClose = detail => {
  if (!dirty.value) return true
  pendingReason.value = detail.reason
  return new Promise<boolean>(resolve => { resolveClose = resolve })
}
function decide(discard: boolean) {
  if (discard) { note.value = ''; dirty.value = false }
  pendingReason.value = ''
  resolveClose?.(discard)
  resolveClose = undefined
}
function closed(detail: MdvSearchCloseDetail) { message.value = `Closed: ${detail.reason}` }
onBeforeUnmount(() => resolveClose?.(false))
</script>

<template>
  <div class="grid gap-4">
    <MdvSearchView v-model:open="open" placeholder="Search and annotate" clear-label="Clear annotation query" back-label="Leave annotation search" variant="divided" :before-close="beforeClose" @closed="closed">
      <template #default="{ close }">
        <div class="grid gap-4 p-5">
          <MdvTextField :model-value="note" label="Unsaved note" supporting-text="Type a note, then request closing." @update:model-value="note = String($event); dirty = true" />
          <MdvButton variant="outlined" @click="close()">Close annotation search</MdvButton>
          <div v-if="pendingReason" role="alert" class="grid gap-3 rounded-xl bg-mdv-secondary-container p-4 text-mdv-on-secondary-container">
            <p class="text-sm">Discard the unsaved note? Close reason: {{ pendingReason }}</p>
            <div class="flex flex-wrap gap-3"><MdvButton variant="text" @click="decide(false)">Keep editing</MdvButton><MdvButton variant="tonal" @click="decide(true)">Discard note</MdvButton></div>
          </div>
        </div>
      </template>
    </MdvSearchView>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }} · Unsaved: {{ dirty }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Loading, errors, retry, and stale results

`loading` exposes busy state without showing a progress component or disabling input. Render progress, errors, retry controls, results, and empty content yourself. Use a short `status-text` to announce the current outcome rather than reading every result automatically.

The example uses a cancellable simulated request started with Enter, not a real network service. Editing invalidates pending results; late responses cannot overwrite a newer query. It also clears its timer on unmount. Real requests should use equivalent cancellation or request identifiers and an application-chosen debounce policy.

<DemoBlock>
  <SearchAsyncDemo />
  <template #source>

```vue:line-numbers
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
  <MdvSearchView v-model="query" placeholder="Search the catalog" clear-label="Clear catalog query" back-label="Close catalog search" :loading="loading" :status-text="status" @search="search">
    <template #default="{ close }">
      <div class="px-4 pb-2"><MdvCheckbox v-model="failNext" label="Fail the next simulated request" /></div>
      <MdvLinearProgress v-if="loading" indeterminate aria-label="Searching catalog" />
      <div v-else-if="failed" class="grid gap-3 p-5"><p class="text-sm">The simulated service is unavailable.</p><MdvButton variant="tonal" @click="search(query)">Retry search</MdvButton></div>
      <MdvList v-else-if="results.length"><MdvListItem v-for="title in results" :key="title" :headline="title" interactive @click="close()" /></MdvList>
      <p v-else class="p-5 text-sm text-mdv-on-surface-variant">{{ searched ? 'No documents matched. Try “design”.' : 'Press Enter to run a simulated search. Editing cancels stale results.' }}</p>
    </template>
  </MdvSearchView>
</template>
```

  </template>
</DemoBlock>

## Search App Bar and independent content scrolling

Place SearchAppBar in `MdvAppBarScaffold`'s `appbar` slot. It uses a 64px App Bar, and without an explicit `scroll-target` follows the scaffold's content. `enter-always` hides on downward scrolling and reveals on upward scrolling; focus and open search keep the relevant controls available. The example scrolls its own bounded pane.

`leading` and `actions` belong outside the field and receive App Bar state. `search-leading` and `search-trailing` belong inside the field and receive search state. SearchAppBar does not expose the custom `trigger` slot: use SearchView for a standalone icon-trigger experience. Adjacent Standard Navigation Drawer layout follows the ordinary App Bar rules.

<DemoBlock>
  <SearchAppBarDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdvAppBarScaffold, MdvButton, MdvDialog, MdvIcon, MdvIconButton, MdvList, MdvListItem, MdvSearchAppBar } from '@mdv-ui/mdv'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import moreIcon from '@iconify-icons/material-symbols/more-vert'

const query = ref('')
const about = ref(false)
const selected = ref('Inbox')
const subjects = ['Design review', 'Weekend travel', 'Accessibility checklist', 'Project updates']
const results = computed(() => subjects.filter(title => title.toLowerCase().includes(query.value.toLowerCase())))
</script>

<template>
  <div class="grid gap-4">
    <div class="h-[28rem] min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low">
      <MdvAppBarScaffold class="h-full" :content-attrs="{ 'aria-label': 'Search application messages', tabindex: 0 }">
        <template #appbar>
          <MdvSearchAppBar v-model="query" appearance="bordered" scroll-behavior="enter-always" placeholder="Search inbox" clear-label="Clear inbox query" back-label="Back to inbox" :status-text="`${results.length} inbox results`">
            <template #leading><MdvIcon :icon="homeIcon" /></template>
            <template #actions><MdvIconButton variant="standard" aria-label="About search example" @click="about = true"><MdvIcon :icon="moreIcon" /></MdvIconButton></template>
            <template #default="{ close }">
              <MdvList v-if="results.length"><MdvListItem v-for="title in results" :key="title" :headline="title" interactive @click="selected = title; close()" /></MdvList>
              <p v-else class="p-5 text-sm">No matching inbox messages.</p>
            </template>
          </MdvSearchAppBar>
        </template>
        <div class="p-4 text-sm text-mdv-on-surface-variant">Selected: {{ selected }}. Scroll this pane down and then up to reveal the search App Bar.</div>
        <MdvList><MdvListItem v-for="index in 20" :key="index" :headline="subjects[(index - 1) % subjects.length]!" supporting-text="Message preview · The scaffold owns this scroll container." /></MdvList>
      </MdvAppBarScaffold>
    </div>
    <MdvDialog v-model="about" title="Search App Bar" description="The search field belongs to a 64px App Bar. Its scroll target comes from the surrounding scaffold."><template #actions="{ close }"><MdvButton variant="text" @click="close()">Done</MdvButton></template></MdvDialog>
  </div>
</template>
```

  </template>
</DemoBlock>

## Dialog composition, local themes, and RTL

SearchView remains in its component tree while its native dialog enters the top layer. This preserves local theme and direction and supports a search modal inside another MDV dialog. Escape closes the topmost search first and restores focus to its trigger; the enclosing dialog stays open. Give both layers useful names.

Avoid independent overlays inside a `trailing` slot that renders twice. Declare them alongside the search root and use one shared state, as with other MDV overlay compositions.

<DemoBlock>
  <SearchCompositionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvDialog, MdvList, MdvListItem, MdvSearchView } from '@mdv-ui/mdv'

const dark = ref(false)
const rtl = ref(false)
const dialog = ref(false)
const query = ref('')
const selected = ref('No document selected.')
const documents = ['Design system overview', 'Forms and validation', 'Navigation and focus']
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-4"><MdvCheckbox v-model="dark" label="Local dark theme" /><MdvCheckbox v-model="rtl" label="Right to left" /></div>
    <div :data-mdv-theme="dark ? 'dark' : 'light'" :dir="rtl ? 'rtl' : 'ltr'" class="rounded-xl bg-mdv-surface-container-low p-5 text-mdv-on-surface">
      <MdvButton variant="tonal" @click="dialog = true">Choose a document</MdvButton>
      <p role="status" class="mt-4 text-sm">{{ selected }}</p>
      <MdvDialog v-model="dialog" title="Attach a document" description="Open the nested search. Escape closes search first and returns to this dialog.">
        <MdvSearchView v-model="query" placeholder="Search attachments" clear-label="Clear attachment query" back-label="Back to attachment dialog" variant="divided">
          <template #default="{ close }">
            <MdvList><MdvListItem v-for="title in documents.filter(value => value.toLowerCase().includes(query.toLowerCase()))" :key="title" :headline="title" interactive @click="selected = title; close()" /></MdvList>
            <MdvButton class="m-4" variant="text" @click="close()">Close attachment search</MdvButton>
          </template>
        </MdvSearchView>
        <template #actions="{ close }"><MdvButton variant="text" @click="close()">Finish attaching</MdvButton></template>
      </MdvDialog>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Keyboard, IME, accessibility, and input ownership

<DocsTable label="Search keyboard interaction">

| Key or action | Behavior |
| --- | --- |
| Enter in input | Emits `search(query, event)` unless repeated or during IME composition. View focuses its results region without closing. |
| Arrow Down / Arrow Up in input | In View, focuses the first/last available search result, opening the view if needed. |
| Arrow Up / Arrow Down in results | Moves among recognized result actions; Up from the first returns to the input. |
| Home / End on a result | Focuses the first/last recognized result. |
| Tab / Shift+Tab | Follows ordinary controls; an open View contains modal focus. |
| Escape | Requests closing the topmost View when enabled. |
| Clear action | Updates query to empty, emits clear, focuses input, and leaves View open. |

</DocsTable>

MDV recognizes interactive `MdvListItem` primary actions and focusable elements marked `data-mdv-search-result`. Custom results need their own semantic names and native interaction. Nested filters, text inputs, and components with their own keyboard handling keep those interactions. Loading and status do not turn arbitrary content into a combobox or an application menu.

IME draft text is committed after composition ends. Enter used to confirm a composition, repeated Enter, and legacy composition key codes do not submit search. The examples keep their text in English, while the library input supports composed text.

SearchView has an entry input and an expanded input sharing the same query. Use `input-attrs` for `id`, `name`, `form`, `required`, and native input listeners. Only the active input participates in the form, and the supplied ID follows it. Read `inputElement` when needed rather than caching an input that may become inactive. SearchView root attributes belong to its wrapper; SearchAppBar root attributes belong to its App Bar.

The default placeholder, clear label, and back label are Chinese; this page overrides them in English demos. MDV 0.1.5 also fixes its internal results-region label to “搜索建议与结果” without a public override. Localizing that internal accessible name requires a library improvement. Keep `status-text` localized in the application.

MDV supports reduced-motion styling, native dialog focus and document scroll locking. Layout, actual touch input, screen readers, visual viewport changes, SSR/hydration, and browser-specific nested-modal behavior still need application validation. Docked panels have no extra search-specific elevation by default.

## API

### MdvSearchBar

<ApiTable :items="barProps" />

<SlotsTable :items="barSlots" />

### MdvSearchView

Inherits SearchBar's props, with query initially `''`, plus:

<ApiTable :items="viewProps" />

<SlotsTable :items="viewSlots" />

Slot search state is `{ query: string, expanded: boolean, close: () => Promise<boolean>, search: (event?: Event) => void }`. `search()` submits the current query and focuses results; `close()` requests reason `programmatic`. A custom trigger additionally receives `triggerProps` containing `ref`, `aria-haspopup="dialog"`, `aria-controls`, `aria-expanded`, optional `disabled`, and `onClick`.

### MdvSearchAppBar

Inherits all SearchView props, plus:

<ApiTable :items="appBarProps" />

<SlotsTable :items="appBarSlots" />

`scrollTarget` accepts the same type as AppBar. It affects scroll observation, not result positioning. There are no `variant="small"`, title, medium/large expansion, or `exit-until-collapsed` search APIs; `variant` here means contained/divided search appearance.

### Models and events

<DocsTable label="Search events">

| Event | Components | Payload and meaning |
| --- | --- | --- |
| `update:modelValue` | All | `string`: query update request. |
| `update:open` | View / AppBar | `boolean`: expanded-state update request. |
| `search` | Bar | `(query: string, originalEvent: KeyboardEvent)`: Enter submission. |
| `search` | View / AppBar | `(query: string, originalEvent?: Event)`: input or slot submission. |
| `clear` | All | No payload; clear action activated. |
| `open` / `opened` | View / AppBar | Opening accepted / opening animation finished. |
| `close` / `closed` | View / AppBar | `MdvSearchCloseDetail`: closing accepted / closing animation finished. |

</DocsTable>

Close detail is `{ reason: 'back' | 'escape' | 'scrim' | 'programmatic' | 'model' }`. `beforeClose` receives a readonly detail for requested closes. Setting the model directly uses `model` and bypasses the guard; accepted lifecycle events differ from update requests.

### Exposed properties and methods

<DocsTable label="Search exposed API">

| Member | Components | Meaning |
| --- | --- | --- |
| `element` | All | SearchBar/SearchView wrapper; App Bar root for SearchAppBar. |
| `inputElement` | All | Current input, or null while absent. View/AppBar return the active field. |
| `focus(options?: FocusOptions)` | All | Focuses the relevant input, or the custom trigger while collapsed. |
| `blur()` | All | Blurs the relevant input/trigger. |
| `open(): Promise<boolean>` | View / AppBar | Requests opening and reports model acceptance. |
| `close(): Promise<boolean>` | View / AppBar | Requests guarded programmatic closing and reports acceptance. |
| `refresh()` | AppBar | Refreshes App Bar scroll/layout measurements. |

</DocsTable>

These components do not expose custom validity helper methods. Use the active native `inputElement` when native validation methods are needed. Bound query/open state remains controlled even when calling exposed methods.

### Public types

```ts
import type {
  MdvSearchVariant,
  MdvSearchLayout,
  MdvSearchCloseReason,
  MdvSearchCloseDetail,
  MdvSearchBeforeClose,
  MdvSearchBarProps,
  MdvSearchViewProps,
  MdvSearchAppBarProps,
  MdvSearchSlotProps,
  MdvSearchTriggerProps,
  MdvSearchTriggerSlotProps,
} from '@mdv-ui/mdv'
```

`MdvSearchBeforeClose` returns `boolean | void | Promise<boolean | void>`. App Bar slot state and scroll targets use `MdvAppBarSlotProps` and `MdvAppBarScrollTarget`, documented on [App Bar](./app-bar).
