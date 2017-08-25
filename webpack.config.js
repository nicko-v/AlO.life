const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
	context: path.resolve(__dirname, 'app/src'), // absolute path. the entry and module.rules.loader option is resolved relative to this directory
	
	entry: ['babel-polyfill', './index.jsx'], // Here the application starts executing and webpack starts bundling
	
	output: { // options related to how webpack emits results
		path: path.resolve(__dirname, 'app/build'), // the target directory for all output files must be an absolute path (use the Node.js path module)
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
				exclude: [ path.resolve(__dirname, 'app/src/css/dark-mode.css') ],
				use: [ // apply multiple loaders and options
					{
						loader: 'style-loader',
						options: { singleton: true }
					},
					{
						loader: 'css-loader',
						options: {
							url: false,
							importLoaders: 1
						}
					},
					{ loader: 'postcss-loader' }
				]
			},
			
			{
				test: /dark-mode\.css$/,
				use: [ // apply multiple loaders and options
					{ loader: 'style-loader' },
					{
						loader: 'css-loader',
						options: {
							url: false,
							importLoaders: 1
						}
					},
					{ loader: 'postcss-loader' }
				]
			}
		]
	},
	
	plugins: [ // list of additional plugins
		new HTMLWebpackPlugin({
			template: path.resolve(__dirname, 'app/src/index.html'),
			filename: 'index.html',
			inject: 'body'
		}),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, 'app/src/static'),
				to: path.resolve(__dirname, 'app/build/static')
			}
		])
	],
	
	devServer: {
		contentBase: path.resolve(__dirname, 'app/build'), // static file location
		compress: true, // enable gzip compression
		https: false, // true for self-signed, object for cert authority
		noInfo: true, // only errors & warns on hot reload
	}
};