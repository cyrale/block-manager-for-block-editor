<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Admin.
 *
 * @since   1.0.0
 * @package BMFBE
 */

namespace BMFBE;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Admin.
 *
 * @since 1.0.0
 */
class Admin {

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
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
	}

	/**
	 * Enqueue scripts and styles.
	 */
	public function enqueue_admin_assets() {
		wp_enqueue_script(
			'bmfbe-admin',
			$this->plugin->url . 'dist/admin.build.js',
			array( 'jquery' ),
			substr( sha1( filemtime( $this->plugin->path . 'dist/admin.build.js' ) ), 0, 8 ),
			true
		);
		wp_localize_script(
			'bmfbe-admin',
			'bmfbeAdminGlobal',
			array()
		);

		 wp_enqueue_style(
			'bmfbe-admin',
			$this->plugin->url . 'dist/admin.build.css',
			array(),
			substr( sha1( filemtime( $this->plugin->path . 'dist/admin.build.css' ) ), 0, 8 )
		);
	}
}
