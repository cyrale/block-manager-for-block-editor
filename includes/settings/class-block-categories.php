<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Block categories.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */

namespace BMFBE\Settings;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Block categories.
 *
 * @since 1.0.0
 * @package BMFBE\Settings
 */
class Block_Categories extends Settings {
		/**
		 * Constructor.
		 *
		 * @since 1.0.0
		 */
	public function __construct() {
		parent::__construct();

		$this->option_name = 'block_categories';

		// Initialize available options like arguments in Rest API.
		$this->schema = array(
			'description' => __( 'List of categories used to group blocks', 'bmfbe' ),
			'type'        => 'array',
			'default'     => array(),
			'items'       => array(
				'type'       => 'object',
				'default'    => array(),
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
					'icon'  => array(
						'description' => __( 'Icon of the category', 'bmfbe' ),
						'type'        => 'string',
					),
				),
			),
		);
	}
}
