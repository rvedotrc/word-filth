const path = require('path');

module.exports = {
    entry: './src/index.jsx',
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
