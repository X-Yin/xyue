const path = require('path');

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, '../src/core/compile/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
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
        minimize: false
    }
}