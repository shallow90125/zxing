import { Show, createSignal } from 'solid-js'
import type { ReadResult } from 'zxing-wasm/reader'

import { toPrettyJson } from '../lib/toPrettyJson'

type Props = {
  results: ReadResult[]
}

export function RawResultContent(props: Props) {
  const [copied, setCopied] = createSignal(false)
  const json = () => toPrettyJson(props.results)

  return (
    <div class='flex size-full flex-col'>
      <div class='flex items-center justify-between gap-2 border-b border-white/10 py-1.5 pr-2 pl-4'>
        <h2 class='text-console-text/60 font-mono text-[11px] tracking-[0.2em] uppercase'>
          Raw result <span class='text-console-text/30'>·</span> JSON
        </h2>
        <button
          type='button'
          aria-label={copied() ? 'Copied' : 'Copy JSON'}
          title={copied() ? 'Copied' : 'Copy JSON'}
          class='text-console-text/60 grid size-8 place-items-center rounded transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none'
          onClick={() => {
            void navigator.clipboard.writeText(json()).then(() => {
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
      </div>
      <pre class='text-console-text max-h-[28rem] overflow-auto p-4 font-mono text-[11.5px] leading-relaxed'>
        {json()}
      </pre>
    </div>
  )
}
