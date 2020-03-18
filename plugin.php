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

require_once __DIR__ . '/autoload.php';

/**
 * Grab the BMFBE object and return it.
 * Wrapper for BMFBE::get_instance().
 *
 * @since 1.0.0
 * @return Plugin  Singleton instance of plugin class.
 */
function bmfbe() {
	return Plugin::get_instance();
}

// Kick it off.
add_action( 'plugins_loaded', array( bmfbe(), 'hooks' ) );

// Activation and deactivation.
register_activation_hook( __FILE__, array( bmfbe(), 'plugin_activate' ) );
register_deactivation_hook( __FILE__, array( bmfbe(), 'plugin_deactivate' ) );
