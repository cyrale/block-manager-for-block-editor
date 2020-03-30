<?php
/**
 * Plugin Name: Block Manager for WordPress Block Editor (Gutenberg)
 * Plugin URI:  https://github.com/cyrale/block-manager-for-block-editor
 * Description:
 * Version:     1.0.0
 * Author:      Cyril Jacquesson
 * License:     GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: bmfbe
 * Domain Path: /languages
 *
 * @package BMFBE
 * @version 1.0.0
 */

use BMFBE\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once __DIR__ . '/autoload.php';

define( 'BMFBE_MAIN_FILE', __FILE__ );

/**
 * Grab the BMFBE object and return it.
 * Wrapper for BMFBE::get_instance().
 *
 * @return Plugin  Singleton instance of plugin class.
 * @throws Exception If plugin not correctly initialized.
 * @since 1.0.0
 */
function bmfbe() {
	return Plugin::get_instance();
}

try {
	// Kick it off.
	add_action( 'plugins_loaded', array( bmfbe(), 'hooks' ) );

	// Activation and deactivation.
	register_activation_hook( __FILE__, array( bmfbe(), 'plugin_activate' ) );
	register_deactivation_hook( __FILE__, array( bmfbe(), 'plugin_deactivate' ) );
} catch ( Exception $e ) {
	wp_die( $e->getMessage() );
}
