<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Editor.
 *
 * @since 1.0.0
 * @package BMFBE
 */

namespace BMFBE;

use BMFBE\Interfaces\WP_Plugin_Class;
use BMFBE\Settings\Block_Settings;
use BMFBE\Settings\Global_Settings;

/**
 * Block Manager for WordPress Block Editor (Gutenberg): Editor.
 *
 * @since 1.0.0
 * @package BMFBE
 */
class Editor implements WP_Plugin_Class {
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
		$this->hooks();
	}

	/**
	 * Initiate our hooks.
	 *
	 * @since 1.0.0
	 */
	public function hooks() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ), 999 );
		add_action( 'init', array( $this, 'editor_settings' ), 999 );
	}

	/**
	 * Enqueue scripts and styles.
	 */
	public function enqueue_block_editor_assets() {
		$settings = Global_Settings::get_instance()->get_settings();
		$blocks   = array_map(
			function ( $block ) {
				return array(
					'name'              => $block['name'],
					'supports_override' => $block['supports_override'],
					'supports'          => $block['supports'],
					'styles'            => $block['styles'],
					'variations'        => $block['variations'],
					// 'access'            => $block['access'],
				);
			},
			Block_Settings::get_instance()->get_settings()
		);

		if ( $settings['supports_override'] ) {
			$blocks = array_map(
				function ( $block ) {
					if ( $block['supports_override'] ) {
						return $block;
					}

					$settings = Global_Settings::get_instance()->get_settings();

					$block['supports_override'] = true;
					$block['supports']          = $settings['supports'];

					return $block;
				},
				$blocks
			);
		}

		wp_enqueue_script(
			'bmfbe-editor',
			$this->plugin->url . 'dist/editor.build.js',
			array( 'lodash', 'wp-api-fetch', 'wp-blocks', 'wp-dom-ready', 'wp-edit-post', 'wp-element', 'wp-i18n' ),
			substr( sha1( filemtime( $this->plugin->path . 'dist/editor.build.js' ) ), 0, 8 ),
			true
		);
		wp_localize_script(
			'bmfbe-editor',
			'bmfbeEditorGlobal',
			array(
				'detect'       => ! empty( $_GET['detect'] ),
				'settingsPage' => add_query_arg( array( 'page' => 'bmfbe-settings' ), admin_url( 'admin.php' ) ),
				'settings'     => $settings,
				'blocks'       => $blocks,
			)
		);

		wp_enqueue_style(
			'bmfbe-editor',
			$this->plugin->url . 'dist/editor.build.css',
			array( 'wp-edit-blocks' ),
			substr( sha1( filemtime( $this->plugin->path . 'dist/editor.build.css' ) ), 0, 8 )
		);
	}

	/**
	 * Customize editor settings.
	 */
	public function editor_settings() {
		$settings = Global_Settings::get_instance()->get_settings();

		if ( isset( $settings['disable_color_palettes'] ) && true === $settings['disable_color_palettes'] ) {
			add_theme_support( 'editor-color-palette', array() );
		}

		if ( isset( $settings['disable_custom_colors'] ) && true === $settings['disable_custom_colors'] ) {
			add_theme_support( 'disable-custom-colors' );
		}

		if ( isset( $settings['disable_gradient_presets'] ) && true === $settings['disable_gradient_presets'] ) {
			add_theme_support( 'editor-gradient-presets', array() );
		}

		if ( isset( $settings['disable_custom_gradients'] ) && true === $settings['disable_custom_gradients'] ) {
			add_theme_support( 'disable-custom-gradients' );
		}

		if ( isset( $settings['disable_font_sizes'] ) && true === $settings['disable_font_sizes'] ) {
			add_theme_support( 'editor-font-sizes', array() );
		}

		if ( isset( $settings['disable_custom_font_sizes'] ) && true === $settings['disable_custom_font_sizes'] ) {
			add_theme_support( 'disable-custom-font-sizes' );
		}
	}
}
