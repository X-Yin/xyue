const path = require('path');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    // entry: path.resolve(__dirname, '../src/index.js'),
    entry: path.resolve(__dirname, '../src/core/vue/entry.js'),
    output: {
        filename: 'vue.js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [
            {
                test: /\.[j|t]s$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env'
                    ]
                }
            }
        ]
    },
    optimization: {
        minimize: false,
        minimizer: [new TerserWebpackPlugin()]
    }
}