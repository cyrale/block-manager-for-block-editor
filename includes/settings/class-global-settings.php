<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Global settings.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */

namespace BMFBE\Settings;

use BMFBE\Plugin;
use Exception;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Global settings.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */
class Global_Settings extends Settings {
	/**
	 * Defined options.
	 *
	 * @var array
	 * @since 1.0.0
	 */
	protected $options = array();

	/**
	 * Constructor.
	 *
	 * @param Plugin $plugin Main plugin object.
	 *
	 * @throws Exception Throws an Exception if option name is not defined.
	 * @since 1.0.0
	 */
	public function __construct( $plugin ) {
		parent::__construct( $plugin );

		// Initialize available options like arguments in Rest API.
		$this->options = array(
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

		$this->option_name   = 'bmfbe_global_settings';
		$this->default_value = array_map(
			function( $option ) {
				return $option['default'];
			},
			$this->options
		);

		$this->load();
	}

	/**
	 * Initiate our hooks.
	 *
	 * @since 1.0.0
	 */
	public function hooks() {
	}

	/**
	 * Sanitize settings after load.
	 *
	 * @return array Sanitized settings.
	 * @since 1.0.0
	 */
	protected function sanitize_settings() {
		if ( ! is_array( $this->settings ) ) {
			return array();
		}

		$settings = wp_parse_args( $this->settings, $this->default_value );

		$filtered_settings = array();

		foreach ( $this->options as $name => $schema ) {
			// Default value.
			$filtered_settings[ $name ] = null;
			if ( isset( $schema['default'] ) ) {
				$filtered_settings[ $name ] = $schema['default'];
			}

			// Pass undefined values.
			if ( ! isset( $settings[ $name ] ) ) {
				continue;
			}

			// Sanitize value.
			if ( isset( $schema['type'] ) && 'boolean' === $schema['type'] ) {
				$filtered_settings[ $name ] = ! empty( $settings[ $name ] );
			}
		}

		$this->settings = $filtered_settings;

		return $this->settings;
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
	 * Retrieves all available options.
	 *
	 * @return array All available options.
	 * @since 1.0.0
	 */
	public function get_options() {
		return $this->options;
	}

	/**
	 * Retrieves all settings.
	 *
	 * @return array Value of settings.
	 * @throws Exception Throws an Exception if option name is not defined.
	 * @since 1.0.0
	 */
	public function get_settings() {
		return $this->load();
	}

	/**
	 * Updates settings.
	 *
	 * @param array $settings Updated values for settings.
	 *
	 * @return bool True if settings were updated, False otherwise.
	 * @throws Exception Throws an Exception if option name is not defined.
	 * @since 1.0.0
	 */
	public function update_settings( $settings ) {
		$prepared_settings = array();

		foreach ( $this->options as $name => $schema ) {
			// Default value.
			$prepared_settings[ $name ] = null;
			if ( isset( $schema['default'] ) ) {
				$prepared_settings[ $name ] = $schema['default'];
			}

			// Pass not updated value.
			if ( ! isset( $settings[ $name ] ) ) {
				continue;
			}

			// Test types and update value.
			if ( isset( $schema['type'] ) && 'boolean' === $schema['type'] && is_bool( $settings[ $name ] ) ) {
				$prepared_settings[ $name ] = $settings[ $name ];
			}
		}

		$this->settings = $prepared_settings;

		return $this->save();
	}
}
