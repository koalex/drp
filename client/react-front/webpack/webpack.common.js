'use strict';
require('dotenv').config();
const path                          = require('path');
const webpack                       = require('webpack');
const { CleanWebpackPlugin }        = require('clean-webpack-plugin');
const HtmlWebpackPlugin 			= require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin       = require('optimize-css-assets-webpack-plugin');
const FaviconsWebpackPlugin         = require('favicons-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const CopyWebpackPlugin             = require('copy-webpack-plugin');
const pkg                           = require('../package.json');

module.exports = {
	context: path.join(__dirname, '../src'),
	target: 'web',
	entry: {
		index: [path.join(__dirname, '../src/index.jsx')]
	},
	resolve: {
        symlinks: false,
		alias: {
            'utils': path.join(__dirname, '../src/utils'),
		},
		extensions: ['.js', '.jsx', '.less', '.styl', '.scss']
	},
	optimization: {
		runtimeChunk: {
			name: 'runtime'
		},
		splitChunks: {
			chunks: 'all',
			minSize: 0,
			maxAsyncRequests: Infinity,
			maxInitialRequests: Infinity,
			name: true,
			cacheGroups: {
				styles: { // extract in one CSS file
					name: 'styles',
					test: /\.css$|\.less$|\.scss$|\.styl$/,
					chunks: 'all',
					enforce: true
				},
				default: {
					chunks: 'async',
					minSize: 30000,
					minChunks: 2,
					maxAsyncRequests: 5,
					maxInitialRequests: 3,
					priority: -20,
					reuseExistingChunk: true
				},
				vendor: {
					name: 'vendor',
					enforce: true,
					test: /[\\/]node_modules[\\/]/,
					priority: -10,
					reuseExistingChunk: true
				},
				common: {
					name: 'common',
					chunks: 'initial',
					minChunks: 2,
					test: function (module) {
						return module.resource && /src[\\/]/.test(module.resource);
					},
					priority: -5,
					reuseExistingChunk: true,
				}
			}
		}
	},
	plugins: [
		new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!.gitkeep'],
			cleanAfterEveryBuildPatterns: []
		}),
		new CopyWebpackPlugin([
			{ from: path.join(__dirname, '../src/assets/img/logo_100x100.png'), to: path.join(__dirname, '../dist/assets/img'), cache: true },
			{ from: path.join(__dirname, '../src/assets/img/logo_280x150.png'), to: path.join(__dirname, '../dist/assets/img'), cache: true },
			{ from: path.join(__dirname, '../src/assets/img/logo_1200x630.png'), to: path.join(__dirname, '../dist/assets/img'), cache: true },
		]),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
			minify: true
		}),

		new FaviconsWebpackPlugin({
			logo: path.join(__dirname, '../src/assets/img/logo.png'),
			inject: true,
			persistentCache: true,
			prefix: '[hash:6]/[hash:6].[ext]',
			emitStats: true,
			statsFilename: 'favicons.json',
			background: '#fff',
			title: 'DriverPack Solution',
			appName: 'DriverPack Solution',
			appDescription: pkg.description,
			developerName: pkg.contributors[0].name,
			developerURL: pkg.contributors[0].url,
			index: 'https://localhost',
			url: 'https://localhost',
			// silhouette: false,
			icons: {
				android: true,
				appleIcon: true,
				appleStartup: true,
				coast: true,
				favicons: true,
				firefox: true,
				opengraph: true,
				twitter: true,
				yandex: true,
				windows: true
			}
		}),
		new LodashModuleReplacementPlugin(/*opts*/),
		new OptimizeCSSAssetsPlugin(),

		new webpack.ContextReplacementPlugin(
			/([\/\\]node_modules[\/\\]moment[\/\\]locale|[\/\\]bower_components[\/\\]moment[\/\\]locale)/,
			/en-gb/
		)
	]
};
