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

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Settings for blocks.
 *
 * @since   1.0.0
 *
 * @package BMFBE\Rest_API
 */
abstract class Base extends \WP_REST_Controller {
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
	 * @since 1.0.0
	 *
	 * @param Plugin $plugin Main plugin object.
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
	 * Registers the routes for the objects of the controller.
	 *
	 * @since 1.0.0
	 */
	public function register_routes() {
		_doing_it_wrong( '\BMFBE\Rest_API\Base::register_routes', sprintf( __( "Method '%s' must be overridden." ), __METHOD__ ), '1.0.0' );
	}

	/**
	 * Checks if a given request has access to get items.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		return $this->permission( $request, esc_html__( 'Sorry, you are not allowed to view this data.', 'bmfbe' ) );
	}

	/**
	 * Checks if a given request has access to update items.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool True if the request has read access, WP_Error object otherwise.
	 */
	public function update_items_permissions_check( $request ) {
		return $this->permission( $request, esc_html__( 'Sorry, you are not allowed to update this data.', 'bmfbe' ) );
	}

	/**
	 * Retrieves the query params for the blocks collection.
	 *
	 * @since 1.0.0
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() {
		$params = parent::get_collection_params();

		unset( $params['context'] );
		unset( $params['search'] );

		return $params;
	}

	protected function capability() {
		return apply_filters( 'bmfbe_rest_api_capability', $this->plugin->settings->capability() );
	}

	/**
	 * Checks if a given request has access to get items.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @param string          $message Error message to send.
	 * @return WP_Error|bool True if the request has read access, WP_Error object otherwise.
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
