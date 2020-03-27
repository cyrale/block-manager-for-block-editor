<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Global settings.
 *
 * @since   1.0.0
 * @package BMFBE\Settings
 */

namespace BMFBE\Settings;

use BMFBE\Plugin;
use Exception;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Global settings.
 *
 * @since 1.0.0
 */
class Global_Settings extends Settings {
	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param Plugin $plugin Main plugin object.
	 *
	 * @throws Exception Throws an Exception if option name is not defined.
	 */
	public function __construct( $plugin ) {
		parent::__construct( $plugin );

		$this->option_name   = 'bfmbe_global_settings';
		$this->default_value = array(
			'disable_color_palette'      => true,
			'disable_custom_colors'      => false,
			'disable_font_sizes'         => true,
			'disable_custom_font_sizes'  => false,
			'limit_access_by_user_group' => false,
			'limit_access_by_post_type'  => false,
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
	 * @return array
	 */
	protected function sanitize_settings() {
		if ( ! is_array( $this->settings ) ) {
			return array();
		}

		$this->settings = wp_parse_args( $this->settings, $this->default_value );

		return $this->settings;
	}

	/**
	 * The capability required to use the plugin.
	 *
	 * @return string Capability name.
	 */
	public function capability() {
		return apply_filters( 'bmfbe_capabilty', 'manage_options' );
	}

	/**
	 * Magic getter for our object.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $field Field to get.
	 *
	 * @return mixed         Value of the field.
	 * @throws Exception     Throws an exception if the field is invalid.
	 */
	public function __get( $field ) {
		switch ( $field ) {
			case 'settings':
				return $this->$field;
			default:
				throw new Exception( 'Invalid ' . __CLASS__ . ' property: ' . $field );
		}

	}
}
