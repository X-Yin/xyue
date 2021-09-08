const path = require('path');

module.exports = {
	mode: 'production',
	entry: path.resolve(__dirname, './main.js'),
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, './dist')
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
					presets: [
						'@babel/preset-env'
					]
				}
			},
			{
				test: /\.vue$/,
				loader: path.resolve(__dirname, '../modules/loader/index.js')
			}
		]
	},
	optimization: {
		minimize: false
	}
}