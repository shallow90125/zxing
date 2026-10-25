import { createFileRoute } from '@tanstack/solid-router'
import { Show, createMemo, createResource, createSignal, onCleanup, onMount } from 'solid-js'
import { prepareZXingModule } from 'zxing-wasm/reader'
import wasmUrl from 'zxing-wasm/reader/zxing_reader.wasm?url'

import { DecodeResultContent } from '../components/DecodeResultContent'
import { RawResultContent } from '../components/RawResultContent'
import { ViewfinderContent } from '../components/ViewfinderContent'
import { decodeImage } from '../lib/decodeImage'

prepareZXingModule({
  overrides: {
    locateFile: (path, prefix) => (path.endsWith('.wasm') ? wasmUrl : prefix + path),
  },
})

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [image, setImage] = createSignal<File>()
  const [barcodes] = createResource(image, decodeImage)

  const previewUrl = createMemo(() => {
    const file = image()
    if (file === undefined) return undefined
    const url = URL.createObjectURL(file)
    onCleanup(() => URL.revokeObjectURL(url))
    return url
  })

  onMount(() => {
    const onPaste = (event: ClipboardEvent) => {
      const file = Array.from(event.clipboardData?.files ?? []).find((item) =>
        item.type.startsWith('image/')
      )
      if (file !== undefined) setImage(file)
    }
    window.addEventListener('paste', onPaste)
    onCleanup(() => window.removeEventListener('paste', onPaste))
  })

  const settled = () => (barcodes.loading ? undefined : barcodes())

  return (
    <main class='mx-auto grid min-h-dvh max-w-6xl grid-cols-1 content-start gap-x-10 gap-y-8 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:py-14'>
      <header class='border-rule border-b pb-6 lg:col-span-2'>
        <div class='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <h1 class='font-barcode text-ink text-7xl leading-none sm:text-8xl' aria-label='Decode'>
            *DECODE*
          </h1>
          <p class='text-graphite max-w-xs text-sm leading-relaxed sm:pb-3 sm:text-right'>
            Read QR codes and barcodes from any image. Decoding runs in your browser, so the image
            never leaves your device.
          </p>
        </div>
      </header>
      <section class='bg-stock ring-rule hover:ring-ink/30 has-[:focus-visible]:ring-ink relative aspect-[4/3] overflow-hidden rounded-sm ring-1 transition-shadow has-[:focus-visible]:ring-2'>
        <ViewfinderContent previewUrl={previewUrl()} barcodes={settled()} onSelect={setImage} />
      </section>
      <section class='min-w-0'>
        <DecodeResultContent loading={barcodes.loading} barcodes={barcodes()} />
      </section>
      <Show when={settled()}>
        {(results) => (
          <section class='bg-console overflow-hidden rounded-sm lg:col-span-2'>
            <RawResultContent results={results()} />
          </section>
        )}
      </Show>
    </main>
  )
}
