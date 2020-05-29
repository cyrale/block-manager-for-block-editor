import Supports from '../components/supports';
import Toggle from '../components/toggle';
import useDelayedChanges from '../use-delayed-changes';
import Row from './row';
import { SETTINGS_PANEL_STORE } from './store/constants';


const {
	data: { select: wpSelect, useDispatch, useSelect },
	element: { useEffect },
	i18n: { __ },
} = wp;

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
		( select ) => select( SETTINGS_PANEL_STORE ).getSettings(),
		[]
	);

	const { saveSettings, updateSettings } = useDispatch(
		SETTINGS_PANEL_STORE
	);
	const { enqueueChanges, setInitialData } = useDelayedChanges(
		saveSettings
	);

	useEffect( () => {
		setInitialData( settings );
	}, [ settings ] );

	function handleOnChange( key, value ) {
		updateSettings( key, value );

		const newSettings = wpSelect( SETTINGS_PANEL_STORE ).getSettings();
		enqueueChanges( newSettings );
	}

	return (
		<div className="bmfbe-settings-panel">
			{ supportedSettings.map( ( field ) => {
				const Component = field.Component ?? Toggle;

				const props = {
					label: field.label,
					onChange: ( value ) => handleOnChange( field.name, value ),
					value: settings[ field.name ],
				};

				if ( 'supports' === field.name ) {
					props.disabled = false === settings.supports_override;
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
