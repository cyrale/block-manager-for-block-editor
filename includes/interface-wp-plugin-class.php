<?php
/**
 * Interface WP_Plugin_Class: define class used with WP.
 *
 * @since 1.0.0
 * @package BMFBE\Interfaces
 */

namespace BMFBE\Interfaces;

use BMFBE\Plugin;

/**
 * Interface WP_Plugin_Class: define class used with WP.
 *
 * @since 1.0.0
 * @package BMFBE\Interfaces
 */
interface WP_Plugin_Class {
	/**
	 * Constructor.
	 *
	 * @param Plugin $plugin Main plugin object.
	 *
	 * @since 1.0.0
	 */
	public function __construct( $plugin );

	/**
	 * Initiate our hooks.
	 *
	 * @since 1.0.0
	 */
	public function hooks();
}
