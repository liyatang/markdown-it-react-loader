const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'eval',
    entry: {
        'index': [
            './docs/index'
        ]
    },
    output: {
        path: path.join(__dirname, 'docs/build'),
        filename: '[name].bundle.js',
        publicPath: '/markdown-it-react-loader/docs/build/'
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
