const typescript = require('rollup-plugin-typescript2');
const dts = require('rollup-plugin-dts').default;

const onwarn = (warning, warn) => {
  // Suppress circular dependency warnings for now
  if (warning.code === 'CIRCULAR_DEPENDENCY') return;
  warn(warning);
};

module.exports = [
  // JavaScript bundles (UMD + ESM)
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/querychips.js',
        format: 'umd',
        name: 'QueryChips',
        sourcemap: true,
        globals: {},
        exports: 'named',
      },
      {
        file: 'dist/querychips.mjs',
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        clean: true,
        // Type declarations are produced by the dedicated dts bundle below.
        tsconfigOverride: {
          compilerOptions: { declaration: false, declarationMap: false },
        },
        exclude: ['**/__tests__/**', '**/*.test.ts', '**/*.spec.ts'],
      }),
    ],
    external: [],
    onwarn,
  },
  // Bundled type declarations
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/querychips.d.ts', format: 'es' }],
    plugins: [dts()],
    onwarn,
  },
];
