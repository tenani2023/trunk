// @ts-check
import { defineConfig } from 'astro/config';

// Demo build: no `site` is set on purpose. Setting the production origin is part of
// the go-live checklist (see CONTENT_GUIDE.md), together with removing noindex.
export default defineConfig({
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'always',
  },
  image: {
    // Responsive images: Astro generates srcset/sizes and intrinsic aspect ratios.
    layout: 'constrained',
    responsiveStyles: true,
    objectFit: 'cover',
    objectPosition: 'center',
  },
  devToolbar: { enabled: false },
  vite: {
    // 外出先からの確認用 Cloudflare Quick Tunnel（*.trycloudflare.com）を preview で受け付ける。
    preview: { allowedHosts: ['.trycloudflare.com'] },
  },
});
