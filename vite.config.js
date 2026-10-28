import { cpSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  base: '/',
  // React owns the SPA fallback; preserve both explicit HTML entry points.
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        react: resolve(import.meta.dirname, 'react.html'),
        vanilla: resolve(import.meta.dirname, 'vanilla.html'),
      },
    },
  },
  plugins: [
    checker({ typescript: true, enableBuild: false }),
    {
      name: 'copy-runtime-files',
      apply: 'build',
      writeBundle({ dir }) {
        // GitHub Pages uses this React shell for direct SPA route requests.
        copyFileSync(resolve(dir, 'index.html'), resolve(dir, '404.html'));
        // Runtime fetch URLs are not imports, so keep their existing paths in dist.
        for (const directory of ['data', 'assets']) {
          cpSync(
            resolve(import.meta.dirname, directory),
            resolve(dir, directory),
            {
              recursive: true,
            },
          );
        }
      },
    },
  ],
});
