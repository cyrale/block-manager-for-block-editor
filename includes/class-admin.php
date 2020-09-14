<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Admin.
 *
 * @package BMFBE
 * @since 1.0.0
 */

namespace BMFBE;

use BMFBE\Interfaces\WP_Plugin_Class;
use BMFBE\Settings\Global_Settings;
use BMFBE\Utils\Supports;

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
				'settingsSections'        => $this->settings_sections(),
				'availableSupports'       => $this->available_supports(),
				'availableSupportsFields' => $this->available_supports_fields(),
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

	/**
	 * Get all sections to display in settings.
	 *
	 * @return array Sections to display in settings.
	 *
	 * @since 1.0.0
	 */
	protected function settings_sections() {
		$sections = array(
			array(
				'name'   => 'interface',
				'label'  => __( 'Interface', 'bmfbe' ),
				'fields' => array(
					array(
						'name'  => 'disable_fullscreen',
						'label' => __( 'Disable fullscreen mode', 'bmfbe' ),
					),
					array(
						'name'  => 'disable_block_directory',
						'label' => __( 'Disable block directory', 'bmfbe' ),
					),
					array(
						'name'  => 'disable_block_patterns',
						'label' => __( 'Disable block patterns', 'bmfbe' ),
					),
				),
			),
			array(
				'name'   => 'colors',
				'label'  => __( 'Colors', 'bmfbe' ),
				'fields' => array(
					array(
						'name'  => 'disable_custom_colors',
						'label' => __( 'Disable custom colors', 'bmfbe' ),
					),
					array(
						'name'  => 'disable_color_palettes',
						'label' => __( 'Disable color palettes', 'bmfbe' ),
					),
					array(
						'name'  => 'disable_custom_gradients',
						'label' => __( 'Disable custom gradients', 'bmfbe' ),
					),
					array(
						'name'  => 'disable_gradient_presets',
						'label' => __( 'Disable gradient presets', 'bmfbe' ),
					),
				),
			),
			array(
				'name'   => 'typography',
				'label'  => __( 'Typography', 'bmfbe' ),
				'fields' => array(
					array(
						'name'  => 'disable_custom_font_sizes',
						'label' => __( 'Disable custom font sizes', 'bmfbe' ),
					),
					array(
						'name'  => 'disable_font_sizes',
						'label' => __( 'Disable font sizes', 'bmfbe' ),
					),
				),
			),
			array(
				'name'   => 'advanced',
				'label'  => __( 'Advanced', 'bmfbe' ),
				'fields' => array(
					array(
						'name'  => 'limit_access_by_post_type',
						'label' => __( 'Limit access by post type', 'bmfbe' ),
					),
					array(
						'name'  => 'limit_access_by_user_group',
						'label' => __( 'Limit access by user group', 'bmfbe' ),
					),
					array(
						'name'  => 'supports_override',
						'label' => __( 'Override supports', 'bmfbe' ),
					),
					array(
						'name'  => 'supports',
						'label' => __( 'Supports', 'bmfbe' ),
					),
				),
			),
		);

		// TODO: filter sections and fields with current version of WordPress or Gutenberg plugin.

		return $sections;
	}

	/**
	 * Get available supports from global settings.
	 *
	 * @return array Available supports.
	 *
	 * @since 1.0.0
	 */
	protected function available_supports() {
		$schema   = Supports::get_instance()->get_schema();
		$supports = array_keys( $schema );

		// TODO: filter supports with current version of WordPress or Gutenberg plugin.

		return $supports;
	}

	/**
	 * Get available supports fields to display in admin screen.
	 *
	 * @return array Available supports fields.
	 *
	 * @since 1.0.0
	 */
	protected function available_supports_fields() {
		$supports = $this->available_supports();

		$fields = Supports::get_instance()->get_fields();
		$fields = array_intersect_key( $fields, array_flip( $supports ) );

		return $fields;
	}
}
