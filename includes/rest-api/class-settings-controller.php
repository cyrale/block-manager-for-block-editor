<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Global settings.
 *
 * @since   1.0.0
 *
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
 * Block Manager for WordPress Block Editor (Gutenberg): Global settings.
 *
 * @since   1.0.0
 *
 * @package BMFBE\Rest_API
 */
class Settings_Controller extends Rest_Controller {
	/**
	 * Constructor.
	 *
	 * @param Plugin $plugin Main plugin object.
	 *
	 * @since 1.0.0
	 */
	public function __construct( $plugin ) {
		parent::__construct( $plugin );

		$this->rest_base = 'settings';
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
					'callback'            => array( $this, 'get_item' ),
					'args'                => array(),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
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

		$options = $this->plugin->global_settings->get_options();

		$schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'settings',
			'type'       => 'object',
			'properties' => $options,
		);

		$this->schema = $schema;

		return $this->add_additional_fields_schema( $this->schema );
	}

	/**
	 * Retrieves all settings.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 * @throws Exception Throws an Exception if option name is not defined.
	 */
	public function get_item( $request ) {
		$options  = $this->plugin->global_settings->get_options();
		$settings = $this->plugin->global_settings->get_settings();
		$response = array();

		foreach ( $options as $name => $schema ) {
			$value = $settings[ $name ];

			$validation = rest_validate_value_from_schema( $value, $schema );
			if ( is_wp_error( $validation ) ) {
				return $validation;
			}

			$response[ $name ] = $value;
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Updates settings.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 * @throws Exception Throws an Exception if option name is not defined.
	 */
	public function update_item( $request ) {
		$options  = $this->plugin->global_settings->get_options();
		$settings = $this->plugin->global_settings->get_settings();

		$params = $request->get_params();

		foreach ( $options as $name => $schema ) {
			if ( ! array_key_exists( $name, $params ) ) {
				continue;
			}

			$settings[ $name ] = $params[ $name ];
		}

		$this->plugin->global_settings->update_settings( $settings );

		return $this->get_item( $request );
	}
}
