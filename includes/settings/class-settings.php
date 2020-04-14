<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Manage settings.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */

namespace BMFBE\Settings;

use Exception;
use WP_Error;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Manage settings.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */
abstract class Settings {
	/**
	 * Prefix for the name of the option to store settings.
	 *
	 * @var string
	 * @since 1.0.0
	 */
	protected $prefix_option_name = 'bmfbe_';

	/**
	 * Name of the option to store settings.
	 *
	 * @var string
	 * @since 1.0.0
	 */
	protected $option_name = '';

	/**
	 * Available options like arguments in Rest API.
	 *
	 * @var array
	 * @since 1.0.0
	 */
	protected $schema = array();

	/**
	 * Cache settings.
	 *
	 * @var mixed
	 * @since 1.0.0
	 */
	protected $settings;

	/**
	 * Singleton instance of plugin.
	 *
	 * @var Settings
	 * @since 1.0.0
	 */
	private static $single_instances = array();

	/**
	 * Creates or returns an instance of this class.
	 *
	 * @return Settings A single instance of this class.
	 * @throws Exception If plugin not correctly initialized.
	 * @since 1.0.0
	 */
	final public static function get_instance() {
		$called_class = get_called_class();
		if ( !isset( self::$single_instances[ $called_class ] ) ) {
			self::$single_instances[ $called_class ] = new $called_class();
		}

		return self::$single_instances[ $called_class ];
	}

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
	}

	/**
	 * Retrieves all available options.
	 *
	 * @return array Schema for available options.
	 * @since 1.0.0
	 */
	public function get_schema() {
		return $this->schema;
	}

	/**
	 * Retrieves all settings.
	 *
	 * @return array Value of settings.
	 * @since 1.0.0
	 */
	public function get_settings() {
		if ( isset( $this->settings ) ) {
			return $this->settings;
		}

		$settings = $this->get_db_value();
		$settings = $this->prepare_settings( $settings );

		$this->settings = $settings;

		return $this->settings;
	}

	/**
	 * Save settings to database.
	 *
	 * @return bool True if settings were updated, False if they were not updated, WP_Error otherwise.
	 * @since 1.0.0
	 */
	public function update_settings( $settings ) {
		$validation = $this->validate_settings( $settings );
		if ( is_wp_error( $validation ) ) {
			return $validation;
		}

		$settings = $this->sanitize_settings( $settings );
		$settings = $this->prepare_settings_for_database( $settings );

		$option_updated = $this->update_db_value( $settings );

		if ( $option_updated ) {
			$this->settings = $settings;
		}

		return $this->settings;
	}

	/**
	 * Get option where settings were stored from database.
	 *
	 * @return mixed Value stored in database.
	 * @since 1.0.0
	 */
	protected function get_db_value() {
		return get_option( $this->prefix_option_name . $this->option_name, array() );
	}

	/**
	 * Update option where settings were stored in database.
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

		return update_option( $this->prefix_option_name . $this->option_name, $settings, false );
	}

	private static function convert_rest_wp_error( $error ) {
		$converted_error = new WP_Error();

		foreach ( $error->get_error_codes() as $code ) {
			$new_code = preg_replace( '/^rest_/i', '', $code );

			$converted_error->add(
				$new_code,
				$error->get_error_message( $code ),
				$error->get_error_data( $code )
			);
		}

		return $converted_error;
	}

	protected static function concat_properties( $prop1, $prop2 ) {
		if ( empty( $prop1 ) ) {
			return $prop2;
		}

		return $prop1 . '[' . $prop2 . ']';
	}

	protected static function required_params( $params, $schema ) {
		$required_check = self::required_params_walker( $params, $schema );

		if ( ! empty( $required_check ) ) {
			return new WP_Error(
				'missing_param',
				/* translators: %s: List of required parameters. */
				sprintf( __( 'Missing parameter(s): %s', 'bmfbe' ), implode( ', ', $required_check ) )
			);
		}

		return true;
	}

	protected static function required_params_walker( $params, $schema, $property = '' ) {
		$required_params = array();

		if ( ! isset( $schema['type'] ) ) {
			foreach ( $schema as $p => $s ) {
				$required_params = array_merge(
					$required_params,
					self::required_params_walker( $params[ $p ], $s, self::concat_properties( $property, $p ) )
				);
			}
		}

		if ( is_array( $schema['type'] ) ) {
			foreach ( $schema['type'] as $type ) {
				$s         = $schema;
				$s['type'] = $type;

				if ( ( 'array' === $s['type'] || 'object' === $s['type'] ) && true === self::validate_params_walker( $params, $s, $property ) ) {
					$required_params = array_merge(
						$required_params,
						self::required_params_walker( $params, $s, $property )
					);
				}
			}
		}

		if ( isset( $schema['required'] ) && true === $schema['required'] && ( null === $params ) ) {
			$required_params[] = $property;
		} elseif ( 'array' === $schema['type'] ) {
			if ( ! is_null( $params ) ) {
				$params = wp_parse_list( $params );
			}

			// TODO: validate arrays.
			if ( wp_is_numeric_array( $params ) ) {
				foreach ( $params as $index => $p ) {
					$required_params = array_merge(
						$required_params,
						self::required_params_walker( $p, $schema['items'], self::concat_properties( $property, $index ) )
					);
				}
			}

		} elseif ( 'object' === $schema['type'] && ! is_null( $params ) ) {
			foreach ( $schema['properties'] as $p => $s ) {
				$required_params = array_merge(
					$required_params,
					self::required_params_walker( $params[ $p ], $s, self::concat_properties( $property, $p ) )
				);
			}
		}

		return array_unique( $required_params );
	}

	protected static function validate_params( $params, $schema ) {
		// Check required params.
		$required_check = self::required_params( $params, $schema );
		if ( is_wp_error( $required_check ) ) {
			return $required_check;
		}

		// Validate params.
		return self::validate_params_walker( $params, $schema );
	}

	protected static function validate_params_walker( $params, $schema, $property = '' ) {
		if ( ! isset( $schema['type'] ) ) {
			foreach ( $schema as $p => $s ) {
				// No need to validate unset parameters.
				if ( ! isset( $params[ $p ] ) ) {
					continue;
				}

				$valid_check = self::validate_params_walker( $params[ $p ], $s, $p );
				if ( is_wp_error( $valid_check ) ) {
					return $valid_check;
				}
			}
		}

		if ( is_array( $schema['type'] ) ) {
			$valid_error = null;

			foreach ( $schema['type'] as $type ) {
				$s         = $schema;
				$s['type'] = $type;

				$valid_check = self::validate_params_walker( $params, $s, $property );

				if ( null === $valid_error && is_wp_error( $valid_check ) ) {
					$valid_error = $valid_check;
				}

				if ( true ===  $valid_check ) {
					return true;
				}
			}

			if ( is_wp_error( $valid_error ) ) {
				return $valid_error;
			}

			return new WP_Error(
				'invalid_param',
				/* translators: 1: Parameter, 2: List of types. */
				sprintf( __( '%1$s is not of type %2$s.' ), $property, implode( ',', $schema['type'] ) )
			);
		}

		$valid_check = true;

		if ( isset( $schema['validate_callback'] ) && is_callable( $schema['validate_callback'] ) ) {
			$valid_check = call_user_func( $schema['validate_callback'], $params, null, $property );
		} elseif ( 'array' === $schema['type'] ) {
			if ( ! is_null( $params ) ) {
				$params = wp_parse_list( $params );
			}

			if ( ! wp_is_numeric_array( $params ) ) {
				/* translators: 1: Parameter, 2: Type name. */
				return new WP_Error( 'invalid_param', sprintf( __( '%1$s is not of type %2$s.' ), $property, 'array' ) );
			}

			foreach ( $params as $index => $p ) {
				$valid_check = self::validate_params_walker( $p, $schema['items'], self::concat_properties( $property, $index ) );
				if ( is_wp_error( $valid_check ) ) {
					return $valid_check;
				}
			}

		} else {
			$valid_check = self::validate_value_from_schema( $params, $schema, $property );

			if ( false === $valid_check ) {
				$valid_check = new WP_Error(
					'invalid_param',
					/* translators: %s: Invalid parameter. */
					sprintf( __( 'Invalid parameter: %s' ), $property )
				);
			}
		}

		return $valid_check;
	}

	protected static function validate_value_from_schema( $value, $schema, $param = '' ) {
		$valid_check = rest_validate_value_from_schema( $value, $schema, $param );
		if ( is_wp_error( $valid_check ) ) {
			return self::convert_rest_wp_error( $valid_check );
		}

		return true;
	}

	protected static function sanitize_params( $params, $schema ) {
		return self::sanitize_params_walker( $params, $schema );
	}

	protected static function sanitize_params_walker( $params, $schema, $property = '' ) {
		if ( ! isset( $schema['type'] ) ) {
			$sanitized_values = array();

			foreach ( $schema as $p => $s ) {
				// No need to validate unset parameters.
				if ( ! isset( $params[ $p ] ) ) {
					continue;
				}

				$sanitized_value = self::sanitize_params_walker( $params[ $p ], $s, $p );
				if ( is_wp_error( $sanitized_value ) ) {
					return $sanitized_value;
				}

				$sanitized_values[ $p ] = $sanitized_value;
			}

			return $sanitized_values;
		}

		if ( isset( $schema['sanitize_callback'] ) && is_callable( $schema['sanitize_callback'] ) ) {
			return call_user_func( $schema['sanitize_callback'], $params, null, $property );
		}

		return self::sanitize_value_from_schema( $params, $schema );
	}

	protected static function sanitize_value_from_schema( $value, $schema ) {
		$sanitized_value = rest_sanitize_value_from_schema( $value, $schema );
		if ( is_wp_error( $sanitized_value ) ) {
			return self::convert_rest_wp_error( $sanitized_value );
		}

		return $sanitized_value;
	}

	protected static function prepare_settings_walker( $settings, $schema, $database_values = null ) {
		if ( ! isset( $schema['type'] ) ) {
			$prepared_settings = array();

			foreach ( $schema as $p => $s ) {
				$db_value = ( is_array( $database_values ) && isset( $database_values[ $p ] ) )
					? $database_values[ $p ]
					: null;
				$value    = isset( $settings[ $p ] ) ? $settings[ $p ] : null;

				$prepared_value = self::prepare_settings_walker( $value, $s, $db_value );

				if ( ! is_null( $prepared_value ) ) {
					$prepared_settings[ $p ] = $prepared_value;
				}
			}

			return $prepared_settings;
		}

		$value = null;

		if (
			is_array( $settings )
			&& (
				'object' === $schema['type']
				|| ( is_array( $schema['type'] ) && in_array( 'object', $schema['type'], true ) )
			)
		) {
			$value = self::prepare_settings_walker( $settings, $schema['properties'], $database_values );
		} elseif (
			is_array( $settings )
			&& (
				'array' === $schema['type']
				|| ( is_array( $schema['type'] ) && in_array( 'array', $schema['type'], true ) )
			)
		) {
			$value = array();

			foreach ( $settings as $index => $s ) {
				$db_value = ( is_array( $database_values ) && isset( $database_values[ $index ] ) )
					? $database_values[ $index ]
					: null;
				$value[]  = self::prepare_settings_walker( $s, $schema['items'], $db_value );
			}
		} elseif ( ! is_null( $settings ) ) {
			$value = $settings;
		} elseif ( ! is_null( $database_values ) ) {
			$value = $database_values;
		} elseif ( isset( $schema['default'] ) ) {
			$value = $schema['default'];
		}

		return $value;
	}

	protected function validate_settings( $settings ) {
		return self::validate_params( $settings, $this->get_schema() );
	}

	/**
	 * Sanitize settings.
	 *
	 * @return mixed Sanitized settings.
	 * @since 1.0.0
	 */
	protected function sanitize_settings( $settings ) {
		return self::sanitize_params( $settings, $this->get_schema() );
	}

	protected function prepare_settings( $settings ) {
		return self::prepare_settings_walker( $settings, $this->get_schema() );
	}

	protected function prepare_settings_for_database( $settings ) {
		return self::prepare_settings_walker( $settings, $this->get_schema(), $this->get_settings() );
	}
}
