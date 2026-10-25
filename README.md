# Decode

Read QR codes and barcodes from an image, right in your browser.

**Live:** https://zxing.shallow90125.workers.dev

Decode runs [zxing-cpp](https://github.com/zxing-cpp/zxing-cpp) compiled to WebAssembly (via [zxing-wasm](https://github.com/Sec-ant/zxing-wasm)) on the client. Images are never uploaded anywhere.

## Features

- Drop an image, paste it from the clipboard, or pick a file
- Detects multiple barcodes in a single image and outlines each one on the preview
- Supports the formats zxing-cpp can read, including QR Code, Micro QR Code, Data Matrix, Aztec, PDF417, EAN/UPC, Code 128 and Code 39
- Copy the decoded text, or the full raw result as JSON

## Tech stack

- [SolidJS](https://www.solidjs.com/) + [TanStack Start](https://tanstack.com/start) (SPA mode)
- [Tailwind CSS](https://tailwindcss.com/)
- [zxing-wasm](https://github.com/Sec-ant/zxing-wasm)
- [Vite+](https://viteplus.dev/) toolchain
- Hosted on [Cloudflare Workers](https://workers.cloudflare.com/)

## Development

```bash
vp install
vp run dev
```

The dev server starts at http://localhost:3000.

```bash
vp check
vp test
```

## Deployment

```bash
vp run deploy
```

This builds the app and deploys it with Wrangler. Run `wrangler login` first if you are not authenticated.

## Third-party licenses

The licenses of third-party software shipped to the browser are listed in [`public/THIRD_PARTY_LICENSES.txt`](public/THIRD_PARTY_LICENSES.txt), which is also served at [/THIRD_PARTY_LICENSES.txt](https://zxing.shallow90125.workers.dev/THIRD_PARTY_LICENSES.txt).
