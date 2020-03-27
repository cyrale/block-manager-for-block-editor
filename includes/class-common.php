<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Common.
 *
 * @since 1.0.0
 * @package BMFBE
 */

namespace BMFBE;

use BMFBE\Interfaces\WP_Plugin_Class;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Common.
 *
 * @since 1.0.0
 * @package BMFBE
 */
class Common implements WP_Plugin_Class {
	/**
	 * Parent plugin class.
	 *
	 * @var Plugin
	 * @since 1.0.0
	 */
	protected $plugin = null;

	/**
	 * Constructor.
	 *
	 * @param Plugin $plugin Main plugin object.
	 *
	 * @since 1.0.0
	 */
	public function __construct( $plugin ) {
		$this->plugin = $plugin;
		$this->hooks();
	}

	/**
	 * Initiate our hooks.
	 *
	 * @since 1.0.0
	 */
	public function hooks() {
		add_action( 'after_setup_theme', array( $this, 'theme_supports' ) );
	}

	/**
	 * Enqueue scripts and styles.
	 */
	public function theme_supports() {
		/*
		TODO: https://developer.wordpress.org/block-editor/developers/themes/theme-support/#editor-styles
		add_theme_support( 'editor-styles' );
		*/
	}
}
