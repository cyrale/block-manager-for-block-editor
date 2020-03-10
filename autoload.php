<?php
/**
 * Autoloader.
 *
 * @package BMFBE
 */

spl_autoload_register(
	function ( $name ) {
		$sanitized_basename = str_replace( '_', '-', sanitize_title( basename( str_replace( '\\', '/', $name ) ) ) );

		if ( strpos( $name, 'BMFBE\\Plugin' ) === 0 ) {
			require_once __DIR__ . '/plugin.php';
		}
		if ( strpos( $name, 'BMFBE\\' ) === 0 ) {
			require_once __DIR__ . '/includes/class-' . $sanitized_basename . '.php';
		}
	}
);
