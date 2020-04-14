<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Block settings.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */

namespace BMFBE\Settings;

use WP_Error;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Block settings.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */
class Block_Settings extends Settings {
	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		parent::__construct();

		$this->option_name   = 'block_settings';

		$global_options = Global_Settings::get_instance()->get_schema();

		$supports = $global_options['supports'];
		$supports = array_merge( $supports, array(
			'description'       => __( 'Block supports', 'bmfbe' ),
			'type'              => 'object',
			'validate_callback' => null,
		) );

		// Initialize available options like arguments in Rest API.
		$this->schema = array(
			'description' => __( 'List of supported blocks.', 'bmfbe' ),
			'type'        => 'array',
			'default'     => array(),
			'items'       => array(
				'name'        => array(
					'description'       => __( 'Unique name for the block.', 'bmfbe' ),
					'type'              => 'string',
					'required'          => true,
					'validate_callback' => array( $this, 'validate_name' ),
				),
				'title'       => array(
					'description' => __( 'The display title for the block.', 'bmfbe' ),
					'type'        => 'string',
					'required'    => true,
				),
				'description' => array(
					'description' => __( 'A short description for the block.', 'bmfbe' ),
					'type'        => 'string',
					'required'    => true,
				),
				'category'    => array(
					'description' => __( 'Category to help users browse and discover blocks.', 'bmfbe' ),
					'type'        => 'string',
					'required'    => true,
				),
				'icon'        => array(
					'description' => __( 'Icon to make block easier to identify.', 'bmfbe' ),
					'type'        => 'string',
				),
				'keywords'    => array(
					'description' => __( 'Aliases that help users discover block while searching.', 'bmfbe' ),
					'type'        => 'array',
					'default'     => array(),
					'items'       => array(
						'type' => 'string',
					),
				),
				'supports'    => $supports,
				'styles'      => array(
					'description' => __( 'Block styles can be used to provide alternative styles to block.', 'bmfbe' ),
					'type'        => 'array',
					'default'     => array(),
					'items'       => array(
						'type'        => 'object',
						'default'     => array(),
						'properties'  => array(
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
				'variations'  => array(
					'description' => __( 'Block\'s style variation can be used to provide alternative styles to block.',
						'bmfbe' ),
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
	 * Initiate our hooks.
	 *
	 * @since 1.0.0
	 */
	public function hooks() {
	}

	public function validate_name( $value, $property ) {
		$options = $this->get_schema();

		$valid_check = self::validate_value_from_schema( $value, $options['name'], $property );

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
	 * Sort settings.
	 *
	 * @param array $settings Array of settings.
	 *
	 * @return array Sorted array of settings.
	 * @since 1.0.0
	 */
	protected static function sort_settings( $settings ) {
		// Sort settings by categories and names (core categories and blocks first).
		usort(
			$settings,
			function( $a, $b ) {
				$category_order = array(
					'common',
					'formatting',
					'layout',
					'widgets',
					'embed',
				);

				$cat_a = array_search( $a['category'], $category_order, true );
				$cat_b = array_search( $b['category'], $category_order, true );

				$core_a = strpos( $a['name'], 'core/' );
				$core_b = strpos( $b['name'], 'core/' );

				if ( false !== $cat_a && false !== $cat_b && $cat_a !== $cat_b ) {
					return $cat_a - $cat_b;
				} elseif ( false !== $cat_a && false === $cat_b ) {
					return -1;
				} elseif ( false === $cat_a && false !== $cat_b ) {
					return 1;
				} else {
					if ( 0 === $core_a && false === $core_b ) {
						return - 1;
					} elseif ( false === $core_a && 0 === $core_b ) {
						return 1;
					}
				}

				return strcmp( $a['name'], $b['name'] );
			}
		);

		return $settings;
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
		$total  = count( $blocks );

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
		$options = $this->get_schema();

		$valid_check = self::validate_params( $block, $options['items'] );
		if ( is_wp_error( $valid_check ) ) {
			return $valid_check;
		}

		$db_block = $this->search_block( $block['name'] );

		$block = self::sanitize_params( $block, $options['items'] );
		$block = self::prepare_settings_walker( $block, $options['items'], $db_block );

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

		$options = $this->get_schema();

		$options['items']['title']['required']       = false;
		$options['items']['description']['required'] = false;
		$options['items']['category']['required']    = false;

		$valid_check = self::validate_params( $block, $options['items'] );

		if ( is_wp_error( $valid_check ) ) {
			return $valid_check;
		}

		// Supports.
		$supports = $db_block['supports'];
		if ( ! empty( $block['supports'] ) && is_array( $block['supports'] ) ) {
			// Remove old values.
			if ( isset( $keep['supports'] ) && false === $keep['supports'] ) {
				$db_block_keys = array_keys( $db_block['supports'] );
				$block_keys    = array_keys( $block['supports'] );

				$keys_to_delete = array_diff( $db_block_keys, $block_keys );

				$db_block['supports'] = array_diff_key( $db_block['supports'], array_flip( $keys_to_delete ) );
			}

			$supports = array_merge( $db_block['supports'], $block['supports'] );
		}

		// Styles.
		$styles = $db_block['styles'];
		if ( ! empty( $block['styles'] ) && is_array( $block['styles'] ) ) {
			$styles = $this->merge_attributes( $db_block['styles'], $block['styles'], ! empty( $keep['styles'] ) );
		}

		// Variations.
		$variations = $db_block['variations'];
		if ( ! empty( $block['variations'] ) && is_array( $block['variations'] ) ) {
			$variations = $this->merge_attributes( $db_block['variations'], $block['variations'], ! empty( $keep['variations'] ) );
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
	 * @param string $name Unique name for the block.
	 *
	 * @return int|array|null Block data.
	 * @since 1.0.0
	 */
	public function search_block( $name ) {
		$block = $this->search_block_by_name( $name );
		if ( is_null( $block ) ) {
			return null;
		}

		return $block['block'];
	}

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
		$index  = $this->search_block( $block['name'], true );

		if ( null === $index ) {
			$blocks[] = $block;
		} else {
			$blocks[ $index ] = $block;
		}

		// Sort blocks.
		$settings = self::sort_settings( $blocks );

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
