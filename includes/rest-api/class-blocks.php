<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Settings for blocks.
 *
 * @since   1.0.0
 *
 * @package BMFBE\Rest_API
 */

namespace BMFBE\Rest_API;

use BMFBE\Plugin;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Settings for blocks.
 *
 * @since   1.0.0
 *
 * @package BMFBE\Rest_API
 */
class Blocks extends Base {
	/**
	 * Cached results of get_items_schema.
	 *
	 * @since 1.0.0
	 * @var array
	 */
	protected $schema_items;


	/**
	 * Constructor.
	 *
	 * @param Plugin $plugin Main plugin object.
	 *
	 * @since 1.0.0
	 */
	public function __construct( $plugin ) {
		parent::__construct( $plugin );

		$this->rest_base = 'blocks';
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
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
					'args'                => $this->get_collection_params(),
				),
				// array(
				// 'methods'             => WP_REST_Server::EDITABLE,
				// 'callback'            => array( $this, 'update_items' ),
				// 'args'                => array( $this, 'blocks_args' ),
				// 'permission_callback' => array( $this, 'update_items_permissions_check' ),
				// ),
					'schema' => array( $this, 'get_public_item_schema' ),
			)
		);
	}

	/**
	 * Retrieves a collection of items.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response Response object on success, or WP_Error object on failure.
	 * @since 4.7.0
	 */
	public function get_items( $request ) {
		// Retrieve the list of registered collection query parameters.
		$registered = $this->get_collection_params();
		$args       = array();

		/**
		 * For each known parameter which is both registered and present in the request,
		 * set the parameter's value on the query $args.
		 */
		foreach ( array_keys( $registered ) as $api_param ) {
			if ( isset( $request[ $api_param ] ) ) {
				$args[ $api_param ] = $request[ $api_param ];
			}
		}

		$result = $this->plugin->settings->blocks( $args );
		$blocks = array();

		foreach ( $result['blocks'] as $block ) {
			$data     = $this->prepare_item_for_response( $block, $request );
			$blocks[] = $this->prepare_response_for_collection( $data );
		}

		$page  = (int) $args['page'];
		$total = $result['total'];

		$max_pages = ceil( $total / (int) $args['per_page'] );

		if ( $page > $max_pages && $total > 0 ) {
			return new WP_Error(
				'rest_post_invalid_page_number',
				__( 'The page number requested is larger than the number of pages available.' ),
				array( 'status' => 400 )
			);
		}

		$response = rest_ensure_response( $blocks );

		$response->header( 'X-WP-Total', (int) $total );
		$response->header( 'X-WP-TotalPages', (int) $max_pages );

		$request_params = $request->get_query_params();
		$base           = add_query_arg( urlencode_deep( $request_params ), rest_url( sprintf( '%s/%s', $this->namespace, $this->rest_base ) ) );

		if ( $page > 1 ) {
			$prev_page = $page - 1;

			if ( $prev_page > $max_pages ) {
				$prev_page = $max_pages;
			}

			$prev_link = add_query_arg( 'page', $prev_page, $base );
			$response->link_header( 'prev', $prev_link );
		}
		if ( $max_pages > $page ) {
			$next_page = $page + 1;
			$next_link = add_query_arg( 'page', $next_page, $base );

			$response->link_header( 'next', $next_link );
		}

		return $response;
	}

	/**
	 * Retrieves the block's schema, conforming to JSON Schema.
	 *
	 * @return array Item schema data.
	 * @since 1.0.0
	 */
	public function get_item_schema() {
		if ( $this->schema ) {
			return $this->add_additional_fields_schema( $this->schema );
		}

		$schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'block',
			'type'       => 'object',
			'properties' => array(
				'name'        => array(
					'description' => __( '', 'bmfbe' ),
					'type'        => 'string',
					'readonly'    => true,
				),
				'title'       => array(
					'description' => __( '', 'bmfbe' ),
					'type'        => 'string',
					'readonly'    => true,
				),
				'description' => array(
					'description' => __( '', 'bmfbe' ),
					'type'        => 'string',
					'readonly'    => true,
				),
				'category'    => array(
					'description' => __( '', 'bmfbe' ),
					'type'        => 'string',
					'readonly'    => true,
				),
				'icon'        => array(
					'description' => __( '', 'bmfbe' ),
					'type'        => 'string',
					'readonly'    => true,
				),
				'keywords'    => array(
					'description' => __( '', 'bmfbe' ),
					'type'        => 'array',
					'items'       => array(
						'type'     => 'string',
						'readonly' => true,
					),
					'readonly'    => true,
				),
				'supports'    => array(
					'description' => __( '', 'bmfbe' ),
					'type'        => 'object',
				),
				'styles'      => array(
					'description' => __( '', 'bmfbe' ),
					'type'        => 'object',
				),
			),
		);

		$this->schema = $schema;

		return $this->add_additional_fields_schema( $this->schema );
	}

	/**
	 * Update a collection of items.
	 *
	 * @return mixed|WP_REST_Response
	 */
	public function update_items() {
		return new WP_REST_Response( array( 'message' => 'Blocks updated.' ), 204 );
	}

	public function blocks_args() {
		$args = array();

		$args['blocks'] = array(
			'description' => esc_html__( 'List of all blocks.', 'bmfbe' ),
			'type'        => 'array',
			// 'validate_callback' => '',
			'required'    => true,
		);

		return $args;
	}

}
