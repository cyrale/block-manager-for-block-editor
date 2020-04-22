module.exports = {
	presets: [
		[
			// 'env',
			require.resolve( '@babel/preset-env' ),
			{
				// Do not transform modules to CJS.
				modules: false,
			},
		],
	],
	plugins: [
		// class { handleClick = () => { } }.
		[ require.resolve( '@babel/plugin-proposal-class-properties' ) ],
		// The following two plugins use Object.assign directly, instead of Babel's
		// extends helper. Note that this assumes `Object.assign` is available.
		// { ...todo, completed: true }
		[
			require.resolve( '@babel/plugin-proposal-object-rest-spread' ),
			{
				useBuiltIns: true,
			},
		],
		[
			// Transforms JSX Syntax.
			// 'transform-react-jsx',
			require.resolve( '@babel/plugin-transform-react-jsx' ),
			{
				pragma: 'wp.element.createElement',
				pragmaFrag: 'wp.element.Fragment',
			},
		],
		// Async/Await awesomeness https://babeljs.io/docs/en/babel-plugin-syntax-async-functions/.
		[ require.resolve( '@babel/plugin-syntax-async-generators' ) ],
		// Polyfills the runtime needed for async/await and generators.
		[
			require.resolve( '@babel/plugin-transform-runtime' ),
			{
				helpers: false,
				regenerator: true,
			},
		],
	],
};
