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
		// Add managed sections.
		$sections = array_merge(
			$post_types,
			array(
				'#widgets' => (object) array(
					'name'    => '#widgets',
					'cap'     => 'edit_theme_options',
					'version' => array(
						'wp'        => '5.6',
						'gutenberg' => '8.9',
					),
				),
			)
		);

		foreach ( $sections as $section ) {
			// Remove post type that not support editor.
			if ( ( '#' !== $section->name[0] || ! isset( $section->version ) || ! Version::version_compare( $section->version ) )
				&& ! post_type_supports( $section->name, 'editor' ) ) {
				continue;
			}

			// Access by roles.
			$properties = array();
			foreach ( $roles as $role_name => $role ) {
				// Keep only valid capabilities.
				$capabilities = array_keys( array_filter( $role['capabilities'] ) );

				if ( ( is_object( $section->cap )
						&& ( in_array( $section->cap->create_posts, $capabilities, true )
						|| in_array( $section->cap->edit_posts, $capabilities, true ) ) )
					|| ( is_string( $section->cap )
						&& in_array( $section->cap, $capabilities, true ) )
					) {
						$properties[ $role_name ] = array(
							'type'    => 'boolean',
							'default' => true,
						);
				}
			}

			// Access by post type.
			if ( ! empty( $properties ) ) {
				$this->schema['properties'][ $section->name ] = array(
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
