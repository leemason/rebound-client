const webpack = require('webpack');

module.exports = {
    target: 'web',
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
        library: 'rebound',
        path: './dist',
        filename: 'rebound-client.min.js'
    },
    module: {
        loaders: [
            {
                loader: "babel-loader",

                exclude: /node_modules/,

                // Only run `.js` and `.jsx` files through Babel
                test: /\.js?$/
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        })
    ]
}