<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Version.
 *
 * @since 1.0.0
 * @package BMFBE\Utils
 */

namespace BMFBE\Utils;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Version.
 *
 * @since 1.0.0
 * @package BMFBE\Utils
 */
class Version {

	/**
	 * Test if versions of WordPress or Gutenberg are valid.
	 *
	 * @param array $version Version to test.
	 *
	 * @return bool True if versions are valid, False otherwise.
	 *
	 * @since 1.0.0
	 */
	public static function version_compare( $version ) {
		global $wp_version;

		$wp_valid        = isset( $version['wp'] ) && version_compare( $version['wp'], $wp_version, '<=' );
		$gutenberg_valid = isset( $version['gutenberg'] ) && defined( 'GUTENBERG_VERSION' ) && version_compare( $version['gutenberg'], GUTENBERG_VERSION, '<=' );

		return $wp_valid || $gutenberg_valid;
	}
}
