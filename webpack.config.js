const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const extractRegularStyles = new ExtractTextPlugin('styles.css');
const extractDarkStyles    = new ExtractTextPlugin('styles.dark.css');


module.exports = {
	context: path.resolve(__dirname, 'client/src'), // absolute path. the entry and module.rules.loader option is resolved relative to this directory
	
	entry: ['babel-polyfill', './index.jsx'], // Here the application starts executing and webpack starts bundling
	
	output: { // options related to how webpack emits results
		path: path.resolve(__dirname, 'client/build'), // the target directory for all output files must be an absolute path (use the Node.js path module)
		filename: 'app.js', // the filename template for entry chunks
		publicPath: '/', // the url to the output directory resolved relative to the HTML page
  },
	
	module: { // configuration regarding modules
		rules: [
			{
				test: /\.jsx?$/,
				exclude: [ path.resolve(__dirname, 'node_modules') ],
				loader: 'babel-loader', // the loader which should be applied, it'll be resolved relative to the context
				options: { // options for the loader
					presets: ['env']
				}
			},
			
			{
				test: /\.css$/,
				exclude: /\.dark\.css$/,
				use: extractRegularStyles.extract(['css-loader', 'postcss-loader'])
			},
			
			{
				test: /\.dark\.css$/,
				use: extractDarkStyles.extract(['css-loader', 'postcss-loader'])
			},
		]
	},
	
	plugins: [ // list of additional plugins
		new HTMLWebpackPlugin({
			template: path.resolve(__dirname, 'client/src/index.html'),
			filename: 'index.html',
			inject: 'body'
		}),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, 'client/src/static'),
				to: path.resolve(__dirname, 'client/build/static')
			}
		]),
		extractRegularStyles,
		extractDarkStyles
	],
	
	devServer: {
		contentBase: path.resolve(__dirname, 'client/build'), // static file location
		compress: true, // enable gzip compression
		https: false, // true for self-signed, object for cert authority
		noInfo: true, // only errors & warns on hot reload
	}
};