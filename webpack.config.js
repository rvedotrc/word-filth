const path = require('path');

module.exports = {
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
    output: {
        path: path.resolve(__dirname, 'public/dist'),
    },
    optimization: {
        minimize: false
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    }
};
