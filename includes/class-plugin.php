<?php
/**
 * Block Manager for WordPress Block Editor (Gutenberg): Main class.
 *
 * @since   1.0.0
 * @package BMFBE
 */

namespace BMFBE;

use BMFBE\Rest_API\Blocks_Controller;
use BMFBE\Rest_API\Settings_Controller;
use BMFBE\Settings\Block_Settings;
use BMFBE\Settings\Global_Settings;
use Exception;

/**
 * Main initiation class.
 *
 * @since 1.0.0
 * @package BMFBE
 *
 * @property-read string          $version         Current version.
 * @property-read string          $basename        Plugin basename.
 * @property-read string          $url             URL of plugin directory.
 * @property-read string          $path            Path of plugin directory.
 * @property-read Block_Settings  $block_settings  Block settings.
 * @property-read Global_Settings $global_settings Global settings of plugin.
 */
final class Plugin {
	/**
	 * Current version.
	 *
	 * @var string
	 * @since 1.0.0
	 */
	const VERSION = '1.0.0';

	/**
	 * URL of plugin directory.
	 *
	 * @var string
	 * @since 1.0.0
	 */
	protected $url = '';

	/**
	 * Path of plugin directory.
	 *
	 * @var string
	 * @since 1.0.0
	 */
	protected $path = '';

	/**
	 * Plugin basename.
	 *
	 * @var string
	 * @since 1.0.0
	 */
	protected $basename = '';

	/**
	 * Detailed activation error messages.
	 *
	 * @var array
	 * @since 1.0.0
	 */
	protected $activation_errors = array();

	/**
	 * Singleton instance of plugin.
	 *
	 * @var Plugin
	 * @since 1.0.0
	 */
	protected static $single_instance = null;

	/**
	 * Instance of BMFBE\Rest_API\Blocks_Controller
	 *
	 * @var Blocks_Controller
	 * @since 1.0.0
	 */
	protected $api_blocks;

	/**
	 * Instance of BMFBE\Rest_API\Settings_Controller
	 *
	 * @var Settings_Controller
	 * @since 1.0.0
	 */
	protected $api_settings;

	/**
	 * Instance of BMFBE\Admin.
	 *
	 * @var Admin
	 * @since 1.0.0
	 */
	protected $admin;

	/**
	 * Instance of BMFBE\Common.
	 *
	 * @var Common
	 * @since 1.0.0
	 */
	protected $common;

	/**
	 * Instance of BMFBE\Editor.
	 *
	 * @var Editor
	 * @since 1.0.0
	 */
	protected $editor;

	/**
	 * Instance of BMFBE\Front.
	 *
	 * @var Front
	 * @since 1.0.0
	 */
	protected $front;

	/**
	 * Instance of BMFBE\Settings\Global_Settings: global settings of plugin.
	 *
	 * @var Global_Settings
	 * @since 1.0.0
	 */
	protected $global_settings;

	/**
	 * Instance of BMFBE\Settings\Block_Settings: block settings.
	 *
	 * @var Block_Settings
	 * @since 1.0.0
	 */
	protected $block_settings;

	/**
	 * Creates or returns an instance of this class.
	 *
	 * @return Plugin A single instance of this class.
	 * @throws Exception If plugin not correctly initialized.
	 * @since 1.0.0
	 */
	public static function get_instance() {
		if ( null === self::$single_instance ) {
			self::$single_instance = new self();
		}

		return self::$single_instance;
	}

	/**
	 * Sets up our plugin.
	 *
	 * @throws Exception If plugin not correctly initialized.
	 * @since 1.0.0
	 */
	protected function __construct() {
		if ( ! defined( 'BMFBE_MAIN_FILE' ) ) {
			throw new Exception( 'Plugin not correctly initialized.' );
		}

		$this->basename = plugin_basename( BMFBE_MAIN_FILE );
		$this->url      = plugin_dir_url( BMFBE_MAIN_FILE );
		$this->path     = plugin_dir_path( BMFBE_MAIN_FILE );

		$this->global_settings = new Global_Settings( $this );
		$this->block_settings  = new Block_Settings( $this );
	}

	/**
	 * Attach other plugin classes to the base plugin class.
	 *
	 * @since 1.0.0
	 */
	public function plugin_classes() {
		$this->api_blocks   = new Blocks_Controller( $this );
		$this->api_settings = new Settings_Controller( $this );

		$this->admin  = new Admin( $this );
		$this->common = new Common( $this );
		$this->editor = new Editor( $this );
		$this->front  = new Front( $this );
	} // END OF PLUGIN CLASSES FUNCTION

	/**
	 * Add hooks and filters.
	 * Priority needs to be
	 * < 10 for CPT_Core,
	 * < 5 for Taxonomy_Core,
	 * and 0 for Widgets because widgets_init runs at init priority 1.
	 *
	 * @since 1.0.0
	 */
	public function hooks() {
		add_action( 'init', array( $this, 'init' ), 0 );
	}

	/**
	 * Activate the plugin.
	 *
	 * @since 1.0.0
	 */
	public function plugin_activate() {
		// Bail early if requirements aren't met.
		if ( ! $this->check_requirements() ) {
			return;
		}
	}

	/**
	 * Deactivate the plugin.
	 * Uninstall routines should be in uninstall.php.
	 *
	 * @since 1.0.0
	 */
	public function plugin_deactivate() {
		// Add deactivation cleanup functionality here.
	}

	/**
	 * Init hooks
	 *
	 * @since 1.0.0
	 */
	public function init() {
		// Bail early if requirements aren't met.
		if ( ! $this->check_requirements() ) {
			return;
		}

		// Load translated strings for plugin.
		load_plugin_textdomain( 'bmfbe', false, dirname( $this->basename ) . '/languages/' );

		// Initialize plugin classes.
		$this->plugin_classes();
	}

	/**
	 * Check if the plugin meets requirements and
	 * disable it if they are not present.
	 *
	 * @return boolean True if requirements met, false if not.
	 * @since 1.0.0
	 */
	public function check_requirements() {
		// Bail early if plugin meets requirements.
		if ( $this->meets_requirements() ) {
			return true;
		}

		// Add a dashboard notice.
		add_action( 'all_admin_notices', array( $this, 'requirements_not_met_notice' ) );

		// Deactivate our plugin.
		add_action( 'admin_init', array( $this, 'deactivate_me' ) );

		// Didn't meet the requirements.
		return false;
	}

	/**
	 * Deactivates this plugin, hook this function on admin_init.
	 *
	 * @since 1.0.0
	 */
	public function deactivate_me() {
		// We do a check for deactivate_plugins before calling it, to protect
		// any developers from accidentally calling it too early and breaking things.
		if ( function_exists( 'deactivate_plugins' ) ) {
			deactivate_plugins( $this->basename );
		}
	}

	/**
	 * Check that all plugin requirements are met.
	 *
	 * @return boolean True if requirements are met.
	 * @since 1.0.0
	 */
	public function meets_requirements() {
		// Do checks for required classes / functions or similar.
		// Add detailed messages to $this->activation_errors array.
		return true;
	}

	/**
	 * Adds a notice to the dashboard if the plugin requirements are not met.
	 *
	 * @since 1.0.0
	 */
	public function requirements_not_met_notice() {
		// Compile default message.
		// translators: link to the list of all plugins.
		$default_message = __(
			'Block Manager for WordPress Block Editor (Gutenberg) is missing requirements and has been <a href="%s">deactivated</a>. Please make sure all requirements are available.',
			'bmfbe'
		);
		$default_message = sprintf( $default_message, admin_url( 'plugins.php' ) );

		// Default details to null.
		$details = null;

		// Add details if any exist.
		if ( $this->activation_errors && is_array( $this->activation_errors ) ) {
			$details = '<small>' . implode( '</small><br /><small>', $this->activation_errors ) . '</small>';
		}

		// Output errors.
		?>
		<div id="message" class="error">
			<p><?php echo wp_kses_post( $default_message ); ?></p>
			<?php echo wp_kses_post( $details ); ?>
		</div>
		<?php
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
		switch ( $field ) {
			case 'version':
				return self::VERSION;
			case 'basename':
			case 'url':
			case 'path':
			case 'block_settings':
			case 'global_settings':
				return $this->$field;
			default:
				throw new Exception( 'Invalid ' . __CLASS__ . ' property: ' . $field );
		}
	}
}
