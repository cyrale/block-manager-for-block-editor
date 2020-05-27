import Supports from '../components/supports';
import Toggle from '../components/toggle';
import Row from './row';
import useDelayedChanges from '../use-delayed-changes';

import { SETTINGS_STORE } from './store/constants';

const {
	data: { useDispatch, useSelect },
	element: { useEffect },
	i18n: { __ },
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

export default function Panel() {
	const { settings, getSettings } = useSelect(
		( select ) => ( {
			settings: select( SETTINGS_STORE ).getSettings(),
			getSettings: select( SETTINGS_STORE ).getSettings,
		} ),
		[]
	);

	const { saveSettings, updateSettings } = useDispatch( SETTINGS_STORE );

	const { enqueueChanges, setInitialData } = useDelayedChanges(
		async ( data ) => {
			saveSettings( data );
		}
	);

	useEffect( () => {
		setInitialData( settings );
	}, [ settings ] );

	function handleOnChange( key, value ) {
		updateSettings( key, value );

		const newSettings = getSettings();
		enqueueChanges( newSettings );
	}

	return (
		<div className="bmfbe-settings-panel">
			{ Object.entries( supportedSettings ).map( ( [ key, field ] ) => {
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
					<Row key={ key } name={ key }>
						<Component { ...props } />
					</Row>
				);
			} ) }
		</div>
	);
}
