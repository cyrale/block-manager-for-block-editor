<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Manage settings.
 *
 * @since   1.0.0
 *
 * @package BMFBE\Settings
 */

namespace BMFBE\Settings;

use BMFBE\Interfaces\WP_Plugin_Class;
use BMFBE\Plugin;
use Exception;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Manage settings.
 *
 * @since   1.0.0
 *
 * @package BMFBE\Settings
 */
abstract class Settings implements WP_Plugin_Class {
	/**
	 * Parent plugin class.
	 *
	 * @since 1.0.0
	 *
	 * @var Plugin
	 */
	protected $plugin = null;

	/**
	 * Name of the option to store settings.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $option_name = '';

	/**
	 * Cache settings.
	 *
	 * @since 1.0.0
	 *
	 * @var mixed
	 */
	protected $settings;

	/**
	 * Default value of settings.
	 *
	 * @since 1.0.0
	 *
	 * @var mixed
	 */
	protected $default_value = null;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param Plugin $plugin Main plugin object.
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
	}

	/**
	 * Load settings from database.
	 *
	 * @since 1.0.0
	 *
	 * @return mixed
	 * @throws Exception
	 */
	protected function load() {
		if ( isset( $this->settings ) ) {
			return $this->settings;
		}

		$this->settings = $this->get_option();
		$this->settings = $this->sanitize_settings();

		return $this->settings;
	}

	/**
	 * Save settings to database.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 * @throws Exception
	 */
	protected function save() {
		$db_settings = $this->get_option();

		// Test if settings have to be updated.
		if ( $this->settings === $db_settings
			|| maybe_serialize( $this->settings ) === maybe_serialize( $db_settings ) ) {
			return true;
		}

		return $this->update_option();
	}

	/**
	 * Get option where settings were stored from database.
	 *
	 * @return mixed
	 * @throws Exception
	 */
	protected function get_option() {
		if ( empty( $this->option_name ) ) {
			throw new Exception( 'Name of the option not defined.' );
		}

		return get_option( $this->option_name, $this->default_value );
	}

	/**
	 * Update option where settings were stored from database.
	 *
	 * @return bool
	 * @throws Exception
	 */
	protected function update_option() {
		if ( empty( $this->option_name ) ) {
			throw new Exception( 'Name of the option not defined.' );
		}

		return update_option( $this->option_name, $this->settings, false );
	}

	/**
	 * Sanitize settings after load.
	 *
	 * @return mixed
	 */
	abstract protected function sanitize_settings();
}
