import { cpSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  base: '/advancedwebeingineering_one/',
  plugins: [checker({ typescript: true, enableBuild: false }), {
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
