import { merge, omit } from 'lodash';

import { select as wpSelect, useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Row from './row';
import { SETTINGS_STORE } from '../../stores/settings/constants';
import Supports from '../supports';
import Toggle from '../toggle';
import useDelayedChanges from '../../hooks/use-delayed-changes';

/**
 * List of supported settings (settings that can be changed).
 *
 * @constant {({name: string, label: string}|{name: string, label: string, Component: *})[]}
 * @since 1.0.0
 */
const supportedSettings = [
	{
		name: 'supports_override',
		label: __( 'Override supports?', 'bmfbe' ),
	},
	{
		name: 'supports',
		label: __( 'Supports', 'bmfbe' ),
		Component: Supports,
	},
	{
		name: 'disable_custom_colors',
		label: __( 'Disable custom colors?', 'bmfbe' ),
	},
	{
		name: 'disable_color_palettes',
		label: __( 'Disable color palettes?', 'bmfbe' ),
	},
	{
		name: 'disable_custom_gradients',
		label: __( 'Disable custom gradients?', 'bmfbe' ),
	},
	{
		name: 'disable_gradient_presets',
		label: __( 'Disable gradient presets?', 'bmfbe' ),
	},
	{
		name: 'disable_custom_font_sizes',
		label: __( 'Disable custom font sizes?', 'bmfbe' ),
	},
	{
		name: 'disable_font_sizes',
		label: __( 'Disable font sizes?', 'bmfbe' ),
	},
	{
		name: 'limit_access_by_post_type',
		label: __( 'Limit access by post type?', 'bmfbe' ),
	},
	{
		name: 'limit_access_by_user_group',
		label: __( 'Limit access by user group?', 'bmfbe' ),
	},
];

export default function Panel() {
	const settings = useSelect(
		( select ) => select( SETTINGS_STORE ).getSettings(),
		[]
	);

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
			{ supportedSettings.map( ( field ) => {
				const Component = field.Component ?? Toggle;

				let props = {
					checked: settings[ field.name ],
					label: field.label,
					onChange: ( value ) => handleOnChange( field.name, value ),
				};

				if ( 'supports' === field.name ) {
					props = merge( {}, omit( props, [ 'checked' ] ), {
						disabled: ! settings.supports_override,
						value: props.checked,
					} );
				}

				return (
					<Row key={ field.name } name={ field.name }>
						<Component { ...props } />
					</Row>
				);
			} ) }
		</div>
	);
}
