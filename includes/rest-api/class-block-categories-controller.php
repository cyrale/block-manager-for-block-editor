<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Block categories.
 *
 * @since 1.0.0
 * @package BMFBE\Rest_API
 */

namespace BMFBE\Rest_API;

use BMFBE\Settings\Block_Settings;
use WP_REST_Server;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Block categories.
 *
 * @since 1.0.0
 * @package BMFBE\Rest_API
 */
class Block_Categories_Controller extends Rest_Controller {
	/**
	 * Constructor.
	 *
	 * @param Plugin $plugin main plugin object.
	 *
	 * @since 1.0.0
	 */
	public function __construct( $plugin ) {
		parent::__construct( $plugin );

		$this->rest_base = 'block-categories';
	}

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @since 1.0.0
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'args'                => array(),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
				'schema' => array( $this, 'get_public_item_schema' ),
			)
		);
	}

	/**
	 * Retrieves the block categories schema, conforming to JSON Schema.
	 *
	 * @return array Item schema data.
	 * @since 1.0.0
	 */
	public function get_item_schema() {
		if ( $this->schema ) {
			return $this->add_additional_fields_schema( $this->schema );
		}

		$this->schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'block-category',
			'type'       => 'object',
			'properties' => array(
				'slug'  => array(
					'description' => __( 'Name of the category', 'bmfbe' ),
					'type'        => 'string',
					'required'    => true,
				),
				'title' => array(
					'description' => __( 'Human readable name of the category', 'bmfbe' ),
					'type'        => 'string',
					'required'    => true,
				),
			),
		);

		return $this->add_additional_fields_schema( $this->schema );
	}

	/**
	 * Retrieves all categories.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 * @since 1.0.0
	 */
	public function get_items( $request ) { // phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		$pick_keys = array_flip( array( 'slug', 'title' ) );

		$categories = array();
		foreach ( Block_Settings::get_instance()->get_categories() as $category ) {
			$categories[] = array_intersect_key( $category, $pick_keys );
		}

		return rest_ensure_response( $categories );
	}
}
