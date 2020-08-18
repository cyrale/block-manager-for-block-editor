<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Front.
 *
 * @since 1.0.0
 * @package BMFBE
 */

namespace BMFBE;

use BMFBE\Interfaces\WP_Plugin_Class;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Front.
 *
 * @since 1.0.0
 * @package BMFBE
 */
class Front implements WP_Plugin_Class {
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
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_front_assets' ) );
	}

	/**
	 * Enqueue scripts and styles.
	 */
	public function enqueue_front_assets() {
		$asset = require_once $this->plugin->path . 'build/front.asset.php';

		wp_enqueue_script(
			'bmfbe-front',
			$this->plugin->url . 'build/front.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);
		wp_localize_script(
			'bmfbe-front',
			'bmfbeFrontGlobal',
			array()
		);

		wp_enqueue_style(
			'bmfbe-front',
			$this->plugin->url . 'build/front.css',
			array(),
			$asset['dependencies']
		);
	}
}
