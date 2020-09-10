<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Admin.
 *
 * @package BMFBE
 * @since 1.0.0
 */

namespace BMFBE;

use BMFBE\Interfaces\WP_Plugin_Class;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Admin.
 *
 * @since 1.0.0
 */
class Admin implements WP_Plugin_Class {

	/**
	 * Parent plugin class.
	 *
	 * @var Plugin
	 *
	 * @since 1.0.0
	 */
	protected $plugin;

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
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
	}

	/**
	 * Enqueue scripts and styles.
	 *
	 * @param string $hook_suffix The current admin page.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_admin_assets( $hook_suffix ) {
		if ( 'toplevel_page_bmfbe-settings' !== $hook_suffix ) {
			return;
		}

		// Register block categories.
		wp_add_inline_script(
			'wp-blocks',
			sprintf( 'wp.blocks.setCategories( %s );', wp_json_encode( get_block_categories( null ) ) ),
			'after'
		);

		$asset = require_once $this->plugin->path . 'build/admin.asset.php';

		wp_enqueue_script(
			'bmfbe-admin',
			$this->plugin->url . 'build/admin.js',
			$asset['dependencies'],
			$asset['version']
		);
		wp_localize_script(
			'bmfbe-admin',
			'bmfbeAdminGlobal',
			array(
				'detectionPage' => add_query_arg( array( 'detect' => 1 ), admin_url( 'post-new.php' ) ),
			)
		);

		wp_enqueue_style(
			'bmfbe-admin',
			$this->plugin->url . 'build/admin.css',
			array( 'wp-edit-post', 'wp-components' ),
			$asset['version']
		);
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
		// Register all assets relative to editor.
		do_action( 'enqueue_block_editor_assets' );

		// Display admin screen.
		echo '<div class="bmfbe-settings">';
		echo '  <div class="bmfbe-settings__header">';
		echo '    <div class="bmfbe-settings__title-section">';
		echo '      <h1>' . __( 'Block Manager for WordPress Block Editor (Gutenberg)', 'bmfbe' ) . '</h1>';
		echo '    </div>';
		echo '  </div>';
		echo '  <div class="bmfbe-settings__content" id="bmfbeSettings"></div>';
		echo '</div>';
	}
}
