const path = require('path');
const webpack = require('webpack');

const childProcess = require('child_process');
const gitRevision = childProcess.execSync('git rev-parse HEAD').toString().replace(/\n/, '');
const gitStatus = childProcess.execSync('git status --porcelain').toString();
const buildVersion = ((gitStatus === '') ? gitRevision : 'dirty');
const buildTime = new Date().getTime();
console.log({ buildVersion, buildTime });

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
        new webpack.SourceMapDevToolPlugin({}),
        new webpack.DefinePlugin({
          'BUILD_VERSION': JSON.stringify(buildVersion),
          'BUILD_TIME': JSON.stringify(buildTime),
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
    }
};
