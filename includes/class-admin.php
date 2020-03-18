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
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
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

	/**
	 * Add menu page in admin menu.
	 */
	public function admin_menu() {
		add_menu_page(
			__( 'Block Manager for WordPress Block Editor (Gutenberg)', 'bmfbe' ),
			__( 'Block manager', 'bmfbe' ),
			$this->capability(),
			'bmfbe-settings',
			array( $this, 'page_settings' ),
			'dashicons-layout',
			99
		);
	}

	/**
	 * The capability required to use the plugin.
	 *
	 * @return string
	 */
	public function capability() {
		return apply_filters( 'bmfbe_capabilty', 'manage_options' );
	}

	/**
	 * Display settings page.
	 */
	public function page_settings() {

	}
}
