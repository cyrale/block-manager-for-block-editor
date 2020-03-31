<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Settings for blocks.
 *
 * @since 1.0.0
 * @package BMFBE\Rest_API
 */

namespace BMFBE\Rest_API;

use BMFBE\Plugin;
use Exception;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Settings for blocks.
 *
 * @since 1.0.0
 * @package BMFBE\Rest_API
 */
class Blocks_Controller extends Rest_Controller {
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
					'args'                => $this->get_collection_params(),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_item' ),
					'permission_callback' => array( $this, 'create_item_permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::CREATABLE ),
				),
				'schema' => array( $this, 'get_public_item_schema' ),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<name>[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*)',
			array(
				'args'   => array(
					'name' => array(
						'description' => __( 'Unique name for the block.', 'bmfbe' ),
						'type'        => 'string',
					),
				),
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
				),
				'schema' => array( $this, 'get_public_item_schema' ),
			)
		);
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
					'description' => __( 'Unique name for the block.', 'bmfbe' ),
					'type'        => 'string',
				),
				'title'       => array(
					'description' => __( 'The display title for the block.', 'bmfbe' ),
					'type'        => 'string',
				),
				'description' => array(
					'description' => __( 'A short description for the block.', 'bmfbe' ),
					'type'        => 'string',
				),
				'category'    => array(
					'description' => __( 'Category to help users browse and discover blocks.', 'bmfbe' ),
					'type'        => 'string',
				),
				'icon'        => array(
					'description' => __( 'Icon to make block easier to identify.', 'bmfbe' ),
					'type'        => 'string',
				),
				'keywords'    => array(
					'description' => __( 'Aliases that help users discover block while searching.', 'bmfbe' ),
					'type'        => 'array',
					'items'       => array(
						'type'     => 'string',
						'readonly' => true,
					),
				),
				'supports'    => array(
					'description' => __( 'Some block supports.', 'bmfbe' ),
					'type'        => 'object',
					'default'     => array(),
				),
				'styles'      => array(
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
				'variations'  => array(
					'description' => __( 'Block\'s style variation can be used to provide alternative styles to block.', 'bmfbe' ),
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

		$this->schema = $schema;

		return $this->add_additional_fields_schema( $this->schema );
	}

	/**
	 * Retrieves an array of endpoint arguments from the item schema for the controller.
	 *
	 * @param string $method Optional. HTTP method of the request. The arguments for `CREATABLE` requests are
	 *                       checked for required values and may fall-back to a given default, this is not done
	 *                       on `EDITABLE` requests. Default WP_REST_Server::CREATABLE.
	 *
	 * @return array Endpoint arguments.
	 * @since 1.0.0
	 */
	public function get_endpoint_args_for_item_schema( $method = WP_REST_Server::CREATABLE ) {
		$endpoint_args = parent::get_endpoint_args_for_item_schema( $method );

		$unset = array(
			'name',
		);

		foreach ( $endpoint_args as $field_id => $params ) {
			// Unset args.
			if ( WP_REST_Server::CREATABLE !== $method && in_array( $field_id, $unset, true ) ) {
				unset( $endpoint_args[ $field_id ] );
			}
		}

		// Add args not present in item schema.
		$endpoint_args['keep'] = array(
			'description' => __( 'Mark the attributes whose you want to keep old values.', 'bmfbe' ),
			'type'        => 'object',
			'properties'  => array(
				'supports'   => array(
					'description' => __( 'Keep old values of supports.', 'bmfbe' ),
					'type'        => 'boolean',
				),
				'styles'     => array(
					'description' => __( 'Keep old values of styles.', 'bmfbe' ),
					'type'        => 'boolean',
				),
				'variations' => array(
					'description' => __( 'Keep old values of variations.', 'bmfbe' ),
					'type'        => 'boolean',
				),
			),
			'default'     => array(
				'supports'   => true,
				'styles'     => true,
				'variations' => true,
			),
		);

		return $endpoint_args;
	}

	/**
	 * Prepares a single block for create or update.
	 *
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return array Block data.
	 * @since 1.0.0
	 */
	protected function prepare_item_for_database( $request ) {
		$prepared_block = array();

		$schema = $this->get_item_schema();

		// Basic types.
		foreach ( $schema['properties'] as $field_id => $params ) {
			if ( ! isset( $request[ $field_id ] ) ) {
				continue;
			}

			if ( ( 'string' === $params['type'] && is_string( $request[ $field_id ] ) )
				|| ( ( 'array' === $params['type'] || 'object' === $params['type'] ) && is_array( $request[ $field_id ] ) ) ) {
				$prepared_block[ $field_id ] = $request[ $field_id ];
			}
		}

		// TODO: Access.

		return $prepared_block;
	}

	/**
	 * Prepares a single block output for response.
	 *
	 * @param array           $block   Block object.
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return WP_REST_Response Response object.
	 * @since 1.0.0
	 */
	public function prepare_item_for_response( $block, $request ) {
		// Wrap the data in a response object.
		$response = rest_ensure_response( $block );

		$links = $this->prepare_links( $block );
		$response->add_links( $links );

		return $response;
	}

	/**
	 * Prepares links for the request.
	 *
	 * @param array $block Block object.
	 *
	 * @return array Links for the given post.
	 * @since 1.0.0
	 */
	protected function prepare_links( $block ) {
		$base = sprintf( '%s/%s', $this->namespace, $this->rest_base );

		return array(
			'self'       => array(
				'href' => rest_url( trailingslashit( $base ) . $block['name'] ),
			),
			'collection' => array(
				'href' => rest_url( $base ),
			),
		);
	}

	/**
	 * Get a block from its name.
	 *
	 * @param string $name Name of the block.
	 *
	 * @return array|WP_Error The block if name is valid, WP_Error otherwise.
	 * @since 1.0.0
	 */
	protected function get_block( $name ) {
		$block = $this->plugin->block_settings->search_block( $name );

		if ( null === $block ) {
			return new WP_Error(
				'rest_block_not_found',
				__( 'Block not found.', 'bmfbe' ),
				array( 'status' => 404 )
			);
		}

		return $block;
	}

	/**
	 * Retrieves a collection of items.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response Response object on success, or WP_Error object on failure.
	 * @since 1.0.0
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

		$result = $this->plugin->block_settings->get_blocks( $args );
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
				'rest_invalid_page_number',
				__( 'The page number requested is larger than the number of pages available.', 'bmfbe' ),
				array( 'status' => 400 )
			);
		}

		$response = rest_ensure_response( $blocks );

		$response->header( 'X-WP-Total', (int) $total );
		$response->header( 'X-WP-TotalPages', (int) $max_pages );

		$request_params = $request->get_query_params();
		$base           = add_query_arg(
			urlencode_deep( $request_params ),
			rest_url( sprintf( '%s/%s', $this->namespace, $this->rest_base ) )
		);

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
	 * Retrieves a single block.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 * @since 1.0.0
	 */
	public function get_item( $request ) {
		$block = $this->get_block( $request['name'] );

		if ( is_wp_error( $block ) ) {
			return $block;
		}

		$data = $this->prepare_item_for_response( $block, $request );

		return rest_ensure_response( $data );
	}

	/**
	 * Creates a single block.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 * @since 1.0.0
	 */
	public function create_item( $request ) {
		$block = $this->get_block( $request['name'] );

		if ( ! is_wp_error( $block ) ) {
			return new WP_Error(
				'rest_block_already_exists',
				__( 'Block already exists.', 'bmfbe' ),
				array( 'status' => 400 )
			);
		}

		$prepared_block = $this->prepare_item_for_database( $request );

		$result = $this->plugin->block_settings->insert_block( $prepared_block );

		if ( is_wp_error( $result ) ) {
			$result->add_data( array( 'status' => 400 ) );
			return $result;
		} elseif ( false === $result ) {
			return new WP_Error(
				'rest_block_not_inserted',
				__( 'Block not inserted.', 'bmfbe' ),
				array( 'status' => 500 )
			);
		}

		$block = $this->get_block( $prepared_block['name'] );
		$data  = $this->prepare_item_for_response( $block, $request );

		return rest_ensure_response( $data );
	}

	/**
	 * Updates a single block.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 * @since 1.0.0
	 */
	public function update_item( $request ) {
		$block = $this->get_block( $request['name'] );

		if ( is_wp_error( $block ) ) {
			return $block;
		}

		$prepared_block = $this->prepare_item_for_database( $request );

		$result = $this->plugin->block_settings->update_block( $prepared_block, $request['keep'] );

		if ( is_wp_error( $result ) ) {
			$result->add_data( array( 'status' => 400 ) );
			return $result;
		} elseif ( false === $result ) {
			return new WP_Error(
				'rest_block_not_updated',
				__( 'Block not updated.', 'bmfbe' ),
				array( 'status' => 500 )
			);
		}

		$block = $this->get_block( $request['name'] );
		$data  = $this->prepare_item_for_response( $block, $request );

		return rest_ensure_response( $data );
	}

	/**
	 * Deletes a single block.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 * @since 1.0.0
	 */
	public function delete_item( $request ) {
		$block = $this->get_block( $request['name'] );

		if ( is_wp_error( $block ) ) {
			return $block;
		}

		$result = $this->plugin->block_settings->delete_block( $request['name'] );

		if ( is_wp_error( $result ) ) {
			$result->add_data( array( 'status' => 400 ) );
			return $result;
		} elseif ( false === $result ) {
			return new WP_Error(
				'rest_block_not_updated',
				__( 'Block not updated.', 'bmfbe' ),
				array( 'status' => 500 )
			);
		}

		return rest_ensure_response(
			array(
				'deleted'  => true,
				'previous' => $this->prepare_item_for_response( $block, $request )->get_data(),
			)
		);
	}
}
