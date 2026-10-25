import { type ReadResult, readBarcodes } from 'zxing-wasm/reader'

export async function decodeImage(image: Blob): Promise<ReadResult[] | null> {
  const results = await readBarcodes(image, { maxNumberOfSymbols: 255 }).catch(() => null)
  if (results === null || results.some((result) => result.error !== '')) return null
  return results
}

if (import.meta.vitest) {
  const { beforeAll, describe, expect, it } = import.meta.vitest

  const loadWasm = async (specifier: string) => {
    const { readFile } = await import('node:fs/promises')
    return (await readFile(new URL(import.meta.resolve(specifier)))).buffer
  }

  const encode = async (text: string, format: 'QRCode' | 'Code128') => {
    const { writeBarcode } = await import('zxing-wasm/writer')
    const { image } = await writeBarcode(text, { format, scale: 4 })
    if (image === null) throw new Error('failed to encode')
    return image
  }

  beforeAll(async () => {
    const reader = await import('zxing-wasm/reader')
    const writer = await import('zxing-wasm/writer')
    reader.prepareZXingModule({
      overrides: { wasmBinary: await loadWasm('zxing-wasm/reader/zxing_reader.wasm') },
    })
    writer.prepareZXingModule({
      overrides: { wasmBinary: await loadWasm('zxing-wasm/writer/zxing_writer.wasm') },
    })
  })

  describe('decodeImage', () => {
    it('QR コードの読み取り結果をそのまま返す', async () => {
      const image = await encode('https://example.com', 'QRCode')
      expect(await decodeImage(image)).toMatchObject([
        {
          bytes: new TextEncoder().encode('https://example.com'),
          format: 'QRCode',
          isValid: true,
          text: 'https://example.com',
        },
      ])
    })

    it('1 次元バーコードの読み取り結果をそのまま返す', async () => {
      const image = await encode('ABC-123', 'Code128')
      expect(await decodeImage(image)).toMatchObject([
        { format: 'Code128', isValid: true, text: 'ABC-123' },
      ])
    })

    it('画像として読めなければ null を返す', async () => {
      expect(await decodeImage(new Blob(['not an image']))).toBeNull()
    })
  })
}
