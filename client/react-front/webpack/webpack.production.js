'use strict';

const path                  = require('path');
const webpack               = require('webpack');
const merge                 = require('webpack-merge');
const common                = require('./webpack.common.js');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');
const autoprefixer          = require('autoprefixer');
const cssMqpacker           = require('css-mqpacker');
const AssetsPlugin          = require('assets-webpack-plugin');
const zopfli 				= require('@gfx/zopfli');
const CompressionPlugin 	= require('compression-webpack-plugin');
const BundleAnalyzerPlugin  = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin 			= require('terser-webpack-plugin');

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

module.exports = merge(common, {
	mode: 'production',
	output: {
		filename: '[chunkhash].[name].js',
		chunkFilename: '[id].[chunkhash].js',
		path: process.env.WEBPACK_OUTPUT || path.join(__dirname, '../dist'),
		publicPath: '/',
		auxiliaryComment: 'Konstantin Aleksandrov',
        // globalObject: `(typeof self !== 'undefined' ? self : this)`,
	},
	devtool: 'source-map',
	performance: {
		hints: 'warning',
		maxEntrypointSize: 400000,
		maxAssetSize: 250000,
		assetFilter: function (assetFilename) {
			return !(/\.map$/.test(assetFilename));
		}
	},
	profile: true,
	stats: {
		assets: true,
		colors: true,
		errors: true,
		errorDetails: true,
		hash: true,
		performance: true,
		reasons: true,
		timings: true
	},
	module: {
		noParse: /jquery/,
		rules: [
			{
				test: /\.jsx?$/,
				exclude: [/(node_modules|bower_components)/],
				loader: 'babel-loader',
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: false,
							importLoaders: 1

						}
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: [
								autoprefixer({ browsers: ['last 3 version', 'ie >= 11'] }),
								cssMqpacker({ sort: true })
							],
							sourceMap: true
						}
					}
				]
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
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: true,
							localIdentName: '[hash:base64:5]',
							importLoaders: 2

						}
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: [
								autoprefixer({ browsers: ['last 3 version', 'ie >= 11'] }),
								cssMqpacker({ sort: true })
							],
							sourceMap: true
						}
					},
					'sass-loader'
				]
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
							name: '[path][name].[hash:6].[ext]',
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
								quality: '65-90',
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
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: 4,
                // banner: 'hello',
                extractComments: true,
                test: /\.js$/,
                sourceMap: true
            })
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
			NODE_ENV: JSON.stringify('production'),
            PROTOCOL: JSON.stringify(process.env.PROTOCOL),
            HOST: JSON.stringify(process.env.HOST),
            PORT: JSON.stringify(process.env.PORT),
			__DEV__: JSON.stringify(false),
			__DEVTOOLS__: JSON.stringify(false)
		}),
		new webpack.HashedModuleIdsPlugin({
			hashFunction: 'sha256',
			hashDigest: 'hex',
			hashDigestLength: 20
		}),
        new AssetsPlugin({
            filename: 'assets.json',
            path: path.join(__dirname, '../dist'),
            metadata: { buildDate: new Date() }
        }),
		new MiniCssExtractPlugin({
			filename: '[chunkhash].[name].css',
			chunkFilename: '[id].[chunkhash].css'
		}),
		new CompressionPlugin({
            test: /\.js$|\.css$/,
            filename: '[path].gz[query]',
            compressionOptions: {
                numiterations: 25
            },
            algorithm: function (input, compressionOptions, callback) {
                return zopfli.gzip(input, compressionOptions, callback);
            },
			threshold: 10240,
			minRatio: 0.8
		}),
		new BundleAnalyzerPlugin({
			analyzerMode: 'static',
			openAnalyzer: false,
			defaultSizes: 'gzip',
			reportFilename: '__bundleAnalyzer.html',
			generateStatsFile: true,
			statsFilename: '__webpack.stats.json',
			statsOptions: null,
			logLevel: 'warn'
		})
	]
});
