import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import solidPlugin from 'vite-plugin-solid';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    solidPlugin(),
    crx({ manifest }),
  ],
  build: {
    rollupOptions: {
      input: {
        background: 'src/background.ts',
      },
    },
  },
});
