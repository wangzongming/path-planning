// import babel from 'rollup-plugin-babel' 
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import svgr from '@svgr/rollup'
import image from '@rollup/plugin-image';
// import typescript2 from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
// const fs = require('fs');
// const path = require('path');
// delete old typings to avoid issues
// require('fs').unlink('index.d.ts', (err) => {});

const production = !process.env.ROLLUP_WATCH;
export default {
    input: 'src/index.js',
    output: [
        {
            // file: 'index.cjs.js',
            dir: "dist/cjs",
            format: 'cjs',
            sourcemap: false,
            exports: 'named',
        },
        {
            // file: 'index.es.js',
            dir: "dist/es",
            format: 'es',
            sourcemap: false,
            exports: 'named',
        }
    ],
    external: [
        "antd",
        "react",
        "react-dom",
        "react-router-dom",
    ],
    moduleContext: (id) => {
        return "window"
    },
    plugins: [
        resolve(),
        // typescript2({}),
        external(),
        image(),
        url(),
        svgr({
            // babel: false,
            // icon: true,
            // native: true
        }),
        postcss({
            modules: true,
            plugins: [
                require("postcss-preset-env")({
                    autoprefixer: {
                        flexbox: "no-2009"
                    },
                    browsers: [
                        ">0.15%",
                        "last 4 versions",
                        "Firefox ESR",
                        "not ie < 9", // React doesn't support IE8 anyway
                        "last 3 iOS versions",
                        "iOS 7",
                        "iOS >= 7"
                    ],
                    stage: 3
                })
            ]
        }),
        babel({
            babelrc: false,
            exclude: 'node_modules/**',
            babelHelpers: "bundled",
            presets: [

                [
                    "@babel/preset-env",
                    {
                        modules: false,
                        corejs: 3,
                        useBuiltIns: 'usage',
                        targets: {
                            browsers: [
                                "last 2 versions",
                                "iOS >= 7",
                                "Android >= 5"
                            ]
                        }
                    }
                ],
                "@babel/preset-react"
            ],
            plugins: [

                [
                    "babel-plugin-named-asset-import",
                    {
                        loaderMap: {
                            svg: {
                                ReactComponent:
                                    "@svgr/webpack?-svgo![path]"
                            }
                        }
                    }
                ],
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/plugin-syntax-dynamic-import",
                [
                    "@babel/plugin-proposal-class-properties",
                    {
                        "loose": true
                    }
                ],
                "react-loadable/babel",
                "babel-plugin-transform-object-assign",
                [
                    "@babel/plugin-proposal-decorators",
                    { legacy: true }
                ],
                "@babel/plugin-proposal-optional-chaining",
                [
                    "import",
                    {
                        libraryName: "antd",
                        libraryDirectory: "es",
                        style: "css"
                    },
                    "ant"
                ],
                [
                    "import",
                    {
                        libraryName: "antd-mobile",
                        libraryDirectory: "es",
                        style: "css"
                    },
                    "antd-mobile"
                ]
            ]
        }),
        commonjs(),
        production && terser() 

    ]
}
