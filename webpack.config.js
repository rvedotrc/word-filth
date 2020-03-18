const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: false,
    entry: './src',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(css)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    },
                ],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            }
        ]
    },
    optimization: {
        minimize: false
    },
    output: {
        path: path.resolve(__dirname, 'public/dist'),
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({})
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
    }
};
