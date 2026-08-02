import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      // Tailwind is compiled at build time (see tailwind.config.js) and bundled
      // into the app CSS — no more runtime cdn.tailwindcss.com dependency.
      css: {
        postcss: {
          plugins: [tailwindcss(), autoprefixer()],
        },
      },
      // NOTE: the Gemini key is intentionally NOT exposed to the client. It lives
      // on the Cloudflare Pages project as a secret and is used only by the
      // server-side functions in functions/api/. Never `define` it into the bundle.
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
