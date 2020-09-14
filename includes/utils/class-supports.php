<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Supports.
 *
 * @since 1.0.0
 * @package BMFBE\Utils
 */

namespace BMFBE\Utils;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Supports.
 *
 * @since 1.0.0
 * @package BMFBE\Utils
 */
class Supports extends Singleton {
	/**
	 * Schema for supports.
	 *
	 * @var array
	 * @since 1.0.0
	 */
	protected $supports_schema = array();

	/**
	 * Properties used to build schema or fields for supports.
	 *
	 * @var array
	 * @since 1.0.0
	 */
	protected $supports = array();

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		parent::__construct();

		$this->supports_schema = array(
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

		$this->supports = array(
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
	}

	/**
	 * Get schema for supports.
	 *
	 * @return array Schema for supports.
	 *
	 * @since 1.0.0
	 */
	public function get_schema() {
		$schema = array();
		foreach ( $this->supports as $name => $prop ) {
			$schema[ $name ] = array_merge_recursive(
				$this->supports_schema,
				$prop['schema']
			);
		}

		return $schema;
	}

	/**
	 * Get supports fields to display in admin screen.
	 *
	 * @return array Fields to display.
	 *
	 * @since 1.0.0
	 */
	public function get_fields() {
		$fields = array();
		foreach ( $this->supports as $name => $prop ) {
			$fields[ $name ] = $prop['field'];
		}

		return $fields;
	}
}
