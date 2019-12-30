// Rollup plugins
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import license from 'rollup-plugin-license';
import { minify } from 'uglify-es';

import pkjson from './package.json';

const banner = `/*!
* Agile v${pkjson.version}
* https://github.com/drawcall/Agile
*
* Copyright 2012-${new Date().getFullYear()}, A-JIE
* Licensed under the MIT license
* http://www.opensource.org/licenses/mit-license
*
*/`;

const isDev = process.argv.splice(2).indexOf('--pub') < 0;
const plugins = isDev ?
    [
        babel({
            exclude: 'node_modules/**',
        })
    ] : [
        babel({
            exclude: 'node_modules/**',
        }),
        uglify({}, minify),
        license({ banner: banner })
    ];

const output = isDev ? { file: 'build/agile.js' } : { file: 'build/agile.min.js' };


export default {
    input: 'src/index.js',
    output: {
        ...output,
        format: 'umd',
        name: 'Agile',
        sourcemap: true,
    },
    plugins: plugins
};