<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Pattern settings.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */

namespace BMFBE\Settings;

use BMFBE\Utils\Access;
use WP_Block_Patterns_Registry;
use WP_Block_Pattern_Categories_Registry;
use WP_Error;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Pattern settings.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */
class Pattern_Settings extends Settings_Multiple {
	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		parent::__construct();

		$this->option_name = 'pattern_settings';

		// Initialize available options like arguments in Rest API.
		$this->schema = array(
			'description' => __( 'List of patterns', 'bmfbe' ),
			'type'        => 'array',
			'default'     => array(),
			'items'       => array(
				'type'       => 'object',
				'default'    => array(),
				'properties' => array(
					'name'        => array(
						'description' => __( 'Name of the pattern', 'bmfbe' ),
						'type'        => 'string',
						'default'     => '',
						'required'    => true,
					),
					'title'       => array(
						'description' => __( 'Human-readable title of the pattern', 'bmfbe' ),
						'type'        => 'string',
						'default'     => '',
					),
					'description' => array(
						'description' => __( 'Description of the pattern', 'bmfbe' ),
						'type'        => 'string',
						'default'     => '',
					),
					'categories'  => array(
						'description' => __( 'List of pattern categories', 'bmfbe' ),
						'type'        => 'array',
						'default'     => array(),
						'items'       => array(
							'type' => 'string',
						),
					),
					'access'      => Access::get_schema(),
				),
			),
		);
	}

	/**
	 * Get categories used to group patterns.
	 *
	 * @return array Categories used to group patterns.
	 * @since 1.0.0
	 */
	public function get_categories() {
		return WP_Block_Pattern_Categories_Registry::get_instance()->get_all_registered();
	}

	/**
	 * Retrieves all available options.
	 *
	 * @return array Schema for available options.
	 * @since 1.0.0
	 */
	public function get_schema() {
		$schema = $this->schema;

		$schema['items']['properties']['access'] = Access::get_schema();

		return $schema;
	}

		/**
		 * Retrieves all available options used in update.
		 *
		 * @return array Schema for available options used in update.
		 * @since 1.0.0
		 */
	public function get_update_schema() {
		$schema = $this->get_schema();

		// Keep only name and disable properties.
		$schema['items']['properties'] = array_intersect_key(
			$schema['items']['properties'],
			array(
				'name'   => true,
				'access' => true,
			)
		);

		return $schema;
	}

	/**
	 * Get all options from database.
	 *
	 * @return mixed Value stored in database.
	 * @since 1.0.0
	 */
	protected function get_db_value() {
		$value    = array();
		$db_value = parent::get_db_value();

		$summarized_value = array();
		foreach ( $db_value as $pattern ) {
			$summarized_value[ $pattern['name'] ] = $pattern;
		}

		foreach ( WP_Block_Patterns_Registry::get_instance()->get_all_registered() as $pattern ) {
			$p = array(
				'name'        => $pattern['name'],
				'title'       => $pattern['title'],
				'description' => $pattern['description'],
				'categories'  => $pattern['categories'],
			);

			if ( isset( $summarized_value[ $pattern['name'] ] ) ) {
				$p = array_merge( $p, $summarized_value[ $pattern['name'] ] );
			}

			$value[] = $p;
		}

		// Delete old patterns.
		$db_names = array_column( $db_value, 'name' );
		$names    = array_column( $value, 'name' );

		foreach ( array_diff( $db_names, $names ) as $name ) {
			$this->delete_pattern( $name );
		}

		return $value;
	}

	/**
	 * Get one option from database.
	 *
	 * @param string $name Name of the settings.
	 *
	 * @return array|null Option value, Null if not exists.
	 * @since 1.0.0
	 */
	public function get_one_db_value( $name ) {
		foreach ( WP_Block_Patterns_Registry::get_instance()->get_all_registered() as $pattern ) {
			if ( $name === $pattern['name'] ) {
				$p = array(
					'name'        => $pattern['name'],
					'title'       => $pattern['title'],
					'description' => $pattern['description'],
					'categories'  => $pattern['categories'],
				);

				$db_value = get_option( $this->option_prefix() . $name, null );
				if ( null !== $db_value ) {
					return array_merge( $p, $db_value );
				}

				return $p;
			}
		}

		return null;
	}

	/**
	 * List available patterns.
	 *
	 * @param array $args {
	 *     Optional. Arguments to retrieve patterns.
	 *
	 *     @type int $page     Page to display. Default 1.
	 *     @type int $per_page Number of patterns to display per page. Default 10.
	 * }
	 *
	 * @return array|WP_Error Array of patterns.
	 * @since 1.0.0
	 */
	public function get_patterns( $args = array() ) {
		$defaults = array(
			'page'     => 1,
			'per_page' => 10,
		);

		$args = wp_parse_args( $args, $defaults );

		$patterns = $this->get_settings();

		$total     = count( $patterns );
		$max_pages = ceil( $total / (int) $args['per_page'] );

		if ( $args['page'] > $max_pages && $total > 0 ) {
			return new WP_Error(
				'invalid_page_number',
				__( 'The page number requested is larger than the number of pages available.', 'bmfbe' )
			);
		}

		$offset   = ( max( 0, (int) $args['page'] - 1 ) ) * (int) $args['per_page'];
		$patterns = array_slice( $patterns, $offset, (int) $args['per_page'] );

		return array(
			'patterns' => $patterns,
			'total'    => $total,
		);
	}

	/**
	 * Get one pattern by name.
	 *
	 * @param string $name Name of searched pattern.
	 *
	 * @return array|WP_Error Found pattern.
	 * @since 1.0.0
	 */
	public function get_pattern( $name ) {
		$db_pattern = $this->get_one_db_value( $name );

		if ( null === $db_pattern ) {
			return new WP_Error(
				'invalid_pattern_name',
				__( 'Invalid pattern name.', 'bmfbe' )
			);
		}

		$schema = $this->get_schema();

		return $this->prepare_settings( $db_pattern, $schema['items']['properties'] );
	}

	/**
	 * Insert or update a pattern.
	 *
	 * @param array $pattern {
	 *     An array of elements that make up a pattern to update or insert.
	 *
	 *     @type string  $name     The name for a pattern is a unique string that identifies a pattern.
	 *     @type boolean $disabled True if pattern is disabled.
	 * }
	 *
	 * @return WP_Error|bool True if pattern was inserted/updated, False if it was not inserted/updated, WP_Error
	 *                       otherwise.
	 * @since 1.0.0
	 */
	public function insert_pattern( $pattern ) {
		$schema = $this->get_update_schema();

		$valid_check = self::validate_params( $pattern, $schema['items']['properties'] );
		if ( is_wp_error( $valid_check ) ) {
			return $valid_check;
		}

		$db_pattern = $this->get_one_db_value( $pattern['name'] );

		$pattern = self::sanitize_params( $pattern, $schema['items']['properties'] );
		$pattern = self::prepare_settings_walker( $pattern, $schema['items']['properties'], $db_pattern );

		// Insert new pattern.
		$inserted = $this->update_one_db_value( $pattern['name'], $pattern );

		if ( false === $inserted ) {
			return $inserted;
		}

		return $pattern;
	}

	/**
	 * Update a pattern.
	 *
	 * @param array $pattern {
	 *     An array of elements that make up a pattern to update or insert.
	 *
	 *     @type string  $name     The name for a pattern is a unique string that identifies a pattern.
	 *     @type boolean $disabled True if pattern is disabled.
	 * }
	 *
	 * @return WP_Error|bool True if pattern was updated, False if it was not updated, WP_Error otherwise.
	 * @since 1.0.0
	 */
	public function update_pattern( $pattern ) {
		$db_pattern = $this->get_one_db_value( $pattern['name'] );

		if ( null === $db_pattern ) {
			return new WP_Error(
				'invalid_pattern_name',
				__( 'Invalid pattern name.', 'bmfbe' )
			);
		}

		$schema = $this->get_update_schema();

		$valid_check = self::validate_params( $pattern, $schema['items']['properties'] );
		if ( is_wp_error( $valid_check ) ) {
			return $valid_check;
		}

		return $this->insert_pattern( $pattern );
	}

	/**
	 * Delete a pattern.
	 *
	 * @param string $name Name of the pattern.
	 *
	 * @return bool|WP_Error True if pattern was deleted, False if it was not deleted, WP_Error otherwise.
	 * @since 1.0.0
	 */
	public function delete_pattern( $name ) {
		$db_pattern = $this->get_one_db_value( $name );

		if ( null === $db_pattern ) {
			return new WP_Error(
				'invalid_pattern_name',
				__( 'Invalid pattern name.', 'bmfbe' )
			);
		}

		return $this->delete_one_db_value( $name );
	}

	/**
	 * Sort patterns.
	 *
	 * @return array Sorted patterns.
	 * @since 1.0.0
	 */
	protected function sort_settings() {
		if ( ! function_exists( 'get_block_categories' ) ) {
			require_once( ABSPATH . '/wp-admin/includes/post.php' );
		}

		// Sort settings by names (core patterns first).
		usort(
			$this->settings,
			function ( $a, $b ) {
				$name_order = array(
					'core/',
				);

				$name_a = array_search( substr( $a['name'], 0, strpos( $a['name'], '/' ) + 1 ), $name_order, true );
				$name_b = array_search( substr( $b['name'], 0, strpos( $b['name'], '/' ) + 1 ), $name_order, true );

				if ( $name_a !== $name_b ) {
					if ( false === $name_a ) {
						return 1;
					}
					if ( false === $name_b ) {
						return -1;
					}

					return $name_a - $name_b;
				}

				return strcmp( $a['name'], $b['name'] );
			}
		);

		return $this->settings;
	}
}
