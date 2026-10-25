import { For, Match, Show, Switch, createSignal } from 'solid-js'
import type { ReadResult } from 'zxing-wasm/reader'

type Props = {
  loading: boolean
  barcodes: ReadResult[] | null | undefined
}

export function DecodeResultContent(props: Props) {
  return (
    <div class='flex size-full flex-col'>
      <div class='border-ink flex items-baseline justify-between border-b pb-2'>
        <h2 class='text-ink font-mono text-[11px] tracking-[0.2em] uppercase'>Results</h2>
        <Show when={!props.loading && props.barcodes}>
          {(barcodes) => (
            <span class='text-graphite font-mono text-[11px]'>
              {barcodes().length === 1 ? '1 code' : `${barcodes().length} codes`}
            </span>
          )}
        </Show>
      </div>
      <Switch>
        <Match when={props.loading}>
          <p class='text-graphite py-6 font-mono text-xs tracking-wider'>Reading…</p>
        </Match>
        <Match when={props.barcodes === undefined}>
          <p class='text-graphite py-6 text-sm'>Results appear here once you add an image.</p>
        </Match>
        <Match when={props.barcodes === null}>
          <p class='text-laser py-6 text-sm'>
            Couldn’t read this file. Use a PNG, JPEG, GIF, or BMP image.
          </p>
        </Match>
        <Match when={props.barcodes?.length === 0}>
          <p class='text-graphite py-6 text-sm'>
            No barcode found. Try a sharper image or crop closer to the code.
          </p>
        </Match>
        <Match when={props.barcodes}>
          {(barcodes) => (
            <ol class='flex flex-col'>
              <For each={barcodes()}>
                {(barcode, index) => (
                  <li class='animate-reveal border-rule flex flex-col gap-2 border-b py-4'>
                    <div class='flex items-center justify-between gap-3'>
                      <div class='flex items-center gap-2.5'>
                        <span class='bg-laser grid size-5 place-items-center rounded-full font-mono text-[10px] text-white'>
                          {index() + 1}
                        </span>
                        <span class='text-graphite font-mono text-[11px] tracking-wider uppercase'>
                          {barcode.format}
                        </span>
                      </div>
                      <CopyTextButton text={barcode.text} />
                    </div>
                    <p class='text-ink font-mono text-sm leading-relaxed break-all whitespace-pre-wrap'>
                      {barcode.text}
                    </p>
                  </li>
                )}
              </For>
            </ol>
          )}
        </Match>
      </Switch>
    </div>
  )
}

function CopyTextButton(props: { text: string }) {
  const [copied, setCopied] = createSignal(false)

  return (
    <button
      type='button'
      aria-label={copied() ? 'Copied' : 'Copy text'}
      title={copied() ? 'Copied' : 'Copy text'}
      class='text-graphite hover:bg-ink/5 hover:text-ink focus-visible:ring-ink grid size-8 shrink-0 place-items-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none'
      onClick={() => {
        void navigator.clipboard.writeText(props.text).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        })
      }}
    >
      <Show
        when={copied()}
        fallback={
          <svg
            viewBox='0 0 24 24'
            class='size-4'
            fill='none'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
            aria-hidden='true'
          >
            <rect x='9' y='9' width='13' height='13' rx='2' />
            <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' />
          </svg>
        }
      >
        <svg
          viewBox='0 0 24 24'
          class='text-laser size-4'
          fill='none'
          stroke='currentColor'
          stroke-width='2.5'
          stroke-linecap='round'
          stroke-linejoin='round'
          aria-hidden='true'
        >
          <path d='M20 6 9 17l-5-5' />
        </svg>
      </Show>
    </button>
  )
}
