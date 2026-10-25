import { For, Show, createSignal } from 'solid-js'
import type { ReadResult } from 'zxing-wasm/reader'

import { toPolygonPoints } from '../lib/toPolygonPoints'

type Props = {
  previewUrl: string | undefined
  barcodes: ReadResult[] | null | undefined
  onSelect: (image: File) => void
}

export function ViewfinderContent(props: Props) {
  const [dragging, setDragging] = createSignal(false)

  const selectFirstImage = (files: FileList | null | undefined) => {
    const image = Array.from(files ?? []).find((file) => file.type.startsWith('image/'))
    if (image !== undefined) props.onSelect(image)
  }

  return (
    <label
      class='group relative flex size-full cursor-pointer items-center justify-center p-8'
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        selectFirstImage(event.dataTransfer?.files)
      }}
    >
      <input
        type='file'
        accept='image/*'
        class='peer sr-only'
        onChange={(event) => {
          selectFirstImage(event.currentTarget.files)
          event.currentTarget.value = ''
        }}
      />
      <span class='border-ink pointer-events-none absolute top-4 left-4 size-6 border-t-2 border-l-2' />
      <span class='border-ink pointer-events-none absolute top-4 right-4 size-6 border-t-2 border-r-2' />
      <span class='border-ink pointer-events-none absolute bottom-4 left-4 size-6 border-b-2 border-l-2' />
      <span class='border-ink pointer-events-none absolute right-4 bottom-4 size-6 border-r-2 border-b-2' />
      <Show
        when={props.previewUrl}
        keyed
        fallback={
          <>
            <div class='pointer-events-none absolute inset-x-8 inset-y-8'>
              <div class='bg-laser/70 shadow-laser/40 motion-safe:animate-sweep-idle absolute inset-x-0 h-px shadow-[0_0_12px_2px]' />
            </div>
            <div class='flex flex-col items-center gap-3 text-center'>
              <p class='text-ink text-2xl font-medium tracking-tight'>Drop an image here</p>
              <p class='text-graphite text-sm'>or paste it, or click to choose a file</p>
              <p class='text-graphite mt-2 font-mono text-[10px] tracking-[0.2em] uppercase'>
                PNG · JPEG · GIF · BMP
              </p>
            </div>
          </>
        }
      >
        {(url) => <PreviewLayer url={url} barcodes={props.barcodes} />}
      </Show>
      <Show when={dragging()}>
        <div class='bg-laser/5 ring-laser pointer-events-none absolute inset-0 ring-2 ring-inset' />
      </Show>
    </label>
  )
}

function PreviewLayer(props: { url: string; barcodes: ReadResult[] | null | undefined }) {
  const [naturalSize, setNaturalSize] = createSignal<{ width: number; height: number }>()
  const markerRadius = () => Math.max((naturalSize()?.width ?? 0) * 0.028, 8)

  return (
    <div class='pointer-events-none absolute inset-8'>
      <img
        src={props.url}
        alt='Selected image'
        class='size-full object-contain'
        onLoad={(event) =>
          setNaturalSize({
            height: event.currentTarget.naturalHeight,
            width: event.currentTarget.naturalWidth,
          })
        }
      />
      <Show when={naturalSize()}>
        {(size) => (
          <svg
            class='absolute inset-0 size-full'
            viewBox={`0 0 ${size().width} ${size().height}`}
            preserveAspectRatio='xMidYMid meet'
            aria-hidden='true'
          >
            <For each={props.barcodes ?? []}>
              {(barcode, index) => (
                <g class='animate-reveal'>
                  <polygon
                    points={toPolygonPoints(barcode.position)}
                    class='fill-laser/10 stroke-laser'
                    stroke-width='2.5'
                    stroke-linejoin='round'
                    vector-effect='non-scaling-stroke'
                  />
                  <circle
                    cx={barcode.position.topLeft.x}
                    cy={barcode.position.topLeft.y}
                    r={markerRadius()}
                    class='fill-laser'
                  />
                  <text
                    x={barcode.position.topLeft.x}
                    y={barcode.position.topLeft.y}
                    font-size={String(markerRadius() * 1.1)}
                    text-anchor='middle'
                    dominant-baseline='central'
                    class='fill-white font-mono'
                  >
                    {index() + 1}
                  </text>
                </g>
              )}
            </For>
          </svg>
        )}
      </Show>
      <div class='bg-laser shadow-laser/50 motion-safe:animate-sweep-once absolute inset-x-0 top-0 h-0.5 opacity-0 shadow-[0_0_16px_3px]' />
    </div>
  )
}
