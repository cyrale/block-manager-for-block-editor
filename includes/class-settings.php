<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Settings.
 *
 * @since   1.0.0
 * @package BMFBE
 */

namespace BMFBE;

use Exception;
use WP_Error;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Settings.
 *
 * @since 1.0.0
 */
class Settings {

	/**
	 * Parent plugin class.
	 *
	 * @since 1.0.0
	 *
	 * @var   Plugin
	 */
	protected $plugin = null;

	/**
	 * Constructor.
	 *
	 * @param Plugin $plugin Main plugin object.
	 *
	 * @since 1.0.0
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
	 * The capability required to use the plugin.
	 *
	 * @return string Capability name.
	 */
	public function capability() {
		return apply_filters( 'bmfbe_capabilty', 'manage_options' );
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
	 */
	public function get_blocks( $args = array() ) {
		$defaults = array(
			'page'     => 1,
			'per_page' => 10,
		);

		$args = wp_parse_args( $args, $defaults );

		$blocks = $this->get_blocks_from_database();
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
		}

		// Styles.
		$prepared_block['styles'] = array();
		if ( ! empty( $block['styles'] ) && is_array( $block['styles'] ) ) {
			foreach ( $block['styles'] as $style ) {
				if ( ! empty( $style['name'] ) && ! empty( $style['label'] ) ) {
					$prepared_block['styles'][] = array(
						'name'      => $style['name'],
						'label'     => $style['label'],
						'isDefault' => ! empty( $style['isDefault'] ),
					);
				}
			}
		}

		// TODO: Variations.
		// TODO: Access.

		// Insert/update block.
		return $this->insert_block_in_database( $prepared_block );
	}

	/**
	 * Search block with its name.
	 *
	 * @param string $name         Unique name for the block.
	 * @param bool   $return_index True to return index instead of block. Default: false.
	 *
	 * @return int|array|null Block data.
	 */
	public function search_block( $name, $return_index = false ) {
		foreach ( $this->get_blocks_from_database() as $index => $block ) {
			if ( $block['name'] === $name ) {
				return empty( $return_index ) ? $block : $index;
			}
		}

		return null;
	}

	/**
	 * Get all blocks from the database.
	 *
	 * @return array All blocks registered in database.
	 */
	protected function get_blocks_from_database() {
		$blocks = get_option( 'bmfbe_blocks', array() );
		$blocks = is_array( $blocks ) ? $blocks : array();

		// TODO: sort blocks.

		return $blocks;
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
	 */
	protected function insert_block_in_database( $block ) {
		$blocks = $this->get_blocks_from_database();
		$index  = $this->search_block( $block['name'], true );

		if ( null === $index ) {
			$blocks[] = $block;
		} else {
			$blocks[ $index ] = $block;
		}

		// TODO: sort blocks.

		// Test if blocks have to be updated.
		if ( maybe_serialize( $blocks ) === maybe_serialize( $this->get_blocks_from_database() ) ) {
			return true;
		}

		return update_option( 'bmfbe_blocks', $blocks, false );
	}
}
