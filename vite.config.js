import { cpSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [{
    name: 'copy-runtime-files',
    apply: 'build',
    writeBundle({ dir }) {
      // Runtime fetch URLs are not imports, so keep their existing paths in dist.
      for (const directory of ['data', 'assets']) {
        cpSync(resolve(import.meta.dirname, directory), resolve(dir, directory), {
          recursive: true
        });
      }
    }
  }]
});
