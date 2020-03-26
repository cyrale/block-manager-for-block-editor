<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Global settings.
 *
 * @since   1.0.0
 * @package BMFBE\Settings
 */

namespace BMFBE\Settings;

use BMFBE\Plugin;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Global settings.
 *
 * @since 1.0.0
 */
class Global_Settings extends Settings {
	/**
	 * Constructor.
	 *
	 * @param Plugin $plugin Main plugin object.
	 *
	 * @since 1.0.0
	 */
	public function __construct( $plugin ) {
		parent::__construct( $plugin );

		$this->option_name   = 'bfmbe_global_settings';
		$this->default_value = array();
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
}
