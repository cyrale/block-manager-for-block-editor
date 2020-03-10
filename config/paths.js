/**
 * Paths
 *
 * Project related paths.
 */

const path = require( 'path' );
const fs = require( 'fs' );

// Make sure any symlinks in the project folder are resolved:
const pluginDir = fs.realpathSync( process.cwd() );
const resolvePlugin = relativePath => path.resolve( pluginDir, relativePath );

// Config after eject: we're in ./config/
module.exports = {
	dotenv: resolvePlugin( '.env' ),
	pluginSrc: resolvePlugin( 'src' ), // Plugin src folder path.
	pluginAdminJs: resolvePlugin( 'src/admin.js' ),
	pluginEditorJs: resolvePlugin( 'src/editor.js' ),
	pluginFrontJs: resolvePlugin( 'src/front.js' ),
	pluginDist: resolvePlugin( './dist' ),
};

const resolveOwn = relativePath => path.resolve( __dirname, '..', relativePath );

// config before eject: we're in ./node_modules/react-scripts/config/
module.exports = {
	dotenv: resolvePlugin( '.env' ),
	pluginSrc: resolvePlugin( 'src' ),
	pluginAdminJs: resolvePlugin( 'src/admin.js' ),
	pluginEditorJs: resolvePlugin( 'src/editor.js' ),
	pluginFrontJs: resolvePlugin( 'src/front.js' ),
	pluginDist: resolvePlugin( './dist' ),
	appPath: resolvePlugin( '.' ),
	// These properties only exist before ejecting:
	ownPath: resolveOwn( '.' ),
};
