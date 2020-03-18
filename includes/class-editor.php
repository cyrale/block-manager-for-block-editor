<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Editor.
 *
 * @since   1.0.0
 * @package BMFBE
 */

namespace BMFBE;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Editor.
 *
 * @since 1.0.0
 */
class Editor {

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
	 * @param Plugin $plugin Main plugin object.
	 *
	 * @since  1.0.0
	 */
	public function __construct( $plugin ) {
		$this->plugin = $plugin;
		$this->hooks();
	}

	/**
	 * Initiate our hooks.
	 *
	 * @since  1.0.0
	 */
	public function hooks() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );
		add_action(
			'init',
			function() {
				add_theme_support( 'editor-color-palette', array() );
				add_theme_support( 'disable-custom-colors' );
				add_theme_support( 'editor-font-sizes', array() );
				add_theme_support( 'disable-custom-font-sizes' );
			}
		);
	}

	/**
	 * Enqueue scripts and styles.
	 */
	public function enqueue_block_editor_assets() {
		wp_enqueue_script(
			'bmfbe-editor',
			$this->plugin->url . 'dist/editor.build.js',
			array( 'wp-blocks', 'wp-dom-ready', 'wp-edit-post', 'wp-element', 'wp-i18n', 'lodash' ),
			substr( sha1( filemtime( $this->plugin->path . 'dist/editor.build.js' ) ), 0, 8 ),
			true
		);
		wp_localize_script(
			'bmfbe-editor',
			'bmfbeEditorGlobal',
			array(
				'detection' => ! ! $_GET['detection'],
			)
		);

		wp_enqueue_style(
			'bmfbe-editor',
			$this->plugin->url . 'dist/editor.build.css',
			array( 'wp-edit-blocks' ),
			substr( sha1( filemtime( $this->plugin->path . 'dist/editor.build.css' ) ), 0, 8 )
		);
	}
}
