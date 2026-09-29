const path = require('path');

module.exports = {
    entry: './src/index',
    //entry: './dist/index',
    mode: 'development',
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
        ],
    },
    resolve: {
        extensions: [
            '.ts', '.js'
        ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
    },
    devServer: {
        contentBase: path.resolve(__dirname, '.'),
        publicPath: '/dist/',
        port: 8080,
        open: true,
        watchContentBase: true,
    },
}