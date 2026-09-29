// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Deploy target is Vercel/Node (not the Lovable-default Cloudflare Workers),
  // since our server routes use the MongoDB driver and pdfkit (both need Node APIs).
  nitro: {
    preset: "vercel",
    // public/ is deployed as static CDN output, not copied into the function
    // bundle, so the invoice PDF font must be bundled as a server asset instead.
    // `serverAssets` is a valid nitro option, just missing from Lovable's
    // intentionally narrow published type (see its `nitro` option doc comment).
    serverAssets: [{ baseName: "fonts", dir: "./public/fonts" }],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
});
