<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Block settings.
 *
 * @since 1.0.0
 * @package BMFBE\SettingsPanel
 */

namespace BMFBE\Settings;

use WP_Error;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Block settings.
 *
 * @since 1.0.0
 * @package BMFBE\SettingsPanel
 */
class Block_Settings extends Settings {
	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		parent::__construct();

		$this->option_name = 'block_settings';

		$global_schema = Global_Settings::get_instance()->get_schema();

		$supports = $global_schema['supports'];
		$supports = array_merge(
			$supports,
			array(
				'description'       => __( 'Block supports', 'bmfbe' ),
				'type'              => 'object',
				'validate_callback' => null,
			)
		);

		// Initialize available options like arguments in Rest API.
		$this->schema = array(
			'description' => __( 'List of supported blocks.', 'bmfbe' ),
			'type'        => 'array',
			'default'     => array(),
			'items'       => array(
				'name'              => array(
					'description'       => __( 'Unique name for the block.', 'bmfbe' ),
					'type'              => 'string',
					'required'          => true,
					'validate_callback' => array( $this, 'validate_name' ),
				),
				'title'             => array(
					'description' => __( 'The display title for the block.', 'bmfbe' ),
					'type'        => 'string',
					'required'    => true,
				),
				'description'       => array(
					'description' => __( 'A short description for the block.', 'bmfbe' ),
					'type'        => 'string',
					'required'    => true,
				),
				'category'          => array(
					'description' => __( 'Category to help users browse and discover blocks.', 'bmfbe' ),
					'type'        => 'string',
					'required'    => true,
				),
				'icon'              => array(
					'description' => __( 'Icon to make block easier to identify.', 'bmfbe' ),
					'type'        => 'string',
				),
				'keywords'          => array(
					'description' => __( 'Aliases that help users discover block while searching.', 'bmfbe' ),
					'type'        => 'array',
					'default'     => array(),
					'items'       => array(
						'type' => 'string',
					),
				),
				'supports_override' => array(
					'description' => __( 'Override global supports?', 'bmfbe' ),
					'type'        => 'boolean',
					'default'     => false,
				),
				'supports'          => $supports,
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
							'label'     => array(
								'description' => __( 'The label displayed for a style.', 'bmfbe' ),
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
							'name'        => array(
								'description' => __( 'The name for a variation.', 'bmfbe' ),
								'type'        => 'string',
								'required'    => true,
							),
							'title'       => array(
								'description' => __( 'The title displayed for a variation.', 'bmfbe' ),
								'type'        => 'string',
								'required'    => true,
							),
							'description' => array(
								'description' => __( 'Description of a variation.', 'bmfbe' ),
								'type'        => 'string',
							),
							'icon'        => array(
								'description' => __( 'Icon of a variation.', 'bmfbe' ),
								'type'        => 'string',
							),
							'isDefault'   => array(
								'description' => __( 'Is default variation?', 'bmfbe' ),
								'type'        => 'boolean',
								'default'     => false,
							),
							'isActive'    => array(
								'description' => __( 'Is active variation?', 'bmfbe' ),
								'type'        => 'boolean',
								'default'     => true,
							),
						),
					),
				),
			),
		);
	}

	/**
	 * Validate the name of a block.
	 *
	 * @param mixed $value Name of a block.
	 *
	 * @return true|WP_Error True if name was validated, WP_Error otherwise.
	 */
	public function validate_name( $value ) {
		$schema = $this->get_schema();

		$valid_check = self::validate_value_from_schema( $value, $schema['name'], 'name' );

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
	 * Get option where settings were stored from database.
	 *
	 * @return mixed Value stored in database.
	 * @since 1.0.0
	 */
	protected function get_db_value() {
		$list   = parent::get_db_value();
		$blocks = array();

		foreach ( $list as $name ) {
			$block = get_option( 'bmfbe_block_' . $name, null );

			if ( ! is_null( $block ) ) {
				$blocks[] = $block;
			}
		}

		return self::sort_blocks( $blocks );
	}

	/**
	 * Update option where settings were stored in database.
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

		$list = array();

		foreach ( $settings as $block ) {
			$list[] = $block['name'];
			update_option( 'bmfbe_block_' . $block['name'], $block, false );
		}

		update_option( $this->prefix_option_name . $this->option_name, $list, false );

		return true;
	}

	/**
	 * Sort blocks.
	 *
	 * @param array $blocks Array of blocks.
	 *
	 * @return array Sorted array of blocks.
	 * @since 1.0.0
	 */
	protected static function sort_blocks( $blocks ) {
		// Sort settings by categories and names (core categories and blocks first).
		usort(
			$blocks,
			function( $a, $b ) {
				$name_order = array(
					'core/',
					'core-embed/',
				);

				$category_order = array(
					'common',
					'formatting',
					'layout',
					'widgets',
					'embed',
				);

				$name_a = array_search(
					substr( $a['name'], 0, strpos( $a['name'], '/' ) + 1 ),
					$name_order,
					true
				);
				$name_b = array_search(
					substr( $b['name'], 0, strpos( $b['name'], '/' ) + 1 ),
					$name_order,
					true
				);

				$cat_a = array_search( $a['category'], $category_order, true );
				$cat_b = array_search( $b['category'], $category_order, true );

				if ( $cat_a !== $cat_b ) {
					if ( false === $cat_a ) {
						return 1;
					} elseif ( false === $cat_b ) {
						return -1;
					} else {
						return strcmp( $cat_a, $cat_b );
					}
				} elseif ( $name_a !== $name_b ) {
					if ( false === $name_a ) {
						return 1;
					} elseif ( false === $name_b ) {
						return -1;
					} else {
						return $name_a - $name_b;
					}
				}

				return strcmp( $a['name'], $b['name'] );
			}
		);

		return $blocks;
	}

	/**
	 * List available blocks, matching the given criteria.
	 *
	 * @param array $args {
	 *     Optional. Arguments to retrieve blocks.
	 *
	 *     @type int $page     Page to display. Default 1.
	 *     @type int $per_page Number of blocks to display per page. Default 10.
	 * }
	 *
	 * @return array|WP_Error Array of blocks.
	 * @since 1.0.0
	 */
	public function get_blocks( $args = array() ) {
		$defaults = array(
			'page'     => 1,
			'per_page' => 10,
		);

		$args = wp_parse_args( $args, $defaults );

		$blocks = $this->get_settings();
		$blocks = self::sort_blocks( $blocks );

		$total = count( $blocks );

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
	 *     @type string $name        The name for a block is a unique string that identifies a block.
	 *     @type string $title       The display title for the block.
	 *     @type string $description A short description for the block..
	 *     @type string $category    Category to help users browse and discover blocks.
	 *     @type string $icon        Icon to make block easier to identify.
	 *     @type array  $keywords    Optional. Aliases that help users discover block while searching.
	 *     @type array  $supports    Optional. Some block supports.
	 *     @type array  $styles      Optional. Block styles can be used to provide alternative styles to block.
	 * }
	 *
	 * @return WP_Error|bool True if block was inserted/updated, False if it was not inserted/updated, WP_Error
	 *                        otherwise.
	 * @since 1.0.0
	 */
	public function insert_block( $block ) {
		$schema = $this->get_schema();

		$valid_check = self::validate_params( $block, $schema['items'] );
		if ( is_wp_error( $valid_check ) ) {
			return $valid_check;
		}

		$db_block = $this->search_block( $block['name'] );

		$block = self::sanitize_params( $block, $schema['items'] );
		$block = self::prepare_settings_walker( $block, $schema['items'], $db_block );

		// Insert new block.
		$inserted = $this->insert_block_in_database( $block );

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
	 *     @type string $name        The name for a block is a unique string that identifies a block.
	 *     @type string $title       The display title for the block.
	 *     @type string $description A short description for the block..
	 *     @type string $category    Category to help users browse and discover blocks.
	 *     @type string $icon        Icon to make block easier to identify.
	 *     @type array  $keywords    Optional. Aliases that help users discover block while searching.
	 *     @type array  $supports    Optional. Some block supports.
	 *     @type array  $styles      Optional. Block styles can be used to provide alternative styles to block.
	 *     @type array  $variations  Optional. Block style variations allow providing alternative styles to existing blocks..
	 * }
	 * @param array $keep {
	 *     An array to mark the attributes whose you want to keep old values.
	 *
	 *     @type bool $styles Keep old styles.
	 * }
	 *
	 * @return WP_Error|bool True if block was updated, False if it was not updated, WP_Error otherwise.
	 * @since 1.0.0
	 */
	public function update_block( $block, $keep = array() ) {
		$db_block = $this->search_block( $block['name'] );

		if ( null === $db_block ) {
			return new WP_Error(
				'invalid_block_name',
				__( 'Invalid block name.', 'bmfbe' )
			);
		}

		$schema = $this->get_schema();

		$schema['items']['title']['required']       = false;
		$schema['items']['description']['required'] = false;
		$schema['items']['category']['required']    = false;

		$valid_check = self::validate_params( $block, $schema['items'] );

		if ( is_wp_error( $valid_check ) ) {
			return $valid_check;
		}

		// Supports.
		$supports = $db_block['supports'];
		if ( ! empty( $block['supports'] ) && is_array( $block['supports'] ) ) {
			$supports = array_replace_recursive( $supports, $block['supports'] );
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

		// TODO: Access.

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
	 * @return WP_Error|bool True if block was deleted, False if it was not deleted, Wp_Error otherwise.
	 * @since 1.0.0
	 */
	public function delete_block( $name ) {
		$db_block = $this->search_block( $name );

		if ( null === $db_block ) {
			return new WP_Error(
				'invalid_block_name',
				__( 'Invalid block name.', 'bmfbe' )
			);
		}

		return $this->delete_block_in_database( $name );
	}

	/**
	 * Search block with its name.
	 *
	 * @param string $name Unique name of the block.
	 *
	 * @return array|null Index and block data, null if block was not found.
	 * @since 1.0.0
	 */
	protected function search_block_by_name( $name ) {
		foreach ( $this->get_settings() as $index => $block ) {
			if ( $block['name'] === $name ) {
				return array(
					'index' => $index,
					'block' => $block,
				);
			}
		}

		return null;
	}

	/**
	 * Search block with its name.
	 *
	 * @param string $name Unique name of the block.
	 *
	 * @return array|null Block data, null if block was not found.
	 * @since 1.0.0
	 */
	public function search_block( $name ) {
		$block = $this->search_block_by_name( $name );
		if ( is_null( $block ) ) {
			return null;
		}

		return $block['block'];
	}

	/**
	 * Search block with its name.
	 *
	 * @param string $name Unique name of the block.
	 *
	 * @return int|null Index, null if block was not found.
	 * @since 1.0.0
	 */
	public function search_block_index( $name ) {
		$block = $this->search_block_by_name( $name );
		if ( is_null( $block ) ) {
			return null;
		}

		return $block['index'];
	}

	/**
	 * Update/Insert block in database.
	 *
	 * @param array $block {
	 *     An array of elements that make up a block to update or insert.
	 *
	 *     @type string $name        The name for a block is a unique string that identifies a block.
	 *     @type string $title       The display title for the block.
	 *     @type string $description A short description for the block..
	 *     @type string $category    Category to help users browse and discover blocks.
	 *     @type string $icon        Icon to make block easier to identify.
	 *     @type array  $keywords    Optional. Aliases that help users discover block while searching.
	 *     @type array  $supports    Optional. Some block supports.
	 *     @type array  $styles      Optional. Block styles can be used to provide alternative styles to block.
	 * }
	 *
	 * @return bool True if block was inserted/updated, False otherwise.
	 * @since 1.0.0
	 */
	protected function insert_block_in_database( $block ) {
		$blocks = $this->get_settings();
		$index  = $this->search_block_index( $block['name'] );

		if ( null === $index ) {
			$blocks[] = $block;
		} else {
			$blocks[ $index ] = $block;
		}

		// Sort blocks.
		$settings = self::sort_blocks( $blocks );

		$updated = $this->update_db_value( $settings );

		if ( $updated ) {
			$this->settings = $settings;
		}

		return $updated;
	}

	/**
	 * Delete block in database.
	 *
	 * @param string $name Name of the block.
	 *
	 * @return bool True if block inserted/updated, False otherwise.
	 * @since 1.0.0
	 */
	protected function delete_block_in_database( $name ) {
		$blocks = $this->get_settings();
		$index  = $this->search_block_index( $name );

		if ( null === $index ) {
			return false;
		}

		unset( $blocks[ $index ] );

		return $this->update_db_value( $blocks );
	}

	/**
	 * Merge arr2 into arr1, depending on the name field.
	 *
	 * @param array $arr1 Array of attributes.
	 * @param array $arr2 Array of attributes.
	 * @param bool  $keep Flag to keep old values of attributes.
	 *
	 * @return array Merged array of attributes.
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
