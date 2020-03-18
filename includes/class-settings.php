<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Settings.
 *
 * @since   1.0.0
 * @package BMFBE
 */

namespace BMFBE;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Settings.
 *
 * @since 1.0.0
 */
class Settings {

	/**
	 * Parent plugin class.
	 *
	 * @since 1.0.0
	 *
	 * @var   Plugin
	 */
	protected $plugin = null;

	/**
	 * Constructor.
	 *
	 * @param Plugin $plugin Main plugin object.
	 *
	 * @since  1.0.0
	 */
	public function __construct( $plugin ) {
		$this->plugin = $plugin;
		$this->hooks();
	}

	/**
	 * Initiate our hooks.
	 *
	 * @since  1.0.0
	 */
	public function hooks() {
	}
}
