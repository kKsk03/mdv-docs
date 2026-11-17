import { Blob } from 'node:buffer'
import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach, beforeEach, vi } from 'vitest'

let reducedMotion = false
let motionQuery: MediaQueryList

beforeEach(() => {
  reducedMotion = false
  motionQuery = Object.assign(new EventTarget(), {
    matches: false,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addListener() {},
    removeListener() {},
  })
  Object.defineProperty(motionQuery, 'matches', { get: () => reducedMotion })
  vi.stubGlobal('matchMedia', vi.fn(() => motionQuery))
  // Build-time Shiki needs Blob.stream(), which jsdom does not implement.
  vi.stubGlobal('Blob', Blob)
})

enableAutoUnmount(afterEach)

afterEach(() => {
  vi.useRealTimers()
  document.body.replaceChildren()
})

export function setReducedMotion(value: boolean) {
  reducedMotion = value
  motionQuery.dispatchEvent(new Event('change'))
}
