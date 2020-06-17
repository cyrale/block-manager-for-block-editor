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
		$asset = require_once $this->plugin->path . 'build/editor.asset.php';

		$post_type = get_post_type();
		$wp_user   = wp_get_current_user();

		$settings = Global_Settings::get_instance()->get_settings();

		$blocks = array();
		foreach ( Block_Settings::get_instance()->get_settings() as $block ) {
			$current_block = array(
				'name'              => $block['name'],
				'supports_override' => $block['supports_override'],
				'supports'          => $block['supports'],
				'styles'            => $block['styles'],
				'variations'        => $block['variations'],
			);

			// Override supports with global settings.
			if ( $settings['supports_override'] && ! $block['supports_override'] ) {
				$current_block['supports_override'] = true;
				$current_block['supports']          = $settings['supports'];
			}

			// Check if block is enabled.
			$current_block['enabled'] = true;
			if ( isset( $block['access'][ $post_type ] ) ) {
				$block_not_tested = true;
				$block_enabled    = false;

				foreach ( $wp_user->roles as $user_role ) {
					if ( ! isset( $block['access'][ $post_type ][ $user_role ] ) ) {
						continue;
					}

					$block_not_tested = false;
					$block_enabled    = $block_enabled || $block['access'][ $post_type ][ $user_role ];
				}

				$current_block['enabled'] = $block_not_tested || $block_enabled;
			}

			$blocks[] = $current_block;
		}

		wp_enqueue_script(
			'bmfbe-editor',
			$this->plugin->url . 'build/editor.js',
			$asset['dependencies'],
			$asset['version'],
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
			$this->plugin->url . 'dist/editor.css',
			array( 'wp-edit-blocks' ),
			$asset['version']
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
