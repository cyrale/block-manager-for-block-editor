<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Global settings.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */

namespace BMFBE\Settings;

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

		$supports_schema = array(
			'type'       => 'object',
			'properties' => array(
				'isActive' => array(
					'description' => __( 'Is current support active?', 'bmfbe' ),
					'type'        => 'boolean',
					'default'     => false,
				),
				'value'    => array(
					'description' => __( 'Value of current support', 'bmfbe' ),
					'type'        => 'boolean',
				),
			),
		);

		// Initialize available options like arguments in Rest API.
		$this->schema = array(
			'latest_detection'           => array(
				'description' => __( 'Date of the latest detection', 'bmfbe' ),
				'type'        => 'integer',
				'default'     => 0,
			),
			'disable_fullscreen'         => array(
				'description' => __( 'Disable fullscreen mode', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_block_directory'    => array(
				'description' => __( 'Disable block directory', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_block_patterns'     => array(
				'description' => __( 'Disable block patterns', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'supports_override'          => array(
				'description' => __( 'Override supports', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'supports'                   => array(
				'description'       => __( 'Global block supports', 'bmfbe' ),
				'type'              => 'object',
				'properties'        => array(
					'align'              => array_merge_recursive(
						$supports_schema,
						array(
							'description' => __(
								'This property adds block controls which allow to change block’s alignment.',
								'bmfbe'
							),
							'properties'  => array(
								'value' => array(
									'type'    => array( 'boolean', 'array' ),
									'default' => false,
									'items'   => array(
										'type' => 'string',
										'enum' => array( 'left', 'center', 'right', 'wide', 'full' ),
									),
								),
							),
						)
					),
					'defaultStylePicker' => array_merge_recursive(
						$supports_schema,
						array(
							'description' => __(
								'This property allow the style picker to be shown.',
								'bmfbe'
							),
							'properties'  => array(
								'value' => array( 'default' => true ),
							),
						)
					),
					'alignWide'          => array_merge_recursive(
						$supports_schema,
						array(
							'description' => __(
								'This property allows to enable wide alignment for your theme.',
								'bmfbe'
							),
							'properties'  => array(
								'value' => array( 'default' => true ),
							),
						)
					),
					'anchor'             => array_merge_recursive(
						$supports_schema,
						array(
							'description' => __(
								'This property adds a field to define an id for the block and a button to copy the direct link.',
								'bmfbe'
							),
							'properties'  => array(
								'value' => array( 'default' => false ),
							),
						)
					),
					'customClassName'    => array_merge_recursive(
						$supports_schema,
						array(
							'description' => __(
								'This property adds a field to define a custom className for the block’s wrapper.',
								'bmfbe'
							),
							'properties'  => array(
								'value' => array( 'default' => false ),
							),
						)
					),
					'className'          => array_merge_recursive(
						$supports_schema,
						array(
							'description' => __(
								'This property remove the support for the generated className.',
								'bmfbe'
							),
							'properties'  => array(
								'value' => array( 'default' => true ),
							),
						)
					),
					'html'               => array_merge_recursive(
						$supports_schema,
						array(
							'description' => __(
								'This property remove the ability to edit a block’s markup.',
								'bmfbe'
							),
							'properties'  => array(
								'value' => array( 'default' => true ),
							),
						)
					),
					'inserter'           => array_merge_recursive(
						$supports_schema,
						array(
							'description' => __(
								'Hide a block so that it can only be inserted programmatically.',
								'bmfbe'
							),
							'properties'  => array(
								'value' => array( 'default' => true ),
							),
						)
					),
					'multiple'           => array_merge_recursive(
						$supports_schema,
						array(
							'description' => __(
								'A non-multiple block can be inserted into each post, one time only.',
								'bmfbe'
							),
							'properties'  => array(
								'value' => array( 'default' => true ),
							),
						)
					),
					'reusable'           => array_merge_recursive(
						$supports_schema,
						array(
							'description' => __(
								'This property remove the ability to convert a block into a reusable block.',
								'bmfbe'
							),
							'properties'  => array(
								'value' => array( 'default' => true ),
							),
						)
					),
				),
				'validate_callback' => array( $this, 'validate_supports' ),
			),
			'disable_color_palettes'     => array(
				'description' => __( 'Disable all color palettes', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_custom_colors'      => array(
				'description' => __( 'Disable custom colors', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_gradient_presets'   => array(
				'description' => __( 'Disable all gradient presets', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_custom_gradients'   => array(
				'description' => __( 'Disable custom gradients', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_font_sizes'         => array(
				'description' => __( 'Disable all font sizes', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'disable_custom_font_sizes'  => array(
				'description' => __( 'Disable custom font sizes', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'limit_access_by_post_type'  => array(
				'description' => __( 'Limit access to block by post type', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
			'limit_access_by_user_group' => array(
				'description' => __( 'Limit access to block by user group', 'bmfbe' ),
				'type'        => 'boolean',
				'default'     => false,
			),
		);
	}

	/**
	 * The capability required to use the plugin.
	 *
	 * @return string capability name
	 *
	 * @since 1.0.0
	 */
	public function capability() {
		return apply_filters( 'bmfbe_capabilty', 'manage_options' );
	}
}
