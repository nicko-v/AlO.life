var HTMLWebpackPlugin = require('html-webpack-plugin');

var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
	template: __dirname + '/app/index.html',
	filename: 'index.html',
	inject: 'body'
});

var jsLoader = {
	test: /\.jsx?$/,
	exclude: /node_modules/,
	loader: 'babel-loader'
};
var cssLoader = {
	test: /\.css$/,
	use:
	[
		'style-loader',
		{ loader: 'css-loader', options: { url: false, importLoaders: 1 } },
		'postcss-loader'
	]
};


var config = module.exports = {};

config.context = __dirname + '/app';
config.entry = './index.jsx';

config.module = {
	rules: [jsLoader, cssLoader]
};

config.output = {
	filename: 'app.min.js',
	path: __dirname + '/app/public',
	publicPath: '/'
};

config.plugins = [HTMLWebpackPluginConfig];