export function toPrettyJson(items: object[]): string {
  if (items.length === 0) return '[]'
  const objects = items.map((item) => {
    const fields = Object.entries(item).flatMap(([key, value]: [string, unknown]) => {
      const json: string | undefined = JSON.stringify(value, (_key, inner: unknown) =>
        inner instanceof Uint8Array || inner instanceof Uint8ClampedArray
          ? Array.from(inner)
          : inner
      )
      return json === undefined ? [] : [`    ${JSON.stringify(key)}: ${json}`]
    })
    return fields.length === 0 ? '  {}' : `  {\n${fields.join(',\n')}\n  }`
  })
  return `[\n${objects.join(',\n')}\n]`
}

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest

  describe('toPrettyJson', () => {
    it('要素直下のフィールドだけを改行し、値は 1 行で出力する', () => {
      expect(toPrettyJson([{ a: 1, b: { c: [1, 2] } }])).toBe(
        '[\n  {\n    "a": 1,\n    "b": {"c":[1,2]}\n  }\n]'
      )
    })

    it('Uint8Array を数値の配列として出力する', () => {
      expect(toPrettyJson([{ bytes: new Uint8Array([104, 105]) }])).toBe(
        '[\n  {\n    "bytes": [104,105]\n  }\n]'
      )
    })

    it('ネストした Uint8ClampedArray も数値の配列として出力する', () => {
      expect(toPrettyJson([{ symbol: { data: new Uint8ClampedArray([0, 255]) } }])).toBe(
        '[\n  {\n    "symbol": {"data":[0,255]}\n  }\n]'
      )
    })

    it('複数の要素をカンマで区切る', () => {
      expect(toPrettyJson([{ a: 1 }, { a: 2 }])).toBe(
        '[\n  {\n    "a": 1\n  },\n  {\n    "a": 2\n  }\n]'
      )
    })

    it('値が undefined のフィールドは出力しない', () => {
      expect(toPrettyJson([{ a: undefined, b: 1 }])).toBe('[\n  {\n    "b": 1\n  }\n]')
    })

    it('空の要素は {} として出力する', () => {
      expect(toPrettyJson([{}])).toBe('[\n  {}\n]')
    })

    it('空配列は [] を返す', () => {
      expect(toPrettyJson([])).toBe('[]')
    })

    it('出力は JSON として解釈できる', () => {
      const items = [{ a: 'x', b: [1, { c: null }] }]
      expect(JSON.parse(toPrettyJson(items))).toEqual(items)
    })
  })
}
