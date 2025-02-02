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
use BMFBE\Settings\Pattern_Settings;

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
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ), 9 );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ), 999 );
		add_action( 'init', array( $this, 'early_editor_settings' ), 1 );
		add_action( 'init', array( $this, 'editor_settings' ), 999 );
		add_action( 'posts_selection', array( $this, 'late_editor_settings' ), 999 );

		add_filter( 'block_editor_settings', array( $this, 'block_editor_settings' ), 999 );
	}

	/**
	 * Enqueue admin scripts and styles.
	 *
	 * @param string $hook The current admin page.
	 *
	 * @since 1.0.0
	 */
	public function admin_enqueue_scripts( $hook ) {
		if ( 'appearance_page_gutenberg-widgets' !== $hook ) {
			return;
		}

		$this->enqueue_block_editor_assets( $hook );
	}

	/**
	 * Enqueue scripts and styles.
	 *
	 * @param string $hook The current admin page.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_block_editor_assets( $hook ) {
		$asset = require_once( $this->plugin->path . 'build/editor.asset.php' );

		$current_section = get_post_type();
		if ( 'appearance_page_gutenberg-widgets' === $hook ) {
			$current_section = '#widgets';
		}

		$current_user = wp_get_current_user();

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
			if ( isset( $block['access'][ $current_section ] ) ) {
				$block_not_tested = true;
				$block_enabled    = false;

				foreach ( $current_user->roles as $user_role ) {
					if ( ! isset( $block['access'][ $current_section ][ $user_role ] ) ) {
						continue;
					}

					$block_not_tested = false;
					$block_enabled    = $block_enabled || $block['access'][ $current_section ][ $user_role ];
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
				'settings' => $settings,
				'blocks'   => $blocks,
			)
		);

		wp_enqueue_style(
			'bmfbe-editor',
			$this->plugin->url . 'build/editor.css',
			array( 'wp-edit-blocks' ),
			$asset['version']
		);
	}

	/**
	 * Customize editor settings earlier.
	 *
	 * @since 1.0.0
	 */
	public function early_editor_settings() {
		$settings = Global_Settings::get_instance()->get_settings();

		if ( isset( $settings['disable_block_based_widgets'] ) && true === $settings['disable_block_based_widgets'] ) {
			add_filter( 'gutenberg_use_widgets_block_editor', '__return_false' );
		}

		if ( ! self::active_editor_settings() ) {
			return;
		}

		if ( isset( $settings['disable_block_patterns'] ) && true === $settings['disable_block_patterns'] ) {
			remove_theme_support( 'core-block-patterns' );
		}
	}

	/**
	 * Customize editor settings.
	 */
	public function editor_settings() {
		if ( ! self::active_editor_settings() ) {
			return;
		}

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

	/**
	 * Customize editor settings later.
	 *
	 * @since 1.0.0
	 */
	public function late_editor_settings() {
		if ( ! self::active_editor_settings() ) {
			return;
		}

		$settings = Global_Settings::get_instance()->get_settings();
		$patterns = Pattern_Settings::get_instance()->get_settings();

		$current_screen  = get_current_screen();
		$current_section = get_post_type();
		if ( 'appearance_page_gutenberg-widgets' === $current_screen->id ) {
			$current_section = '#widgets';
		}

		$current_user = wp_get_current_user();

		foreach ( $patterns as $pattern ) {
			$user_access = true;
			foreach ( $current_user->roles as $role ) {
				$user_access = $user_access && $pattern['access'][ $current_section ][ $role ];
			}

			if ( ( isset( $settings['disable_block_patterns'] ) && true === $settings['disable_block_patterns'] )
				|| ! $user_access ) {
				unregister_block_pattern( $pattern['name'] );
			}
		}
	}

	/**
	 * Customize settings passed to the block editor.
	 *
	 * @param array $editor_settings Current editor settings.
	 *
	 * @return array New editor settings.
	 * @since 1.0.0
	 */
	public function block_editor_settings( $editor_settings ) {
		if ( ! self::active_editor_settings() && ! isset( $editor_settings['__experimentalFeatures'] ) ) {
			return $editor_settings;
		}

		$settings = Global_Settings::get_instance()->get_settings();

		foreach ( $editor_settings['__experimentalFeatures'] as &$s ) {
			if ( isset( $s['color'] ) && isset( $s['color']['palette'] )
				&& isset( $settings['disable_color_palettes'] ) && true === $settings['disable_color_palettes'] ) {
					die( 'color' );
				$s['color']['palette'] = array();
			}

			if ( isset( $s['color'] ) && isset( $s['color']['gradients'] )
				&& isset( $settings['disable_gradient_presets'] ) && true === $settings['disable_gradient_presets'] ) {
				$s['color']['gradients'] = array();
			}

			if ( isset( $s['typography'] ) && isset( $s['typography']['fontSizes'] )
				&& isset( $settings['disable_font_sizes'] ) && true === $settings['disable_font_sizes'] ) {
				$s['typography']['fontSizes'] = array();
			}
		}

		return $editor_settings;
	}

	/**
	 * Disable block directory.
	 */
	public static function disable_block_directory() {
		if ( ! self::active_editor_settings() ) {
			return;
		}

		$settings = Global_Settings::get_instance()->get_settings();

		if ( isset( $settings['disable_block_directory'] ) && true === $settings['disable_block_directory'] ) {
			remove_action( 'enqueue_block_editor_assets', 'wp_enqueue_editor_block_directory_assets' );
			remove_action( 'enqueue_block_editor_assets', 'gutenberg_enqueue_block_editor_assets_block_directory' );
		}
	}

	/**
	 * Test on which pages to active editor settings.
	 */
	protected static function active_editor_settings() {
		global $pagenow;

		$active = ( isset( $pagenow )
			&& ( 'post.php' === $pagenow
				|| 'post-new.php' === $pagenow
				|| ( 'themes.php' === $pagenow && isset( $_GET['page'] ) && in_array( $_GET['page'], array( 'gutenberg-widgets' ), true ) ) ) );
		$active = apply_filters( 'bmfbe_active_editor_settings', $active );

		return $active;
	}
}
