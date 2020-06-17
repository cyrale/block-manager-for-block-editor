<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Admin.
 *
 * @since 1.0.0
 * @package BMFBE
 */

namespace BMFBE;

use BMFBE\Interfaces\WP_Plugin_Class;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Admin.
 *
 * @since 1.0.0
 * @package BMFBE
 */
class Admin implements WP_Plugin_Class {
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
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_dev_assets' ) );
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
	}

	/**
	 * Enqueue scripts and styles.
	 */
	public function enqueue_admin_assets() {
		$asset = require_once $this->plugin->path . 'build/admin.asset.php';

		wp_enqueue_script(
			'bmfbe-admin',
			$this->plugin->url . 'build/admin.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);
		wp_localize_script(
			'bmfbe-admin',
			'bmfbeAdminGlobal',
			array()
		);

		wp_enqueue_style(
			'bmfbe-admin',
			$this->plugin->url . 'build/admin.css',
			array(),
			$asset['version']
		);
	}

	/**
	 * Enqueue scripts and styles used in development.
	 */
	public function enqueue_dev_assets() {
		if ( ! defined( 'WP_ENV' ) || 'development' !== WP_ENV ) {
			return;
		}

		wp_enqueue_script( 'webpack-livereload-plugin', 'http://localhost:35729/livereload.js' );
	}

	/**
	 * Add menu page in admin menu.
	 */
	public function admin_menu() {
		add_menu_page(
			__( 'Block Manager for WordPress Block Editor (Gutenberg)', 'bmfbe' ),
			__( 'Block manager', 'bmfbe' ),
			$this->plugin->global_settings->capability(),
			'bmfbe-settings',
			array( $this, 'page_settings' ),
			'dashicons-layout',
			99
		);
	}


	/**
	 * Display settings page.
	 */
	public function page_settings() {
		echo '<div class="bmfbe-settings">';
		echo '<h1>' . __( 'Block Manager for WordPress Block Editor (Gutenberg)', 'bmfbe' ) . '</h1>';
		echo '<div id="bmfbeSettings"></div>';
		echo '</div>';
	}
}
