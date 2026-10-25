import type { Position } from 'zxing-wasm/reader'

export function toPolygonPoints(position: Position): string {
  return [position.topLeft, position.topRight, position.bottomRight, position.bottomLeft]
    .map(({ x, y }) => `${x},${y}`)
    .join(' ')
}

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest

  describe('toPolygonPoints', () => {
    it('四隅を時計回りに並べた points 文字列を返す', () => {
      expect(
        toPolygonPoints({
          bottomLeft: { x: 10, y: 90 },
          bottomRight: { x: 90, y: 90 },
          topLeft: { x: 10, y: 10 },
          topRight: { x: 90, y: 10 },
        })
      ).toBe('10,10 90,10 90,90 10,90')
    })
  })
}
