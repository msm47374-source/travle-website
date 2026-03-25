// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.cleaningcompanydenver.com',
  output: 'static',
  adapter: netlify(),
  integrations: [sitemap()],
  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'astro/entrypoints/prerender': fileURLToPath(new URL('./node_modules/astro/dist/entrypoints/prerender.js', import.meta.url)),
      },
    },
  },
});
