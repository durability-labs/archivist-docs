// Terminal Aesthetic Theme for Archivist Docs
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { nextTick, onMounted, onUnmounted } from 'vue'
import Layout from './Layout.vue'
import './custom.css'

type SvgPanZoomInstance = { destroy(): void; resize(): void; fit(): void; center(): void }
const instances = new Map<SVGSVGElement, SvgPanZoomInstance>()

/**
 * Mermaid renders SVGs without a viewBox — just inline max-width and overflow.
 * svg-pan-zoom needs a viewBox AND explicit pixel dimensions to compute fit
 * correctly (percentage widths break its internal calculations).
 *
 * Steps:
 * 1. Read each SVG's inner bounding box and set a proper viewBox
 * 2. Compute pixel height from the container width × aspect ratio
 * 3. Set explicit width/height in pixels on the SVG
 * 4. Mount svg-pan-zoom with fit+center so diagrams show at full size
 *    with zoom/pan controls available
 */
function fixViewBox(svg: SVGSVGElement): boolean {
  if (svg.dataset.viewboxFixed) return false

  const g = svg.querySelector('g')
  if (!g) return false

  const bbox = g.getBBox()
  const pad = 8
  const vbX = bbox.x - pad
  const vbY = bbox.y - pad
  const vbW = bbox.width + pad * 2
  const vbH = bbox.height + pad * 2

  svg.setAttribute('viewBox', `${vbX} ${vbY} ${vbW} ${vbH}`)

  // Get the container's actual pixel width
  const container = svg.parentElement
  if (!container) return false
  const availableWidth = container.clientWidth - 32 // subtract padding
  const maxHeight = 500 // cap height for uniformity

  // Fit within both width and height constraints
  const aspectRatio = vbH / vbW
  let pixelWidth = availableWidth
  let pixelHeight = Math.round(availableWidth * aspectRatio)

  // If height exceeds cap, constrain by height instead
  if (pixelHeight > maxHeight) {
    pixelHeight = maxHeight
    pixelWidth = Math.round(maxHeight / aspectRatio)
  }

  svg.setAttribute('width', `${pixelWidth}`)
  svg.setAttribute('height', `${pixelHeight}`)
  svg.style.maxWidth = ''
  svg.style.overflow = ''

  svg.dataset.viewboxFixed = '1'
  return true
}

async function mountPanZoom() {
  const { default: svgPanZoom } = await import('svg-pan-zoom')
  const svgs = document.querySelectorAll<SVGSVGElement>('.vp-doc .mermaid svg')

  svgs.forEach((svg) => {
    // Always fix viewBox first (idempotent via dataset flag)
    fixViewBox(svg)

    if (instances.has(svg)) return

    const instance = svgPanZoom(svg, {
      zoomEnabled: true,
      panEnabled: true,
      controlIconsEnabled: true,
      mouseWheelZoomEnabled: true,
      dblClickZoomEnabled: false,
      fit: true,
      center: true,
      minZoom: 0.5,
      maxZoom: 20,
    })

    instances.set(svg, instance)
  })

  // Clean up detached SVGs
  for (const [svg, instance] of instances) {
    if (!svg.isConnected) {
      instance.destroy()
      instances.delete(svg)
    }
  }
}

const theme: Theme = {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app }) {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark')
    }
  },
  setup() {
    let observer: MutationObserver | undefined

    onMounted(async () => {
      await nextTick()
      setTimeout(mountPanZoom, 500)

      observer = new MutationObserver(() => {
        mountPanZoom()
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    })

    onUnmounted(() => {
      observer?.disconnect()
      for (const [, instance] of instances) instance.destroy()
      instances.clear()
    })
  },
}

export default theme
