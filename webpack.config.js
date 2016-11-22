const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'eval',
    entry: {
        'index': [
            './demo/index'
        ]
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].bundle.js',
        publicPath: '/markdown-it-react-loader/build/'
    },
    resolve: {
        alias: {
            'react-gm': 'react-gm/dist/react-gm.js'
        }
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /dict-zi\.js/
        }, {
            test: /\.md$/,
            loader: 'babel!../index.js'
        }],
        noParse: ['react-gm/dist/react-gm.js']
    },
    markdownItReact: function () {
        return {
            className: 'doc' // 默认也是doc
        };
    }
};
