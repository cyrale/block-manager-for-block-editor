import useSettings from '../../use-settings';
import Supports from './supports';
import Toggle from './toggle';

const {
	i18n: { __ },
	url: { cleanForSlug },
} = wp;

const supportedSettings = {
	supports_override: {
		label: __( 'Override supports?', 'bmfbe' ),
	},
	supports: {
		label: __( 'Supports', 'bmfbe' ),
		Component: Supports,
	},
	disable_custom_colors: {
		label: __( 'Disable custom colors?', 'bmfbe' ),
	},
	disable_color_palettes: {
		label: __( 'Disable color palettes?', 'bmfbe' ),
	},
	disable_custom_gradients: {
		label: __( 'Disable custom gradients?', 'bmfbe' ),
	},
	disable_gradient_presets: {
		label: __( 'Disable gradient presets?', 'bmfbe' ),
	},
	disable_custom_font_sizes: {
		label: __( 'Disable custom font sizes?', 'bmfbe' ),
	},
	disable_font_sizes: {
		label: __( 'Disable font sizes?', 'bmfbe' ),
	},
	limit_access_by_post_type: {
		label: __( 'Limit access by post type?', 'bmfbe' ),
	},
	limit_access_by_user_group: {
		label: __( 'Limit access by user group?', 'bmfbe' ),
	},
};

export default function Settings() {
	const { getSettings, updateSettings } = useSettings();
	const settings = getSettings();

	function handleOnChange( key, value ) {
		updateSettings( { [ key ]: value } );
	}

	return (
		<>
			{ Object.keys( supportedSettings ).map( ( key ) => {
				const field = supportedSettings[ key ];
				const Component = field.Component ?? Toggle;

				const props = {
					label: field.label,
					onChange: ( value ) => handleOnChange( key, value ),
					value: settings[ key ],
				};

				if ( 'supports' === key ) {
					props.disabled = false === settings.supports_override;
				}

				return (
					<div
						key={ key }
						className={
							'bmfbe-settings__row bmfbe-settings__row--' +
							cleanForSlug( key )
						}
					>
						<Component { ...props } />
					</div>
				);
			} ) }
		</>
	);
}
