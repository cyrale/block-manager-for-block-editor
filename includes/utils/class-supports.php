<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Supports.
 *
 * @since 1.0.0
 * @package BMFBE\Utils
 */

namespace BMFBE\Utils;

use Exception;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Supports.
 *
 * @since 1.0.0
 * @package BMFBE\Utils
 *
 * @property-read array $fields Schema that defined supports.
 * @property-read array $schema Schema that defined supports.
 */
class Supports extends Singleton {
	/**
	 * Common schema for all properties.
	 *
	 * @var array
	 * @since 1.0.0
	 */
	protected $common_schema = array();

	/**
	 * List of all supported properties.
	 *
	 * @var array
	 * @since 1.0.0
	 */
	protected $properties = array();

	/**
	 * Schema that defined supports.
	 *
	 * @var array
	 * @since 1.0.0
	 */
	protected $schema = array();

	/**
	 * Fields used in admin screen.
	 *
	 * @var array
	 * @since 1.0.0
	 */
	protected $fields = array();

	/**
	 * Flag to identify if properties are initialized for the first time.
	 *
	 * @var boolean
	 * @since 1.0.0
	 */
	protected $properties_init = false;

	/**
	 * Flag to identify if properties are initialized after Gutenberg.
	 *
	 * @var boolean
	 * @since 1.0.0
	 */
	protected $gutenberg_init = false;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		parent::__construct();

		$this->common_schema = array(
			'type'       => 'object',
			'properties' => array(
				'isActive' => array(
					'description' => __( 'Is current support active?', 'bmfbe' ),
					'type'        => 'boolean',
					'default'     => false,
				),
				'value'    => array(
					'description' => __( 'Value of current support', 'bmfbe' ),
					'type'        => 'boolean',
				),
			),
		);

		$this->properties = array(
			'align'              => array(
				'field'  => array(
					'help'   => __(
						'This property adds block controls which allow to change block’s alignment. <em>Important: It doesn’t work with dynamic blocks yet.</em>',
						'bmfbe'
					),
					'values' => array(
						array(
							'label' => __( 'Left', 'bmfbe' ),
							'value' => 'left',
						),
						array(
							'label' => __( 'Center', 'bmfbe' ),
							'value' => 'center',
						),
						array(
							'label' => __( 'Right', 'bmfbe' ),
							'value' => 'right',
						),
						array(
							'label' => __( 'Wide', 'bmfbe' ),
							'value' => 'wide',
						),
						array(
							'label' => __( 'Full', 'bmfbe' ),
							'value' => 'full',
						),
					),
				),
				'schema' => array(
					'description' => __(
						'This property adds block controls which allow to change block’s alignment.',
						'bmfbe'
					),
					'properties'  => array(
						'value' => array(
							'type'    => array( 'boolean', 'array' ),
							'default' => false,
							'items'   => array(
								'type' => 'string',
								'enum' => array( 'left', 'center', 'right', 'wide', 'full' ),
							),
						),
					),
				),
			),
			'alignWide'          => array(
				'field'  => array(
					'help' => __(
						'This property allows to enable wide alignment for your theme. To disable this behavior for a single block, set this flag to <code>false</code>.',
						'bmfbe'
					),
				),
				'schema' => array(
					'description' => __(
						'This property allows to enable wide alignment for your theme.',
						'bmfbe'
					),
					'properties'  => array(
						'value' => array( 'default' => true ),
					),
				),
			),
			'defaultStylePicker' => array(
				'field'  => array(
					'help' => __(
						'When the style picker is shown, a dropdown is displayed so the user can select a default style for this block type. If you prefer not to show the dropdown, set this property to <code>false</code>.',
						'bmfbe'
					),
				),
				'schema' => array(
					'description' => __(
						'This property allow the style picker to be shown.',
						'bmfbe'
					),
					'properties'  => array(
						'value' => array( 'default' => true ),
					),
				),
			),
			'anchor'             => array(
				'field'  => array(
					'help' => __(
						'Anchors let you link directly to a specific block on a page. This property adds a field to define an id for the block and a button to copy the direct link.',
						'bmfbe'
					),
				),
				'schema' => array(
					'description' => __(
						'This property adds a field to define an id for the block and a button to copy the direct link.',
						'bmfbe'
					),
					'properties'  => array(
						'value' => array( 'default' => false ),
					),
				),
			),
			'customClassName'    => array(
				'field'  => array(
					'help' => __(
						'This property adds a field to define a custom className for the block’s wrapper.',
						'bmfbe'
					),
				),
				'schema' => array(
					'description' => __(
						'This property adds a field to define a custom className for the block’s wrapper.',
						'bmfbe'
					),
					'properties'  => array(
						'value' => array( 'default' => false ),
					),
				),
			),
			'className'          => array(
				'field'  => array(
					'help' => __(
						'By default, the class <code>.wp-block-your-block-name</code> is added to the root element of your saved markup. This helps having a consistent mechanism for styling blocks that themes and plugins can rely on. If for whatever reason a class is not desired on the markup, this functionality can be disabled.',
						'bmfbe'
					),
				),
				'schema' => array(
					'description' => __(
						'This property remove the support for the generated className.',
						'bmfbe'
					),
					'properties'  => array(
						'value' => array( 'default' => true ),
					),
				),
			),
			'html'               => array(
				'field'  => array(
					'help' => __(
						'By default, a block’s markup can be edited individually. To disable this behavior, set <code>html</code> to <code>false</code>.',
						'bmfbe'
					),
				),
				'schema' => array(
					'description' => __(
						'This property remove the ability to edit a block’s markup.',
						'bmfbe'
					),
					'properties'  => array(
						'value' => array( 'default' => true ),
					),
				),
			),
			'inserter'           => array(
				'field'  => array(
					'help' => __(
						'By default, all blocks will appear in the inserter. To hide a block so that it can only be inserted programmatically, set <code>inserter</code> to <code>false</code>.',
						'bmfbe'
					),
				),
				'schema' => array(
					'description' => __(
						'Hide a block so that it can only be inserted programmatically.',
						'bmfbe'
					),
					'properties'  => array(
						'value' => array( 'default' => true ),
					),
				),
			),
			'multiple'           => array(
				'field'  => array(
					'help' => __(
						'A non-multiple block can be inserted into each post, one time only. For example, the built-in ‘More’ block cannot be inserted again if it already exists in the post being edited. A non-multiple block’s icon is automatically dimmed (unclickable) to prevent multiple instances.',
						'bmfbe'
					),
				),
				'schema' => array(
					'description' => __(
						'A non-multiple block can be inserted into each post, one time only.',
						'bmfbe'
					),
					'properties'  => array(
						'value' => array( 'default' => true ),
					),
				),
			),
			'reusable'           => array(
				'field'  => array(
					'help' => __(
						'A block may want to disable the ability of being converted into a reusable block. By default all blocks can be converted to a reusable block. If supports reusable is set to false, the option to convert the block into a reusable block will not appear.',
						'bmfbe'
					),
				),
				'schema' => array(
					'description' => __(
						'This property remove the ability to convert a block into a reusable block.',
						'bmfbe'
					),
					'properties'  => array(
						'value' => array( 'default' => true ),
					),
				),
			),
		);

		$this->init_properties();
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
		$this->init_properties();

		switch ( $field ) {
			case 'fields':
			case 'schema':
				return $this->$field;
			default:
				throw new Exception( 'Invalid ' . __CLASS__ . ' property: ' . $field );
		}
	}

	/**
	 * Initialize some properties.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	protected function init_properties() {
		if ( ! function_exists( 'is_plugin_active' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		if ( $this->properties_init && ( ! is_plugin_active( 'gutenberg/gutenberg.php' ) || $this->gutenberg_init ) ) {
			return;
		}

		$properties = $this->properties;

		$this->schema = array();
		$this->fields = array();

		foreach ( $properties as $name => $prop ) {
			// Filter properties with current version of WordPress or Gutenberg
			// plugin.
			if ( isset( $prop['version'] ) && ! Version::version_compare( $prop['version'] ) ) {
				unset( $properties[ $name ] );
			} else {

				// Apply common schema to all properties to define supports
				// schema and extract fields definition.
				$this->schema[ $name ] = array_merge_recursive(
					$this->common_schema,
					$prop['schema']
				);

				$this->fields[ $name ] = $prop['field'];
			}
		}

		$this->properties_init = true;
		$this->gutenberg_init  = is_plugin_active( 'gutenberg/gutenberg.php' ) && defined( 'GUTENBERG_VERSION' );
	}
}
