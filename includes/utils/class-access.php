<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Access.
 *
 * @since 1.0.0
 * @package BMFBE\Utils
 */

namespace BMFBE\Utils;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Access.
 *
 * @since 1.0.0
 * @package BMFBE\Utils
 */
class Access {
	/**
	 * Get schema.
	 *
	 * @return array
	 */
	public static function get_schema() {
		$schema = array(
			'description' => '',
			'type'        => 'object',
			'properties'  => array(),
		);

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
				$schema['properties'][ $section->name ] = array(
					'type'       => 'object',
					'properties' => $properties,
				);
			}
		}

		return $schema;
	}
}
