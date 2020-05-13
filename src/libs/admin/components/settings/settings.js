import { omit } from 'lodash';

import useSettings from '../../use-settings';
import Supports from '../supports';
import Item from './item';

const {
	i18n: { __ },
} = wp;

function supportsProps( settingsValue ) {
	return {
		disabled: settingsValue?.disabled ?? true,
		settings: omit( settingsValue ?? {}, [ 'disabled' ] ),
	};
}

const defaultSettingsField = {
	Component: Item,
	props: ( settingsValue ) => ( { isActive: settingsValue ?? false } ),
	value: ( value ) => value.isActive,
};

const supportedSettings = {
	supports_override: {
		label: __( 'Override supports?', 'bmfbe' ),
		...defaultSettingsField,
	},
	supports: {
		label: __( 'Supports', 'bmfbe' ),
		Component: Supports,
		props: supportsProps,
		value: ( value ) => value,
	},
	disable_custom_colors: {
		label: __( 'Disable custom colors?', 'bmfbe' ),
		...defaultSettingsField,
	},
	disable_color_palettes: {
		label: __( 'Disable color palettes?', 'bmfbe' ),
		...defaultSettingsField,
	},
	disable_custom_gradients: {
		label: __( 'Disable custom gradients?', 'bmfbe' ),
		...defaultSettingsField,
	},
	disable_gradient_presets: {
		label: __( 'Disable gradient presets?', 'bmfbe' ),
		...defaultSettingsField,
	},
	disable_custom_font_sizes: {
		label: __( 'Disable custom font sizes?', 'bmfbe' ),
		...defaultSettingsField,
	},
	disable_font_sizes: {
		label: __( 'Disable font sizes?', 'bmfbe' ),
		...defaultSettingsField,
	},
	limit_access_by_post_type: {
		label: __( 'Limit access by post type?', 'bmfbe' ),
		...defaultSettingsField,
	},
	limit_access_by_user_group: {
		label: __( 'Limit access by user group?', 'bmfbe' ),
		...defaultSettingsField,
	},
};

const Settings = () => {
	const { getSettings, updateSettings } = useSettings();
	const settings = getSettings();

	function handleOnChange( key, value ) {
		const field = supportedSettings[ key ];

		updateSettings( { [ key ]: field.value( value ) } );
	}

	return (
		<>
			{ Object.keys( supportedSettings ).map( ( key ) => {
				const field = supportedSettings[ key ];
				const Component = field.Component;

				const props = {
					...field.props( settings[ key ] ),
					label: field.label,
					onChange: ( value ) => handleOnChange( key, value ),
				};

				if ( 'supports' === key ) {
					props.disabled = false === settings.supports_override;
				}

				return <Component key={ key } { ...props } />;
			} ) }
		</>
	);
};

export default Settings;
