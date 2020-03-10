const path = require( 'path' );

const merge = require( 'lodash/merge' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const OptimizeCSSAssetsPlugin = require( 'optimize-css-assets-webpack-plugin' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );

const paths = require( './config/paths' );
const externals = require( './config/externals' );

// Export configuration.
module.exports = ( env, options ) => {
	const mode = options.mode || process.env.NODE_ENV || 'production';

	let optimization = {
		splitChunks: {
			cacheGroups: {
				admin: {
					name: 'admin',
					test: /admin\.scss$/,
					chunks: 'all',
					enforce: true,
				},
				editor: {
					name: 'editor',
					test: /editor\.scss$/,
					chunks: 'all',
					enforce: true,
				},
				front: {
					name: 'front',
					test: /front\.scss$/,
					chunks: 'all',
					enforce: true,
				},
			},
			chunks: 'all',
		},
	};

	if ( mode === 'production' ) {
		optimization = merge( {}, optimization, {
			minimize: true,
			minimizer: [
				new TerserPlugin( {
					test: /\.js$/i,
					extractComments: false,
					terserOptions: {
						output: {
							comments: false,
						},
					},
				} ),
				new OptimizeCSSAssetsPlugin( {
					test: /\.css$/i,
				} ),
			],
		} );
	}

	return {
		entry: {
			'./admin.build': paths.pluginAdminJs, // 'name' : 'path/file.ext'.
			'./editor.build': paths.pluginEditorJs, // 'name' : 'path/file.ext'.
			'./front.build': paths.pluginFrontJs, // 'name' : 'path/file.ext'.
		},
		output: {
			// Add /* filename */ comments to generated require()s in the output.
			pathinfo: true,
			// The dist folder.
			path: paths.pluginDist,
			filename: '[name].js', // [name] = './app.build' as defined above.
		},
		mode,
		optimization,
		// You may want 'eval' instead if you prefer to see the compiled output in DevTools.
		devtool: mode !== 'production' ? 'source-map' : false,
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							// This is a feature of `babel-loader` for webpack (not Babel itself).
							// It enables caching results in ./node_modules/.cache/babel-loader/
							// directory for faster rebuilds.
							cacheDirectory: true,
						},
					},
				},
				{
					test: /\.scss$/,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								importLoaders: 2,
							},
						},
						// "postcss" loader transforms our CSS.
						{
							loader: 'postcss-loader',
						},
						// "resolve-url" loader rewrites relative paths in `url()`.
						{
							loader: 'resolve-url-loader',
						},
						// "sass" loader converts SCSS to CSS.
						{
							loader: 'sass-loader',
							options: {
								implementation: require( 'sass' ),
								sassOptions: {
									fiber: require( 'fibers' ),
								},
							},
						},
					],
				},
			],
		},
		// Add plugins.
		plugins: [
			new CleanWebpackPlugin( {
				cleanOnceBeforeBuildPatterns: [ paths.pluginDist ],
				cleanAfterEveryBuildPatterns: [
					path.resolve( paths.pluginDist, './**/*.js' ),
					'!' + path.resolve( paths.pluginDist, './**/*.build.js' ),
					path.resolve( paths.pluginDist, './**/*.js.map' ),
					'!' +
						path.resolve( paths.pluginDist, './**/*.build.js.map' ),
				],
			} ),
			new MiniCssExtractPlugin( {
				filename: '[name].build.css',
			} ),
		],
		stats: 'minimal',
		// stats: 'errors-only',
		// Add externals.
		externals,
	};
};
