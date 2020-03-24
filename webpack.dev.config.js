
const path = require('path')
const apiMocker = require('mocker-api');
var Merge = require('webpack-merge');
var commonConfig = require('./webpack.config.js');


module.exports = Merge.smart(commonConfig, {
    devtool: 'source-map',
    devServer: {
        port: 8084,
        contentBase: path.join(__dirname, 'dist'),
        watchOptions: {
            hot: true,
            watchContentBase: true,
            poll: true
        },
        before(app) {
            apiMocker(app, path.resolve('./mocker/index.js'), {
                proxy: {
                    '/repos/*': 'https://api.github.com/',
                    '/:owner/:repo/raw/:ref/*': 'http://127.0.0.1:2018'
                },
                changeHost: true,
            })
        }
    },
});
