<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Singleton.
 *
 * @since 1.0.0
 * @package BMFBE\Utils
 */

namespace BMFBE\Utils;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Singleton.
 *
 * @since 1.0.0
 * @package BMFBE\Utils
 */
abstract class Singleton {

	/**
	 * Singleton instance of plugin.
	 *
	 * @var Settings
	 *
	 * @since 1.0.0
	 */
	private static $single_instances = array();

	/**
	 * Creates or returns an instance of this class.
	 *
	 * @return Settings a single instance of this class
	 *
	 * @since 1.0.0
	 */
	final public static function get_instance() {
		$called_class = get_called_class();
		if ( ! isset( self::$single_instances[ $called_class ] ) ) {
			self::$single_instances[ $called_class ] = new $called_class();
		}

		return self::$single_instances[ $called_class ];
	}

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
	}
}
