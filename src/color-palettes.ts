import { onScopeDispose, ref, watch, type Ref } from 'vue'
import type { MdvColorScheme } from '@mdv-ui/mdv/dynamic-color'

export const paletteSeeds = {
  default: '#6750a4',
  indigo: '#3f51b5',
  blue: '#1565c0',
  sky: '#0277bd',
  cyan: '#00838f',
  teal: '#00796b',
  emerald: '#007a45',
  green: '#2e7d32',
  lime: '#689f23',
  olive: '#827717',
  amber: '#ed9c00',
  orange: '#e65100',
  terracotta: '#a85130',
  brown: '#795548',
  red: '#c62828',
  rose: '#9c4057',
  pink: '#ad1457',
  purple: '#7b1fa2',
  blueGray: '#546e7a',
  slate: '#414952',
} as const

export type PaletteId = keyof typeof paletteSeeds
export const paletteIds = Object.keys(paletteSeeds) as PaletteId[]

const storageKey = 'mdv-docs-palette'

function readPalette(): PaletteId {
  try {
    const saved = window.localStorage.getItem(storageKey)
    if (saved && Object.hasOwn(paletteSeeds, saved)) return saved as PaletteId
  } catch {
    // Storage can be unavailable in restricted contexts.
  }
  return 'default'
}

export function usePalette(scope: Readonly<Ref<HTMLElement | null>>) {
  const palette = ref(readPalette())
  const schemes = new Map<PaletteId, MdvColorScheme>()
  let colorTools: typeof import('@mdv-ui/mdv/dynamic-color') | undefined
  let restorePalette: (() => void) | undefined

  function selectPalette(id: PaletteId) {
    palette.value = id
    try {
      window.localStorage.setItem(storageKey, id)
    } catch {
      // Palette switching still works without storage.
    }
  }

  function clearPalette() {
    restorePalette?.()
    restorePalette = undefined
  }
  onScopeDispose(clearPalette)

  watch([scope, palette], ([target, id], _, onCleanup) => {
    if (!target || id === 'default') {
      clearPalette()
      return
    }

    let active = true
    onCleanup(() => {
      active = false
    })

    function apply(tools: NonNullable<typeof colorTools>, element: HTMLElement) {
      if (!active) return
      let scheme = schemes.get(id)
      if (!scheme) {
        scheme = tools.createMdvColorScheme(paletteSeeds[id])
        schemes.set(id, scheme)
      }
      // MDV keeps the newest application active, so retiring the previous one never resets the scope.
      const restorePrevious = restorePalette
      restorePalette = tools.applyMdvColorScheme(element, scheme)
      restorePrevious?.()
    }

    // The default palette does not need the color engine on first load.
    if (colorTools) apply(colorTools, target)
    else void import('@mdv-ui/mdv/dynamic-color').then((tools) => {
      colorTools = tools
      apply(tools, target)
    }, () => {
      if (active) selectPalette('default')
    })
  }, { immediate: true, flush: 'post' })

  return { palette, selectPalette }
}
