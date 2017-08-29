const path = require('path');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        'app': './main.ts'
    },
    devServer: {
        contentBase: './'
    },
    output: {
        path: path.resolve(__dirname, 'js'),//__dirname + './js',
        //path: helpers.root('dist'),
        publicPath: 'http://localhost:8080/js/',
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /.ts$/,
                loader: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: ['*', '.ts', '.js']
    }
}