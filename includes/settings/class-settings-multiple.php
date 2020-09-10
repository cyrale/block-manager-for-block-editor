<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Manage settings registered in multiple options.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */

namespace BMFBE\Settings;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Manage settings registered in multiple options.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */
abstract class Settings_Multiple extends Settings {
	/**
	 * Retrieve one settings with its name.
	 *
	 * @param string $name Name of settings.
	 *
	 * @return mixed Value of the settings.
	 * @since 1.0.0
	 */
	public function get_one_settings( $name ) {
		if ( empty( $name ) ) {
			return null;
		}

		$schema = $this->get_schema();

		$db_value = $this->get_one_db_value( $name );
		if ( null !== $db_value ) {
			$db_value = $this->prepare_settings( $db_value, $schema['items']['properties'] );
		}

		return $db_value;
	}

	/**
	 * Save one settings to database.
	 *
	 * @param string $name  Name of settings.
	 * @param mixed  $value New value of settings.
	 *
	 * @return mixed|WP_Error Updated settings, WP_Error otherwise.
	 * @since 1.0.0
	 */
	public function update_one_settings( $name, $value ) {
		$result = $this->update_one_db_value( $name, $value );
		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return $this->get_one_settings( $name );
	}

	/**
	 * Get prefix for all options.
	 *
	 * @return string
	 * @since 1.0.0
	 */
	protected function option_prefix() {
		return $this->prefix_option_name . $this->option_name . '_';
	}

	/**
	 * Get all options from database.
	 *
	 * @return mixed Value stored in database.
	 * @since 1.0.0
	 */
	protected function get_db_value() {
		global $wpdb;

		$db_value = array();
		$results  = $wpdb->get_results( $wpdb->prepare( "SELECT option_name, option_value FROM {$wpdb->options} WHERE option_name LIKE %s", $this->option_prefix() . '%' ), OBJECT_K );

		foreach ( $results as $option_name => $row ) {
			$value = wp_cache_get( $option_name, 'options' );

			if ( false === $value ) {
				wp_cache_add( $option_name, $row->option_value, 'options' );
			}

			$db_value[] = $this->get_one_db_value( substr( $option_name, strlen( $this->option_prefix() ) ) );
		}

		return $db_value;
	}

	/**
	 * Get one option from database.
	 *
	 * @param string $name Name of the settings.
	 *
	 * @return array|null Option value, Null if not exists.
	 * @since 1.0.0
	 */
	protected function get_one_db_value( $name ) {
		return get_option( $this->option_prefix() . $name, null );
	}

	/**
	 * Update option in database.
	 *
	 * @param array $settings Updated value of settings.
	 *
	 * @return bool True if settings was updated, False otherwise.
	 * @since 1.0.0
	 */
	protected function update_db_value( $settings ) {
		$db_settings = $this->get_db_value();

		// Test if settings have to be updated.
		if ( $settings === $db_settings
			|| maybe_serialize( $settings ) === maybe_serialize( $db_settings ) ) {
			return true;
		}

		foreach ( $settings as $block ) {
			$this->update_one_db_value( $block['name'], $block );
		}

		return true;
	}

	/**
	 * Update one option in database.
	 *
	 * @param string $name  Name of the settings.
	 * @param mixed  $value New value.
	 *
	 * @return bool False if value was not updated and true if value was updated.
	 * @since 1.0.0
	 */
	protected function update_one_db_value( $name, $value ) {
		$db_value = $this->get_one_db_value( $name );

		if ( $value === $db_value
			|| maybe_serialize( $value ) === maybe_serialize( $db_value ) ) {
			return true;
		}

		return update_option( $this->option_prefix() . $name, $value, false );
	}

	/**
	 * Delete one option in database.
	 *
	 * @param string $name Name of the settings.
	 *
	 * @return bool True, if option is successfully deleted. False on failure.
	 * @since 1.0.0
	 */
	protected function delete_one_db_value( $name ) {
		return delete_option( $this->option_prefix() . $name );
	}
}
