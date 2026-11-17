// Adapted from MDV tabs-indicator.ts for local documentation code tabs.
/*
 * The independent offset/width springs are adapted from m3ui-vue MTabs.
 * Copyright (c) 2026 Fadel. MIT; see THIRD_PARTY_NOTICES.md.
 */

export interface TabsIndicatorRect {
  left: number
  width: number
}

/** 在条目轨道内计算物理坐标；滚动和 RTL 不改变与内容的相对位置。 */
export function measureTabsIndicator(
  row: HTMLElement,
  tab: HTMLElement,
  content: HTMLElement,
  primary: boolean,
): TabsIndicatorRect | null {
  const rowRect = row.getBoundingClientRect()
  const tabRect = tab.getBoundingClientRect()
  if (rowRect.width <= 0 || tabRect.width <= 0) return null
  if (!primary) return { left: tabRect.left - rowRect.left, width: tabRect.width }
  const contentRect = content.getBoundingClientRect()
  if (contentRect.width <= 0) return null
  const width = Math.min(tabRect.width, Math.max(24, contentRect.width - 4))
  const center = contentRect.left - rowRect.left + contentRect.width / 2
  const tabLeft = tabRect.left - rowRect.left
  return {
    left: Math.max(tabLeft, Math.min(tabLeft + tabRect.width - width, center - width / 2)),
    width,
  }
}

/** 与 Vue 渲染分离；位置和宽度分别保留速度，连续切换不重启动画。 */
export function createTabsIndicator(options: {
  element: () => HTMLElement | null
  row: () => HTMLElement | null
}) {
  let position: TabsIndicatorRect | null = null
  let target: TabsIndicatorRect | null = null
  let velocity: TabsIndicatorRect = { left: 0, width: 0 }
  let frame: number | undefined
  let view: Window | null = null
  let lastTime = 0

  function write() {
    const element = options.element()
    const row = options.row()
    if (!element || !row) return
    if (element.hidden !== !position) element.hidden = !position
    row.toggleAttribute('data-docs-indicator-ready', !!position)
    if (!position) return
    element.style.transform = `translateX(${position.left}px)`
    element.style.width = `${Math.max(0, position.width)}px`
  }

  function stop() {
    if (frame !== undefined) view?.cancelAnimationFrame(frame)
    frame = undefined
  }

  function finish() {
    stop()
    position = target ? { ...target } : null
    velocity = { left: 0, width: 0 }
    write()
  }

  function tick(now: number) {
    frame = undefined
    if (!position || !target) return
    const dt = Math.max(0, Math.min((now - lastTime) / 1000, 1 / 30))
    lastTime = now
    // 小步积分避免低帧率时高刚度弹簧发散。
    const steps = Math.max(1, Math.ceil(dt * 240))
    const step = dt / steps
    const damping = 2 * 0.9 * Math.sqrt(700)
    for (let index = 0; index < steps; index++) {
      for (const key of ['left', 'width'] as const) {
        velocity[key] += (-700 * (position[key] - target[key]) - damping * velocity[key]) * step
        position[key] += velocity[key] * step
      }
    }
    write()
    if (
      Math.abs(position.left - target.left) < 0.05 &&
      Math.abs(position.width - target.width) < 0.05 &&
      Math.abs(velocity.left) < 0.1 &&
      Math.abs(velocity.width) < 0.1
    ) {
      finish()
      return
    }
    frame = view?.requestAnimationFrame(tick)
  }

  function moveTo(rect: TabsIndicatorRect | null, animate: boolean) {
    view = options.element()?.ownerDocument.defaultView ?? null
    const same = target?.left === rect?.left && target?.width === rect?.width
    target = rect ? { ...rect } : null
    if (!rect) {
      finish()
      return
    }
    const reduced = view?.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!position || !animate || reduced || !view?.requestAnimationFrame) {
      // 同一目标的普通重渲染不取消正在进行的选择动画。
      if (!same || reduced || !position) finish()
      return
    }
    if (same) return
    if (frame === undefined) {
      lastTime = view.performance.now()
      frame = view.requestAnimationFrame(tick)
    }
  }

  function reset() {
    stop()
    position = null
    target = null
    velocity = { left: 0, width: 0 }
    write()
  }

  return { moveTo, finish, reset }
}
