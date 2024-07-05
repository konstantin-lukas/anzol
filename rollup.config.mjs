import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import dts from 'rollup-plugin-dts';
import del from "rollup-plugin-delete";

export default [{
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.cjs.js',
            format: 'cjs',
            sourcemap: true
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm',
            sourcemap: true
        },
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        typescript({ tsconfig: './tsconfig.json' }),
        terser(),
        copy({
            targets: [
                { src: 'package.json', dest: 'dist' },
                { src: 'LICENSE', dest: 'dist' }
            ],
        })
    ],
    external: ['react', 'react-dom'],
}, {
    input: './dist/dts/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [
        dts(),
        del({ hook: "buildEnd", targets: "./dist/dts" })
    ]
}];
