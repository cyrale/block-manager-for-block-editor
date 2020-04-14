<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Global settings.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */

namespace BMFBE\Settings;

use WP_Error;

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
		// TODO: extends supports: https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#supports-optional.
		$this->schema = array(
			'supports'                   => array(
				'description'       => __( 'Global block supports.', 'bmfbe' ),
				'type'              => array( 'boolean', 'object' ),
				'default'           => false,
				'properties'        => array(
					'align'     => array(
						'description' => __( 'This property adds block controls which allow to change block’s alignment.', 'bmfbe' ),
						'type'        => 'boolean',
						'default'     => false,
					),
					'alignWide' => array(
						'description' => __( 'This property allows to enable wide alignment for your theme.', 'bmfbe' ),
						'type'        => 'boolean',
						'default'     => true,
					),
				),
				'validate_callback' => array( $this, 'validate_supports' ),
			),
			'disable_color_palettes'     => array(
				'description' => __( 'Disable all color palettes.', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_custom_colors'      => array(
				'description' => __( 'Disable custom colors.', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_gradient_presets'   => array(
				'description' => __( 'Disable all gradient presets.', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_custom_gradients'   => array(
				'description' => __( 'Disable custom gradients.', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_font_sizes'         => array(
				'description' => __( 'Disable all font sizes.', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_custom_font_sizes'  => array(
				'description' => __( 'Disable custom font sizes.', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'limit_access_by_post_type'  => array(
				'description' => __( 'Limit access to block by post type.', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'limit_access_by_user_group' => array(
				'description' => __( 'Limit access to block by user group.', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
		);
	}

	/**
	 * Initiate our hooks.
	 *
	 * @since 1.0.0
	 */
	public function hooks() {
	}

	/**
	 * The capability required to use the plugin.
	 *
	 * @return string Capability name.
	 * @since 1.0.0
	 */
	public function capability() {
		return apply_filters( 'bmfbe_capabilty', 'manage_options' );
	}

	/**
	 * Validate value of supports (cf. schema).
	 *
	 * @param mixed $value Value of supports.
	 *
	 * @return true|WP_Error True if supports are validated, WP_Error otherwise.
	 */
	public function validate_supports( $value ) {
		if ( is_bool( $value ) ) {
			if ( true === $value ) {
				return new WP_Error( 'invalid_params', __( "Supports can't be true.", 'bmfbe' ) );
			}

			return true;
		}

		$options = $this->get_schema();

		return self::validate_value_from_schema( $value, $options['supports'], 'supports' );
	}
}
