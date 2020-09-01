<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Pattern settings.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */

namespace BMFBE\Settings;

use WP_Block_Patterns_Registry;
use WP_Error;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Pattern settings.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */
class Pattern_Settings extends Settings {

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
					'disabled'    => array(
						'description' => __( 'Is current pattern disable?', 'bmfbe' ),
						'type'        => 'boolean',
						'required'    => true,
					),
				),
			),
		);
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
				'name'     => true,
				'disabled' => true,
			)
		);

		return $schema;
	}

	/**
	 * List of all registered patterns.
	 *
	 * @return array Array of patterns.
	 * @since 1.0.0
	 */
	protected function get_all_registered() {
		$patterns = array();
		$settings = $this->get_settings();

		$summarized_settings = array();
		foreach ( $settings as $pattern ) {
			$summarized_settings[ $pattern['name'] ] = isset( $pattern['disabled'] ) ? $pattern['disabled'] : false;
		}

		foreach ( WP_Block_Patterns_Registry::get_instance()->get_all_registered() as $pattern ) {
			$patterns[] = array(
				'name'        => $pattern['name'],
				'title'       => $pattern['title'],
				'description' => $pattern['description'],
				'categories'  => $pattern['categories'],
				'disabled'    => isset( $summarized_settings[ $pattern['name'] ] ) ? $summarized_settings[ $pattern['name'] ] : false,
			);
		}

		return $patterns;
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

		$patterns = $this->get_all_registered();

		$total = count( $patterns );

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

		$db_pattern = $this->search_pattern( $pattern['name'] );

		$pattern = self::sanitize_params( $pattern, $schema['items']['properties'] );
		$pattern = self::prepare_settings_walker( $pattern, $schema['items']['properties'], $db_pattern );

		// Insert new pattern.
		$inserted = $this->insert_pattern_in_database( $pattern );

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
		$db_pattern = $this->search_pattern( $pattern['name'] );

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
	 * Search pattern with its name.
	 *
	 * @param string $name Unique name of the pattern.
	 *
	 * @return array|null Index and pattern data, null if pattern was not found.
	 * @since 1.0.0
	 */
	protected function search_pattern_by_name( $name ) {
		foreach ( $this->get_all_registered() as $index => $pattern ) {
			if ( $pattern['name'] === $name ) {
				return array(
					'index'   => $index,
					'pattern' => $pattern,
				);
			}
		}

		return null;
	}

	/**
	 * Search pattern with its name.
	 *
	 * @param string $name Unique name of the pattern.
	 *
	 * @return array|null Pattern data, null if pattern was not found.
	 * @since 1.0.0
	 */
	public function search_pattern( $name ) {
		$pattern = $this->search_pattern_by_name( $name );
		if ( null === $pattern ) {
			return null;
		}

		return $pattern['pattern'];
	}

	/**
	 * Search pattern with its name.
	 *
	 * @param string $name Unique name of the pattern.
	 *
	 * @return int|null Index, null if pattern was not found.
	 * @since 1.0.0
	 */
	public function search_pattern_index( $name ) {
		$pattern = $this->search_pattern_by_name( $name );
		if ( is_null( $pattern ) ) {
			return null;
		}

		return $pattern['index'];
	}

	/**
	 * Update/Insert pattern in database.
	 *
	 * @param array $pattern {
	 *     An array of elements that make up a pattern to update or insert.
	 *
	 *     @type string  $name     The name for a pattern is a unique string that identifies a pattern.
	 *     @type boolean $disabled True if pattern is disabled.
	 * }
	 *
	 * @return bool True if pattern was inserted/updated, False otherwise.
	 * @since 1.0.0
	 */
	protected function insert_pattern_in_database( $pattern ) {
		$patterns = $this->get_all_registered();
		$index    = $this->search_pattern_index( $pattern['name'] );

		if ( null === $index ) {
			$patterns[] = $pattern;
		} else {
			$patterns[ $index ] = $pattern;
		}

		$schema = $this->get_update_schema();

		foreach ( $patterns as $kp => $pattern ) {
			$patterns[ $kp ] = array_intersect_key( $pattern, $schema['items']['properties'] );
		}

		$updated = $this->update_db_value( $patterns );

		if ( $updated ) {
			$this->settings = $patterns;
		}

		return $updated;
	}
}
