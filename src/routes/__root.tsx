import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/solid-router'
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools'
import { Suspense } from 'solid-js'
import { HydrationScript } from 'solid-js/web'

import styleCss from '../styles.css?url'

export const Route = createRootRouteWithContext()({
  head: () => ({
    links: [
      { href: 'https://fonts.googleapis.com', rel: 'preconnect' },
      { crossOrigin: 'anonymous', href: 'https://fonts.gstatic.com', rel: 'preconnect' },
      {
        href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Libre+Barcode+39+Text&family=Martian+Mono:wght@400;500&display=swap',
        rel: 'stylesheet',
      },
      { href: styleCss, rel: 'stylesheet' },
    ],
    meta: [
      { charSet: 'utf-8' },
      { content: 'width=device-width, initial-scale=1', name: 'viewport' },
      { title: 'Decode · Barcode & QR reader' },
      {
        content: 'Read QR codes and barcodes from an image, right in your browser.',
        name: 'description',
      },
    ],
  }),
  shellComponent: RootComponent,
})

function RootComponent() {
  return (
    <html lang='en'>
      <head>
        <HydrationScript />
        <HeadContent />
      </head>
      <body class='bg-paper text-ink font-sans antialiased'>
        <Suspense>
          <Outlet />
          <TanStackRouterDevtools />
        </Suspense>
        <Scripts />
      </body>
    </html>
  )
}
