<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Global settings.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */

namespace BMFBE\Settings;

use BMFBE\Utils\Supports;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Global settings.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */
class Global_Settings extends Settings {
	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		parent::__construct();

		$this->option_name = 'global_settings';

		// Initialize available options like arguments in Rest API.
		$this->schema = array(
			'disable_fullscreen'          => array(
				'description' => __( 'Disable fullscreen mode', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_block_directory'     => array(
				'description' => __( 'Disable block directory', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_block_patterns'      => array(
				'description' => __( 'Disable block patterns', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_block_based_widgets' => array(
				'description' => __( 'Disable block-based widgets', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'supports_override'           => array(
				'description' => __( 'Override supports', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'supports'                    => array(
				'description'       => __( 'Global block supports', 'bmfbe' ),
				'type'              => 'object',
				'properties'        => Supports::get_schema(),
				'validate_callback' => array( $this, 'validate_supports' ),
			),
			'disable_color_palettes'      => array(
				'description' => __( 'Disable all color palettes', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_custom_colors'       => array(
				'description' => __( 'Disable custom colors', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_gradient_presets'    => array(
				'description' => __( 'Disable all gradient presets', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_custom_gradients'    => array(
				'description' => __( 'Disable custom gradients', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_font_sizes'          => array(
				'description' => __( 'Disable all font sizes', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_custom_font_sizes'   => array(
				'description' => __( 'Disable custom font sizes', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'limit_access_by_section'     => array(
				'description' => __( 'Limit access to block by post type or section', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'limit_access_by_user_group'  => array(
				'description' => __( 'Limit access to block by user group', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
		);
	}

	/**
	 * Retrieves all available options.
	 *
	 * @return array Schema for available options.
	 * @since 1.0.0
	 */
	public function get_schema() {
		$this->schema['supports']['properties'] = Supports::get_schema();

		return $this->schema;
	}

	/**
	 * The capability required to use the plugin.
	 *
	 * @return string Capability name
	 *
	 * @since 1.0.0
	 */
	public function capability() {
		return apply_filters( 'bmfbe_capabilty', 'manage_options' );
	}
}
