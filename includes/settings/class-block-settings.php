<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Block settings.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */

namespace BMFBE\Settings;

use BMFBE\Utils\Access;
use BMFBE\Utils\Supports;
use WP_Error;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Block settings.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */
class Block_Settings extends Settings_Multiple {
	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		parent::__construct();

		$this->option_name = 'block_settings';

		// Initialize available options like arguments in Rest API.
		$this->schema = array(
			'description' => __( 'List of supported blocks.', 'bmfbe' ),
			'type'        => 'array',
			'default'     => array(),
			'items'       => array(
				'type'       => 'object',
				'default'    => array(),
				'properties' => array(
					'name'              => array(
						'description'       => __( 'Unique name for the block.', 'bmfbe' ),
						'type'              => 'string',
						'required'          => true,
						'validate_callback' => array( $this, 'validate_name' ),
					),
					'category'          => array(
						'description' => __( 'Category to help users browse and discover blocks.', 'bmfbe' ),
						'type'        => 'string',
						'required'    => true,
					),
					'supports_override' => array(
						'description' => __( 'Override global supports', 'bmfbe' ),
						'type'        => 'boolean',
						'default'     => false,
					),
					'supports'          => array(
						'description'       => __( 'Block supports', 'bmfbe' ),
						'type'              => 'object',
						'properties'        => Supports::get_schema(),
						'validate_callback' => null,
					),
					'styles'            => array(
						'description' => __( 'Block styles can be used to provide alternative styles to block.', 'bmfbe' ),
						'type'        => 'array',
						'default'     => array(),
						'items'       => array(
							'type'       => 'object',
							'default'    => array(),
							'properties' => array(
								'name'      => array(
									'description' => __( 'The name for a style.', 'bmfbe' ),
									'type'        => 'string',
									'required'    => true,
								),
								'isDefault' => array(
									'description' => __( 'Is default style?', 'bmfbe' ),
									'type'        => 'boolean',
									'default'     => false,
								),
								'isActive'  => array(
									'description' => __( 'Is active style?', 'bmfbe' ),
									'type'        => 'boolean',
									'default'     => true,
								),
							),
						),
					),
					'variations'        => array(
						'description' => __(
							'Block’s style variation can be used to provide alternative styles to block.',
							'bmfbe'
						),
						'type'        => 'array',
						'default'     => array(),
						'items'       => array(
							'type'       => 'object',
							'default'    => array(),
							'properties' => array(
								'name'      => array(
									'description' => __( 'The name for a variation.', 'bmfbe' ),
									'type'        => 'string',
									'required'    => true,
								),
								'isDefault' => array(
									'description' => __( 'Is default variation?', 'bmfbe' ),
									'type'        => 'boolean',
									'default'     => false,
								),
								'isActive'  => array(
									'description' => __( 'Is active variation?', 'bmfbe' ),
									'type'        => 'boolean',
									'default'     => true,
								),
							),
						),
					),
					'access'            => Access::get_schema(),
				),
			),
		);
	}

	/**
	 * Retrieves all available options.
	 *
	 * @return array Schema for available options.
	 * @since 1.0.0
	 */
	public function get_schema() {
		$this->schema['items']['properties']['supports']['properties'] = Supports::get_schema();
		$this->schema['items']['properties']['access']                 = Access::get_schema();

		return $this->schema;
	}

	/**
	 * Get categories used to group blocks.
	 *
	 * @return array Categories used to group blocks.
	 * @since 1.0.0
	 */
	public function get_categories() {
		if ( ! function_exists( 'get_block_categories' ) ) {
			require_once( ABSPATH . '/wp-admin/includes/post.php' );
		}

		return get_block_categories( null );
	}

	/**
	 * Validate the name of a block.
	 *
	 * @param mixed $value Name of a block.
	 *
	 * @return true|WP_Error True if name was validated, WP_Error otherwise
	 */
	public function validate_name( $value ) {
		$schema = $this->get_schema();
		$name   = isset( $schema['name'] ) ? $schema['name'] : null;

		$valid_check = self::validate_value_from_schema( $value, $name, 'name' );

		if ( true !== $valid_check ) {
			return $valid_check;
		}

		if ( ! preg_match( '/^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/', $value ) ) {
			return new WP_Error(
				'invalid_block_name',
				__( 'Block names must contain a namespace prefix, include only lowercase alphanumeric characters or dashes, and start with a letter.', 'bmfbe' )
			);
		}

		return true;
	}

	/**
	 * List available blocks, matching the given criteria.
	 *
	 * @param array $args {
	 *                    Optional. Arguments to retrieve blocks.
	 *
	 *     @var int $page     Page to display. Default 1.
	 *     @var int $per_page Number of blocks to display per page. Default 10.
	 * }
	 *
	 * @return array|WP_Error array of blocks
	 *
	 * @since 1.0.0
	 */
	public function get_blocks( $args = array() ) {
		$defaults = array(
			'page'     => 1,
			'per_page' => 10,
		);

		$args = wp_parse_args( $args, $defaults );

		$blocks = $this->get_settings();

		$total     = count( $blocks );
		$max_pages = ceil( $total / (int) $args['per_page'] );

		if ( $args['page'] > $max_pages && $total > 0 ) {
			return new WP_Error(
				'invalid_page_number',
				__( 'The page number requested is larger than the number of pages available.', 'bmfbe' )
			);
		}

		$offset = ( max( 0, (int) $args['page'] - 1 ) ) * (int) $args['per_page'];
		$blocks = array_slice( $blocks, $offset, (int) $args['per_page'] );

		return array(
			'blocks' => $blocks,
			'total'  => $total,
		);
	}

	/**
	 * Insert or update a block.
	 *
	 * @param array $block {
	 *     An array of elements that make up a block to update or insert.
	 *
	 *     @var string $name        the name for a block is a unique string that identifies a block
	 *     @var string $title       the display title for the block
	 *     @var string $description A short description for the block..
	 *     @var string $category    category to help users browse and discover blocks
	 *     @var string $icon        icon to make block easier to identify
	 *     @var array  $keywords    Optional. Aliases that help users discover block while searching.
	 *     @var array  $supports    Optional. Some block supports.
	 *     @var array  $styles      Optional. Block styles can be used to provide alternative styles to block.
	 * }
	 *
	 * @return bool|WP_Error true if block was inserted/updated, False if it was not inserted/updated, WP_Error
	 *                       otherwise
	 *
	 * @since 1.0.0
	 */
	public function insert_block( $block ) {
		$schema = $this->get_schema();

		$valid_check = self::validate_params( $block, $schema['items']['properties'] );
		if ( is_wp_error( $valid_check ) ) {
			return $valid_check;
		}

		$db_block = $this->get_one_db_value( $block['name'] );

		$block = self::sanitize_params( $block, $schema['items']['properties'] );
		$block = self::prepare_settings_walker( $block, $schema['items']['properties'], $db_block );

		// Insert new block.
		$inserted = $this->update_one_db_value( $block['name'], $block );

		if ( false === $inserted ) {
			return $inserted;
		}

		return $block;
	}

	/**
	 * Update a block.
	 *
	 * @param array $block {
	 *     An array of elements that make up a block to update or insert.
	 *
	 *     @var string $name        the name for a block is a unique string that identifies a block
	 *     @var string $title       the display title for the block
	 *     @var string $description A short description for the block..
	 *     @var string $category    category to help users browse and discover blocks
	 *     @var string $icon        icon to make block easier to identify
	 *     @var array  $keywords    Optional. Aliases that help users discover block while searching.
	 *     @var array  $supports    Optional. Some block supports.
	 *     @var array  $styles      Optional. Block styles can be used to provide alternative styles to block.
	 *     @var array  $variations  Optional. Block style variations allow providing alternative styles to existing blocks.
	 * }
	 * @param array $keep {
	 *     An array to mark the attributes whose you want to keep old values.
	 *
	 *     @var bool $styles Keep old styles.
	 * }
	 *
	 * @return bool|WP_Error true if block was updated, False if it was not updated, WP_Error otherwise
	 *
	 * @since 1.0.0
	 */
	public function update_block( $block, $keep = array() ) {
		$db_block = $this->get_one_db_value( $block['name'] );

		if ( null === $db_block ) {
			return new WP_Error(
				'invalid_block_name',
				__( 'Invalid block name.', 'bmfbe' )
			);
		}

		$schema = $this->get_schema();

		$schema['items']['properties']['title']['required']       = false;
		$schema['items']['properties']['description']['required'] = false;
		$schema['items']['properties']['category']['required']    = false;

		$valid_check = self::validate_params( $block, $schema['items']['properties'] );
		if ( is_wp_error( $valid_check ) ) {
			return $valid_check;
		}

		// Supports.
		$supports = $db_block['supports'];
		if ( ! empty( $block['supports'] ) && is_array( $block['supports'] ) ) {
			foreach ( $supports as $name => $s ) {
				if ( ! $s['isActive'] || ! empty( $block['supports'][ $name ]['isActive'] ) ) {
					$supports[ $name ] = array_merge( $s, $block['supports'][ $name ] );
				}
			}
		}

		// Styles.
		$styles = $db_block['styles'];
		if ( ! empty( $block['styles'] ) && is_array( $block['styles'] ) ) {
			$styles = $this->merge_attributes( $styles, $block['styles'], ! empty( $keep['styles'] ) );
		}

		// Variations.
		$variations = $db_block['variations'];
		if ( ! empty( $block['variations'] ) && is_array( $block['variations'] ) ) {
			$variations = $this->merge_attributes( $variations, $block['variations'], ! empty( $keep['variations'] ) );
		}

		// Merge old and new fields with new fields overwriting old ones.
		$block               = array_merge( $db_block, $block );
		$block['supports']   = $supports;
		$block['styles']     = $styles;
		$block['variations'] = $variations;

		return $this->insert_block( $block );
	}

	/**
	 * Delete a block.
	 *
	 * @param string $name Name of the block.
	 *
	 * @return bool|WP_Error True if block was deleted, False if it was not deleted, WP_Error otherwise.
	 *
	 * @since 1.0.0
	 */
	public function delete_block( $name ) {
		$db_block = $this->get_one_db_value( $name );

		if ( null === $db_block ) {
			return new WP_Error(
				'invalid_block_name',
				__( 'Invalid block name.', 'bmfbe' )
			);
		}

		return $this->delete_one_db_value( $name );
	}

	/**
	 * Sort blocks.
	 *
	 * @return array Sorted blocks.
	 * @since 1.0.0
	 */
	protected function sort_settings() {
		if ( ! is_array( $this->settings ) ) {
			return $this->settings;
		}

		// Sort settings by categories and names (core categories and blocks first).
		usort(
			$this->settings,
			function ( $a, $b ) {
				$name_order = array(
					'core/',
					'core-embed/',
				);

				$category_order = array();
				foreach ( $this->get_categories() as $category ) {
					$category_order[] = $category['slug'];
				}

				if ( isset( $a['category'] ) && ! isset( $b['category'] ) ) {
					return 1;
				} elseif ( isset( $a['category'] ) && ! isset( $b['category'] ) ) {
					return -1;
				} elseif ( isset( $a['category'], $b['category'] ) ) {
					$cat_a = array_search( $a['category'], $category_order, true );
					$cat_b = array_search( $b['category'], $category_order, true );

					if ( $cat_a !== $cat_b ) {
						if ( false === $cat_a ) {
							return 1;
						}
						if ( false === $cat_b ) {
							return -1;
						}

						return strcmp( $cat_a, $cat_b );
					}
				}

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

	/**
	 * Merge arr2 into arr1, depending on the name field.
	 *
	 * @param array $arr1 array of attributes.
	 * @param array $arr2 array of attributes.
	 * @param bool  $keep flag to keep old values of attributes.
	 *
	 * @return array merged array of attributes
	 *
	 * @since 1.0.0
	 */
	protected function merge_attributes( $arr1, $arr2, $keep = true ) {
		$merged_arr = array();

		// Reset index of arrays.
		$arr1 = array_values( $arr1 );
		$arr2 = array_values( $arr2 );

		// Simple case, first array is empty.
		if ( empty( $arr1 ) || ! is_array( $arr1 ) ) {
			return is_array( $arr2 ) ? $arr2 : array();
		}

		// Extract names from attributes.
		$arr1_names = array_column( $arr1, 'name' );
		$arr2_names = array_column( $arr2, 'name' );

		$old_names = array_diff( $arr1_names, $arr2_names );
		$new_names = array_diff( $arr2_names, $arr1_names );

		// Old attributes.
		if ( ! empty( $keep ) ) {
			foreach ( $old_names as $name ) {
				$key = array_search( $name, $arr1_names, true );

				if ( false !== $key ) {
					$merged_arr[] = $arr1[ $key ];
				}
			}
		}

		// Merge attributes.
		foreach ( $arr1_names as $key1 => $name ) {
			$key2 = array_search( $name, $arr2_names, true );

			if ( false !== $key2 ) {
				$merged_arr[] = array_merge( $arr1[ $key1 ], $arr2[ $key2 ] );
			}
		}

		// New attributes.
		foreach ( $new_names as $name ) {
			$key = array_search( $name, $arr2_names, true );

			if ( false !== $key ) {
				$merged_arr[] = $arr2[ $key ];
			}
		}

		return $merged_arr;
	}
}
