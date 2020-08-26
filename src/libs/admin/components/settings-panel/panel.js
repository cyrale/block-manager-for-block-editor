/**
 * External dependencies
 */
import classnames from 'classnames';
import { Parser as HtmlToReactParser } from 'html-to-react';

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { select as wpSelect, useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SETTINGS_STORE } from '../../stores/settings/constants';
import IndeterminateToggleControl from '../indeterminate-toggle-control';
import Supports from './supports';
import useDelayedChanges from '../../hooks/use-delayed-changes';

/**
 * Parser to convert raw HTML from translations to React DOM structure.
 *
 * @constant {{parse: *, parseWithInstructions: *}}
 * @since 1.0.0
 */
const htmlToReactParser = new HtmlToReactParser();

/**
 * List of supported settings (settings that can be changed) grouped by section.
 *
 * @constant {({name: string, label: string, fields: [{name: string, label: string}|{name: string, label: string,Component: *}]})[]}
 * @since 1.0.0
 */
const sections = [
	{
		name: 'interface',
		label: __( 'Interface', 'bmfbe' ),
		fields: [
			{
				name: 'disable_fullscreen',
				label: __( 'Disable fullscreen mode', 'bmfbe' ),
			},
			{
				name: 'disable_block_directory',
				label: __( 'Disable block directory', 'bmfbe' ),
			},
		],
	},
	{
		name: 'colors',
		label: __( 'Colors', 'bmfbe' ),
		fields: [
			{
				name: 'disable_custom_colors',
				label: __( 'Disable custom colors', 'bmfbe' ),
			},
			{
				name: 'disable_color_palettes',
				label: __( 'Disable color palettes', 'bmfbe' ),
			},
			{
				name: 'disable_custom_gradients',
				label: __( 'Disable custom gradients', 'bmfbe' ),
			},
			{
				name: 'disable_gradient_presets',
				label: __( 'Disable gradient presets', 'bmfbe' ),
			},
		],
	},
	{
		name: 'typography',
		label: __( 'Typography', 'bmfbe' ),
		fields: [
			{
				name: 'disable_custom_font_sizes',
				label: __( 'Disable custom font sizes', 'bmfbe' ),
			},
			{
				name: 'disable_font_sizes',
				label: __( 'Disable font sizes', 'bmfbe' ),
			},
		],
	},
	{
		name: 'advanced',
		label: __( 'Advanced', 'bmfbe' ),
		fields: [
			{
				name: 'limit_access_by_post_type',
				label: __( 'Limit access by post type', 'bmfbe' ),
			},
			{
				name: 'limit_access_by_user_group',
				label: __( 'Limit access by user group', 'bmfbe' ),
			},
			{
				name: 'supports_override',
				label: __( 'Override supports', 'bmfbe' ),
			},
			{
				name: 'supports',
				label: __( 'Supports', 'bmfbe' ),
				Component: Supports,
			},
		],
	},
];

/**
 * Time interval after which an alert is displayed
 *
 * @constant {number}
 * @since 1.0.0
 */
const detectionInterval = 7 * 24 * 60 * 60; // 1 week.

export default function Panel() {
	const settings = useSelect(
		( select ) => select( SETTINGS_STORE ).getSettings(),
		[]
	);

	const latestDetection = settings?.latest_detection ?? 0;
	const latestDetectionInterval =
		Math.floor( Date.now() / 1000 ) - latestDetection;

	const { saveSettings, updateSettings } = useDispatch( SETTINGS_STORE );
	const { enqueueChanges, setInitialData } = useDelayedChanges(
		saveSettings
	);

	useEffect( () => {
		setInitialData( settings );
	}, [ settings ] );

	/**
	 * Handle changes on settings.
	 *
	 * @param {string} key Name of the settings.
	 * @param {any} value New value for this settings.
	 */
	function handleOnChange( key, value ) {
		updateSettings( key, value );

		const newSettings = wpSelect( SETTINGS_STORE ).getSettings();
		enqueueChanges( newSettings );
	}

	return (
		<div className="bmfbe-settings-panel">
			{ settings?.latest_detection && (
				<div className="bmfbe-settings-panel__notices">
					{ 0 !== latestDetection ? (
						<div
							className={ classnames(
								'notice',
								latestDetectionInterval <= detectionInterval
									? 'notice-info'
									: 'notice-warning'
							) }
						>
							<p>
								<span className="bmfbe-settings-panel__notice-message">
									{ htmlToReactParser.parse(
										sprintf(
											// translators: %s: date of latest detection.
											__(
												'Latest detection: %s.',
												'bmfbe'
											),
											`<b>${ new Date(
												latestDetection * 1000
											).toLocaleString() }</b>`
										)
									) }
								</span>
								<Button
									href={ bmfbeAdminGlobal.detectionPage }
									isPrimary
								>
									{ __( 'Update blocks', 'bmfbe' ) }
								</Button>
							</p>
						</div>
					) : (
						<div className="notice notice-error">
							<p>
								<span className="bmfbe-settings-panel__notice-message">
									{ __(
										'Blocks never initialized.',
										'bmfbe'
									) }
								</span>
								<Button
									href={ bmfbeAdminGlobal.detectionPage }
									isPrimary
								>
									{ __( 'Detect blocks.', 'bmfbe' ) }
								</Button>
							</p>
						</div>
					) }
				</div>
			) }
			{ sections.map( ( section ) => (
				<div
					key={ section.name }
					className="bmfbe-settings-panel__section"
				>
					<h2 className="bmfbe-settings-panel__title">
						{ section.label }
					</h2>
					<div className="bmfbe-settings-panel__content">
						{ section.fields
							.filter(
								( field ) =>
									'supports' !== field.name ||
									settings.supports_override
							)
							.map( ( field ) => {
								const Component =
									field.Component ??
									IndeterminateToggleControl;

								let props = {
									label: field.label,
									checked: settings[ field.name ] ?? false,
									onChange: ( { checked } ) =>
										handleOnChange( field.name, checked ),
								};

								if ( 'supports' === field.name ) {
									props = {
										label: field.label,
										value: props.checked,
										disabled: ! settings.supports_override,
										onChange: ( value ) =>
											handleOnChange( field.name, value ),
									};
								}

								return (
									<Component
										key={ field.name }
										{ ...props }
									/>
								);
							} ) }
					</div>
				</div>
			) ) }
		</div>
	);
}
