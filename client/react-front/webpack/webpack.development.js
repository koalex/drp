'use strict';

const fs                   = require('fs');
const path                 = require('path');
const webpack              = require('webpack');
const merge                = require('webpack-merge');
const common               = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer         = require('autoprefixer');
const cssMqpacker          = require('css-mqpacker');
const WriteFilePlugin      = require('write-file-webpack-plugin');
const BrowserSyncPlugin    = require('browser-sync-webpack-plugin');

require('../src/buildI18n');

const cssLoaderOpts = modules => {
	const opts = {
		sourceMap: true,
		modules: false,
		importLoaders: 1

	};

	if (modules) {
		opts.modules = {
            localIdentName: '[hash:base64:5]__[local]'
        };
		opts.localsConvention = 'asIs';
		opts.importLoaders = 2;
	}

	return opts;
};

const stylesUse = cssModules => (
	[
		{
			loader: MiniCssExtractPlugin.loader,
			options: {
				hmr: true,
				reloadAll: true
			},
		},
		{
			loader: 'css-loader',
			options: cssLoaderOpts(cssModules)
		},
		{
			loader: 'postcss-loader',
			options: {
				plugins: [
					autoprefixer(),
					cssMqpacker({ sort: true })
				],
				sourceMap: true
			}
		}
	]
);

const config = {
	mode: 'development',
	output: {
		filename: '[name].js',
		chunkFilename: '[id].js',
		path: process.env.WEBPACK_OUTPUT || path.join(__dirname, '../dist'),
		publicPath: '/'
	},
	/*resolve: {
		symlinks: false,
		alias: {
			'react-dom': '@hot-loader/react-dom'
		},
		extensions: ['.js', '.jsx', '.less', '.styl', '.scss']
	},*/
	devtool: 'eval-source-map',
	devServer: {
		contentBase: process.env.WEBPACK_OUTPUT || path.join(__dirname, '../dist'),
		compress: true,
		hot: true,
		inline: true,
		host: '0.0.0.0',
		port: process.env.DEV_SERVER_PORT,
		disableHostCheck: true,
		historyApiFallback: true,
		proxy: { // если нужно кастомно пробрасывать cookie то https://github.com/facebook/create-react-app/issues/2778#issuecomment-383266751
			'/api': {
				target: process.env.PROXY,
				secure: false //process.env.PROXY.includes('https://') // false для self-signed cert
			},
			'/static': {
				target: process.env.PROXY,
				secure: false //process.env.PROXY.includes('https://') // false для self-signed cert
			}
		},
		stats: {
			all: false,
			colors: true,
			modules: true,
			maxModules: 0,
			errors: true,
			warnings: true,
			moduleTrace: true,
			errorDetails: true
		},
	},
	watch: true,
	watchOptions: {
		aggregateTimeout: 150,
		ignored: /node_modules/
	},
	performance: {
		hints: false,
		maxEntrypointSize: 400000,
		maxAssetSize: 250000,
		assetFilter: function (assetFilename) {
			return !(/\.map$/.test(assetFilename));
		}
	},
	cache: true,
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: [/(node_modules|bower_components)/],
				use: [/*'cache-loader',*/ 'babel-loader'],
			},
			{
				test: /\.css$/,
				use: stylesUse(false)
			},
			{
				test: /\.less$/,
				use: stylesUse(true).concat({
					loader: 'less-loader',
					options: {
						javascriptEnabled: true
					}
				})
			},
			{
				test: /\.scss$/,
				use: stylesUse(true).concat('sass-loader')
			},
			{
				test: /\.styl$/,
				use: stylesUse(true).concat('stylus-loader')
			},
			{
				test: /\.(png|jpg|jpeg|svg|ttf|eot|woff|woff2)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[path][name].[ext]',
							limit: 4096
						}
					},
					{
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								progressive: true,
								quality: 65
							},
							gifsicle: {
								interlaced: false
							},
							optipng: {
								optimizationLevel: 7
							},
							pngquant: {
								quality: [0.65, 0.90],
								speed: 4
							},
							webp: { // the webp option will enable WEBP
								quality: 75
							}
						}
					}
				]
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development'),
			NODE_ENV: JSON.stringify('development'),
			__DEV__: JSON.stringify(true),
			__DEVTOOLS__: JSON.stringify(true)
		}),
		// new webpack.NamedModulesPlugin(),
		new MiniCssExtractPlugin({
			chunkFilename: '[id].css'
		}),
		new WriteFilePlugin({
			test: /favicons\.json$/
		}),
		new BrowserSyncPlugin(
			{
				ui: {
					port: 8090
				},
				https: (process.env.SSL_KEY || process.env.SSL_CERT) ? {
					key: process.env.SSL_KEY,
					cert: process.env.SSL_CERT
				} : false,
				ghostMode: {
					clicks: false,
					forms: true,
					scroll: false
				},
				notify: false,
				host: 'localhost',
				// tunnel: 'my-private-site',
				port: 8080,
				cors: false,
				proxy: {
					target: ((process.env.SSL_KEY || process.env.SSL_CERT) ? 'https' : 'http') + '://localhost:' + process.env.DEV_SERVER_PORT,
					ws: true
				}
			},
			{
				reload: false
			}
		)
	]
};

if (process.env.SSL_KEY || process.env.SSL_CERT) {
	config.devServer.https = {
		key: fs.readFileSync(process.env.SSL_KEY),
		cert: fs.readFileSync(process.env.SSL_CERT),
		// ca: fs.readFileSync('/path/to/ca.pem'),
	}
}

module.exports = merge(common, config);
