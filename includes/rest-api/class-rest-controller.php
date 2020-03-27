<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Settings for blocks.
 *
 * @since 1.0.0
 * @package BMFBE\Rest_API
 */

namespace BMFBE\Rest_API;

use BMFBE\Interfaces\WP_Plugin_Class;
use BMFBE\Plugin;
use WP_Error;
use WP_REST_Controller;
use WP_REST_Request;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Settings for blocks.
 *
 * @since 1.0.0
 * @package BMFBE\Rest_API
 */
abstract class Rest_Controller extends WP_REST_Controller implements WP_Plugin_Class {
	/**
	 * Parent plugin class.
	 *
	 * @var Plugin
	 * @since 1.0.0
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

		$this->namespace = 'bmfbe/v1';
		$this->rest_base = '';

		$this->hooks();
	}

	/**
	 * Initiate our hooks.
	 *
	 * @since 1.0.0
	 */
	public function hooks() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Checks if a given request has access to get items.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool True if the request has read access, WP_Error object otherwise.
	 * @since 1.0.0
	 */
	public function get_items_permissions_check( $request ) {
		return $this->permission( $request, esc_html__( 'Sorry, you are not allowed to view this data.', 'bmfbe' ) );
	}

	/**
	 * Checks if a given request has access to create items.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool True if the request has access to create items, WP_Error object otherwise.
	 * @since 1.0.0
	 */
	public function create_item_permissions_check( $request ) {
		return $this->permission( $request, esc_html__( 'Sorry, you are not allowed to create this item.', 'bmfbe' ) );
	}

	/**
	 * Checks if a given request has access to read a block.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return bool|WP_Error True if the request has read access for the item, WP_Error object otherwise.
	 * @since 1.0.0
	 */
	public function get_item_permissions_check( $request ) {
		return $this->permission( $request, esc_html__( 'Sorry, you are not allowed to view this item.', 'bmfbe' ) );
	}

	/**
	 * Checks if a given request has access to update a block.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return bool|WP_Error True if the request has read access for the item, WP_Error object otherwise.
	 * @since 1.0.0
	 */
	public function update_item_permissions_check( $request ) {
		return $this->permission( $request, esc_html__( 'Sorry, you are not allowed to update this item.', 'bmfbe' ) );
	}

	/**
	 * Checks if a given request has access to delete a block.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return bool|WP_Error True if the request has read access for the item, WP_Error object otherwise.
	 * @since 1.0.0
	 */
	public function delete_item_permissions_check( $request ) {
		return $this->permission( $request, esc_html__( 'Sorry, you are not allowed to delete this item.', 'bmfbe' ) );
	}

	/**
	 * Retrieves the query params for the blocks collection.
	 *
	 * @return array Collection parameters.
	 * @since 1.0.0
	 */
	public function get_collection_params() {
		$params = parent::get_collection_params();

		unset( $params['context'] );
		unset( $params['search'] );

		return $params;
	}

	/**
	 * The capability required to use the Rest API.
	 *
	 * @return string Capability name.
	 * @since 1.0.0
	 */
	protected function capability() {
		return apply_filters( 'bmfbe_rest_api_capability', $this->plugin->global_settings->capability() );
	}

	/**
	 * Checks if a given request has access to get items.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @param string          $message Error message to send.
	 *
	 * @return WP_Error|bool True if the request has read access, WP_Error object otherwise.
	 * @since 1.0.0
	 */
	protected function permission( $request, $message = '' ) {
		// Restrict endpoint to only users who have the good capability.
		if ( ! current_user_can( $this->capability() ) ) {
			return new WP_Error(
				'rest_forbidden',
				! empty( $message ) ? $message : esc_html__( 'Forbidden.', 'bmfbe' ),
				array( 'status' => 401 )
			);
		}

		return true;
	}
}
