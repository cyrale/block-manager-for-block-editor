<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Pattern settings.
 *
 * @since 1.0.0
 * @package BMFBE\Rest_API
 */

namespace BMFBE\Rest_API;

use BMFBE\Plugin;
use BMFBE\Settings\Pattern_Settings;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Pattern settings.
 *
 * @since 1.0.0
 * @package BMFBE\Rest_API
 */
class Pattern_Settings_Controller extends Rest_Controller {

	/**
	 * Constructor.
	 *
	 * @param Plugin $plugin Main plugin object.
	 *
	 * @since 1.0.0
	 */
	public function __construct( $plugin ) {
		parent::__construct( $plugin );

		$this->rest_base = 'patterns';
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
						'description' => __( 'Unique name for the pattern.', 'bmfbe' ),
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
				'schema' => array( $this, 'get_public_item_schema' ),
			)
		);
	}

	/**
	 * Retrieves the pattern's schema, conforming to JSON Schema.
	 *
	 * @return array Item schema data.
	 * @since 1.0.0
	 */
	public function get_item_schema() {
		if ( $this->schema ) {
			return $this->add_additional_fields_schema( $this->schema );
		}

		$pattern_schema = Pattern_Settings::get_instance()->get_schema();

		$schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'pattern',
			'type'       => 'object',
			'properties' => $pattern_schema['items'],
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
			'title',
			'description',
			'categories',
		);

		foreach ( $endpoint_args as $field_id => $params ) {
			// Unset args.
			if ( WP_REST_Server::CREATABLE !== $method && in_array( $field_id, $unset, true ) ) {
				unset( $endpoint_args[ $field_id ] );
			}
		}

		return $endpoint_args;
	}

	/**
	 * Prepares a pattern for update.
	 *
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return array Pattern data.
	 * @since 1.0.0
	 */
	protected function prepare_item_for_database( $request ) {
		$params = $request->get_params();
		$schema = $this->get_item_schema();

		foreach ( $schema['properties'] as $key => $s ) {
			if ( 'name' !== $key && 'disabled' !== $key ) {
				unset( $schema['properties'][ $key ] );
			}
		}

		return Pattern_Settings::prepare_settings_walker( $params, $schema['properties'] );
	}

	// phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable -- parent compatibility
	/**
	 * Prepares a single pattern output for response.
	 *
	 * @param array           $pattern Pattern object.
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return WP_REST_Response Response object.
	 * @since 1.0.0
	 */
	public function prepare_item_for_response( $pattern, $request ) {
		// Wrap the data in a response object.
		$response = rest_ensure_response( $pattern );

		$links = $this->prepare_links( $pattern );
		$response->add_links( $links );

		return $response;
	}
	// phpcs:enable

	/**
	 * Prepares links for the request.
	 *
	 * @param array $pattern Pattern object.
	 *
	 * @return array Links for the given pattern.
	 * @since 1.0.0
	 */
	protected function prepare_links( $pattern ) {
		$base = sprintf( '%s/%s', $this->namespace, $this->rest_base );

		return array(
			'self'       => array(
				'href' => rest_url( trailingslashit( $base ) . $pattern['name'] ),
			),
			'collection' => array(
				'href' => rest_url( $base ),
			),
		);
	}

	/**
	 * Get a pattern from its name.
	 *
	 * @param string $name Name of the pattern.
	 *
	 * @return array|WP_Error The pattern if name is valid, WP_Error otherwise.
	 * @since 1.0.0
	 */
	protected function get_pattern( $name ) {
		$pattern = Pattern_Settings::get_instance()->search_pattern( $name );

		if ( null === $pattern ) {
			return new WP_Error(
				'rest_pattern_not_found',
				__( 'Pattern not found.', 'bmfbe' ),
				array( 'status' => 404 )
			);
		}

		return $pattern;
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

		$result   = Pattern_Settings::get_instance()->get_patterns( $args );
		$patterns = array();

		foreach ( $result['patterns'] as $pattern ) {
			$data       = $this->prepare_item_for_response( $pattern, $request );
			$patterns[] = $this->prepare_response_for_collection( $data );
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

		$response = rest_ensure_response( $patterns );

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
	 * Retrieves a single pattern.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 * @since 1.0.0
	 */
	public function get_item( $request ) {
		$pattern = $this->get_pattern( $request['name'] );

		if ( is_wp_error( $pattern ) ) {
			return $pattern;
		}

		$data = $this->prepare_item_for_response( $pattern, $request );

		return rest_ensure_response( $data );
	}

	/**
	 * Updates a single pattern.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 * @since 1.0.0
	 */
	public function update_item( $request ) {
		$pattern = $this->get_pattern( $request['name'] );

		if ( is_wp_error( $pattern ) ) {
			return $pattern;
		}

		$prepared_pattern = $this->prepare_item_for_database( $request );

		$result = Pattern_Settings::get_instance()->update_pattern( $prepared_pattern );

		if ( is_wp_error( $result ) ) {
			$result->add_data( array( 'status' => 400 ) );
			return $result;
		} elseif ( false === $result ) {
			return new WP_Error(
				'rest_pattern_not_updated',
				__( 'Pattern not updated.', 'bmfbe' ),
				array( 'status' => 500 )
			);
		}

		$pattern = $this->get_pattern( $request['name'] );
		$data    = $this->prepare_item_for_response( $pattern, $request );

		return rest_ensure_response( $data );
	}
}
