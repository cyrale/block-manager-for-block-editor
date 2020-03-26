<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Block settings.
 *
 * @since   1.0.0
 * @package BMFBE\Settings
 */

namespace BMFBE\Settings;

use BMFBE\Plugin;
use Exception;
use WP_Error;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Block settings.
 *
 * @since 1.0.0
 */
class Block_Settings extends Settings {
	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param Plugin $plugin Main plugin object.
	 *
	 * @throws Exception
	 */
	public function __construct( $plugin ) {
		parent::__construct( $plugin );

		$this->option_name   = 'bmfbe_block_settings';
		$this->default_value = array();

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

		// Sort blocks.
		$this->settings = self::sort_settings( $this->settings );

		return $this->settings;
	}

	/**
	 * Sort settings.
	 *
	 * @param array $settings Array of settings.
	 *
	 * @return array Sorted array of settings.
	 */
	protected static function sort_settings( $settings ) {
		// Sort settings by categories and names (core categories and blocks first)
		usort( $settings, function( $a, $b ) {
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
		} );

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
	 * @throws Exception
	 */
	public function get_blocks( $args = array() ) {
		$defaults = array(
			'page'     => 1,
			'per_page' => 10,
		);

		$args = wp_parse_args( $args, $defaults );

		$blocks = $this->load();
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
	 * @since 1.0.0
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
	 * @return WP_Error|bool
	 * @throws Exception
	 */
	public function insert_block( $block ) {
		// Check if some fields are empty.
		if ( empty( $block['name'] ) || empty( $block['title'] ) || empty( $block['description'] ) || empty( $block['category'] ) ) {
			return new WP_Error(
				'empty_block',
				__( 'Name, title, description or category are empty.', 'bmfbe' )
			);
		}

		// Check name validity.
		if ( ! preg_match( '/^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/', $block['name'] ) ) {
			return new WP_Error(
				'invalid_block_name',
				__( 'Block names must contain a namespace prefix, include only lowercase alphanumeric characters or dashes, and start with a letter.', 'bmfbe' )
			);
		}

		$prepared_block = array();

		$string_fields = array(
			'name',
			'title',
			'description',
			'category',
			'icon',
		);

		foreach ( $string_fields as $field ) {
			if ( isset( $block[ $field ] ) && ! is_string( $block[ $field ] ) ) {
				return new WP_Error(
					'invalid_type',
					/* translators: %s: Field name */
					sprintf( __( 'Invalid type for field: %s.', 'bmfbe' ), $field )
				);
			}

			$prepared_block[ $field ] = $block[ $field ];
		}

		// Keywords.
		$prepared_block['keywords'] = array();
		if ( ! empty( $block['keywords'] ) && is_array( $block['keywords'] ) ) {
			$prepared_block['keywords'] = array_filter( $block['keywords'], 'is_string' );
		}

		// Supports.
		$prepared_block['supports'] = array();
		if ( ! empty( $block['supports'] ) && is_array( $block['supports'] ) ) {
			$prepared_block['supports'] = array_filter( $block['supports'], 'is_bool' );

			// Sort supports.
			ksort( $prepared_block['supports'] );
		}

		// Styles.
		$prepared_block['styles'] = array();
		if ( ! empty( $block['styles'] ) && is_array( $block['styles'] ) ) {
			$prepared_block['styles'] = $this->prepare_attributes(
				$block['styles'],
				array( $this, 'filter_styles_callback' ),
				new WP_Error(
					'styles_no_default',
					__( 'There should be at least one default style.', 'bmfbe' )
				),
				new WP_Error(
					'styles_one_default_only',
					__( 'There should be only one default style', 'bmfbe' )
				)
			);

			if ( is_wp_error( $prepared_block['styles'] ) ) {
				return $prepared_block['styles'];
			}
		}

		// Variations.
		$prepared_block['variations'] = array();
		if ( ! empty( $block['variations'] ) && is_array( $block['variations'] ) ) {
			$prepared_block['variations'] = $this->prepare_attributes(
				$block['variations'],
				array( $this, 'filter_variations_callback' ),
				new WP_Error(
					'variations_no_default',
					__( 'There should be at least one default variation.', 'bmfbe' )
				),
				new WP_Error(
					'variations_one_default_only',
					__( 'There should be only one default variation', 'bmfbe' )
				)
			);

			if ( is_wp_error( $prepared_block['variations'] ) ) {
				return $prepared_block['variations'];
			}
		}

		// TODO: Access.

		// Insert/update block.
		return $this->insert_block_in_database( $prepared_block );
	}

	/**
	 * Update a block.
	 *
	 * @since 1.0.0
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
	 * @return WP_Error|bool
	 * @throws Exception
	 */
	public function update_block( $block, $keep ) {
		$db_block = $this->search_block( $block['name'] );

		if ( null === $db_block ) {
			return new WP_Error(
				'invalid_block_name',
				__( 'Invalid block name.', 'bmfbe' )
			);
		}

		// Supports.
		$supports = $db_block['supports'];
		if ( ! empty( $block['supports'] ) && is_array( $block['supports'] ) ) {
			$supports = array_merge( $db_block['supports'], $block['supports'] );
		}

		// Styles.
		$styles = $db_block['styles'];
		if ( ! empty( $block['styles'] ) && is_array( $block['styles'] ) ) {
			$styles = $this->merge_attributes(
				$db_block['styles'],
				array_filter( $block['styles'], array( $this, 'filter_styles_callback' ) ),
				! empty( $keep['styles'] )
			);
		}

		// Variations.
		$styles = $db_block['variations'];
		if ( ! empty( $block['variations'] ) && is_array( $block['variations'] ) ) {
			$styles = $this->merge_attributes(
				$db_block['variations'],
				array_filter( $block['variations'], array( $this, 'filter_variations_callback' ) ),
				! empty( $keep['variations'] )
			);
		}

		// TODO: Access.

		// Merge old and new fields with new fields overwriting old ones.
		$block             = array_merge( $db_block, $block );
		$block['supports'] = $supports;
		$block['styles']   = $styles;

		return $this->insert_block( $block );
	}

	/**
	 * Delete a block.
	 *
	 * @since 1.0.0
	 *
	 * @param string $name Name of the block.
	 *
	 * @return WP_Error|bool
	 * @throws Exception
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
	 * @param string $name         Unique name for the block.
	 * @param bool   $return_index True to return index instead of block. Default: false.
	 *
	 * @return int|array|null Block data.
	 * @throws Exception
	 */
	public function search_block( $name, $return_index = false ) {
		foreach ( $this->load() as $index => $block ) {
			if ( $block['name'] === $name ) {
				return empty( $return_index ) ? $block : $index;
			}
		}

		return null;
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
	 * @return bool True if block inserted/updated, False otherwise.
	 * @throws Exception
	 */
	protected function insert_block_in_database( $block ) {
		$blocks = $this->load();
		$index  = $this->search_block( $block['name'], true );

		if ( null === $index ) {
			$blocks[] = $block;
		} else {
			$blocks[ $index ] = $block;
		}

		// Sort blocks.
		$this->settings = $this->sort_settings( $blocks );

		return $this->save();
	}

	/**
	 * Delete block in database.
	 *
	 * @param string $name Name of the block.
	 *
	 * @return bool True if block inserted/updated, False otherwise.
	 * @throws Exception
	 */
	protected function delete_block_in_database( $name ) {
		$blocks = $this->load();
		$index  = $this->search_block( $name, true );

		if ( null === $index ) {
			return false;
		}

		unset( $blocks[ $index ] );

		return $this->save();
	}

	/**
	 * Callback used to filter valid values for styles.
	 *
	 * @param mixed $style Value of style to validate.
	 *
	 * @return bool True if style is valid, False otherwise.
	 */
	protected function filter_styles_callback( $style ) {
		return ! empty( $style ) && is_array( $style )
				&& ! empty( $style['name'] ) && is_string( $style['name'] )
				&& ! empty( $style['label'] ) && is_string( $style['label'] );
	}

	/**
	 * Callback used to filter valid values for variations.
	 *
	 * @param mixed $variation Value of variation to validate.
	 *
	 * @return bool True if variation is valid, False otherwise.
	 */
	protected function filter_variations_callback( $variation ) {
		return ! empty( $variation ) && is_array( $variation )
		       && ! empty( $variation['name'] ) && is_string( $variation['name'] )
		       && ! empty( $variation['title'] ) && is_string( $variation['title'] );
	}

	/**
	 * Merge arr2 into arr1, depending on the name field.
	 *
	 * @param array $arr1 Array of attributes.
	 * @param array $arr2 Array of attributes.
	 * @param bool  $keep Flag to keep old values of attributes.
	 *
	 * @return array Merged array of attributes.
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

	/**
	 * Prepare attributes before they are saved.
	 *
	 * @param array    $attributes                     Attributes to prepare.
	 * @param callable $filter_callback                Callback used to filter valid attributes.
	 * @param WP_Error $no_default_error_message       Error sent when there is no default.
	 * @param WP_Error $one_default_only_error_message Error sent when there is more than one default.
	 *
	 * @return array|WP_Error
	 */
	protected function prepare_attributes( $attributes, $filter_callback, $no_default_error_message, $one_default_only_error_message ) {
		$prepared_attributes = array_filter( $attributes, $filter_callback );

		// Normalize value of isDefault field.
		foreach ( $prepared_attributes as &$attr ) {
			$attr['isDefault'] = ! empty( $attr['isDefault'] );
		}

		// Sort attributes by name alphabetically.
		array_multisort(
			array_column( $prepared_attributes, 'name' ),
			SORT_ASC,
			$prepared_attributes
		);

		// Checks that there is only one default style.
		$defaults  = array_column( $prepared_attributes, 'isDefault' );
		$true_keys = array_keys( $defaults, true, true );

		if ( count( $true_keys ) === 0 ) {
			return $no_default_error_message;
		} elseif ( count( $true_keys ) > 1 ) {
			return $one_default_only_error_message;
		}

		return $prepared_attributes;
	}
}
