import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/date13.js',
      format: 'iife',
      name: 'Date13',
      sourcemap: true,
      plugins: [terser()]
    },
    {
      file: 'dist/date13.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/date13.cjs',
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json'
    })
  ]
};