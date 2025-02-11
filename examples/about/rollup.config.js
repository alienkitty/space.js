import resolve from '@rollup/plugin-node-resolve';
import { terser, timestamp } from 'rollup-plugin-bundleutils';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  preserveEntrySignatures: 'allow-extension',
  treeshake: {
    // Needed for OimoPhysics
    correctVarValueBeforeDeclaration: true
  },
  output: {
    dir: 'public/assets/js',
    entryFileNames: 'loader.js',
    chunkFileNames: ({ name }) => `${name.toLowerCase()}.js`,
    format: 'es',
    minifyInternalExports: false
  },
  plugins: [
    resolve({
      browser: true
    }),
    production && terser({
      // Keep class and function names when using `Thread` from Space.js
      keep_classnames: true,
      keep_fnames: true,
      output: {
        preamble: `// ${timestamp()}`
      }
    })
  ]
};
