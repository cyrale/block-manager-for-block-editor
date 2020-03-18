<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Front.
 *
 * @since   1.0.0
 * @package BMFBE
 */

namespace BMFBE;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Front.
 *
 * @since 1.0.0
 */
class Front {

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
		wp_enqueue_script(
			'bmfbe-front',
			$this->plugin->url . 'dist/front.build.js',
			array( 'jquery' ),
			substr( sha1( filemtime( $this->plugin->path . 'dist/front.build.js' ) ), 0, 8 ),
			true
		);
		wp_localize_script(
			'bmfbe-front',
			'bmfbeFrontGlobal',
			array()
		);

		wp_enqueue_style(
			'bmfbe-front',
			$this->plugin->url . 'dist/front.build.css',
			array(),
			substr( sha1( filemtime( $this->plugin->path . 'dist/front.build.css' ) ), 0, 8 )
		);
	}
}
