<?php
/**
 * Autoloader.
 *
 * @since 1.0.0
 * @package BMFBE
 */

spl_autoload_register( 'bmfbe_autoload' );

/**
 * Autoloader.
 *
 * @since 1.0.0
 *
 * @param string $class Name of the class to load.
 */
function bmfbe_autoload( $class ) {
	// Split class name.
	$name  = str_replace( '\\', '/', $class );
	$parts = explode( '/', $name );

	// Remove not qualified classes.
	if ( count( $parts ) < 2 ) {
		return;
	}

	// Sanitize each part of class name.
	$sanitized_parts = array_map( 'bmfbe_autoload_sanitize_parts', $parts );

	// Process only our classes.
	if ( reset( $sanitized_parts ) === 'bmfbe' ) {
		// No need of the first element.
		array_shift( $sanitized_parts );
		// Extract last element, it's the filename without extension.
		$script = array_pop( $sanitized_parts );

		$prefix = 'class';
		if ( reset( $sanitized_parts ) === 'interfaces' ) {
			$prefix = 'interface';
			array_shift( $sanitized_parts );
		}

		// Build path where to find the script.
		$path = join( '/', $sanitized_parts );
		$path = '' !== $path ? '/' . $path : $path;

		require_once __DIR__ . "/includes{$path}/{$prefix}-{$script}.php";
	}
}

/**
 * Sanitize part of the path of class.
 *
 * @param string $part Part of the path of class.
 *
 * @return string
 */
function bmfbe_autoload_sanitize_parts( $part ) {
	return str_replace( '_', '-', sanitize_title( $part ) );
}
