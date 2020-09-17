<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Access.
 *
 * @since 1.0.0
 * @package BMFBE\Utils
 */

namespace BMFBE\Utils;

use Exception;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Access.
 *
 * @since 1.0.0
 * @package BMFBE\Utils
 *
 * @property-read array $schema Schema that defined access.
 */
class Access extends Singleton {
	/**
	 * Schema.
	 *
	 * @var array
	 * @since 1.0.0
	 */
	protected $schema = array(
		'description' => '',
		'type'        => 'object',
		'properties'  => array(),
	);

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		parent::__construct();

		// Extract roles.
		if ( ! function_exists( 'get_editable_roles' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/user.php' );
		}
		$roles = get_editable_roles();

		// Extract post types.
		$post_types = get_post_types(
			array(
				'public'       => true,
				'show_in_rest' => true,
			),
			'object'
		);
		foreach ( $post_types as $post_type ) {
			// Remove post type that not support editor.
			if ( ! post_type_supports( $post_type->name, 'editor' ) ) {
				continue;
			}

			// Access by roles.
			$properties = array();

			foreach ( $roles as $role_name => $role ) {
				if ( ! in_array( $post_type->cap->create_posts, array_keys( $role['capabilities'] ), true )
					&& ! in_array( $post_type->cap->edit_posts, array_keys( $role['capabilities'] ), true ) ) {
					continue;
				}

				$properties[ $role_name ] = array(
					'type'    => 'boolean',
					'default' => true,
				);
			}

			// Access by post type.
			if ( ! empty( $properties ) ) {
				$this->schema['properties'][ $post_type->name ] = array(
					'type'       => 'object',
					'properties' => $properties,
				);
			}
		}
	}

	/**
	 * Magic getter for our object.
	 *
	 * @param string $field Field to get.
	 *
	 * @return mixed     Value of the field.
	 * @throws Exception Throws an exception if the field is invalid.
	 * @since 1.0.0
	 */
	public function __get( $field ) {
		switch ( $field ) {
			case 'schema':
				return $this->$field;
			default:
				throw new Exception( 'Invalid ' . __CLASS__ . ' property: ' . $field );
		}
	}
}
