/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	ITEM_STORE as SETTINGS_STORE,
	STATUS_LOADING,
} from '../../../stores/settings/constants';
import IndeterminateToggleControl from '../indeterminate-toggle-control';
import Loader from '../loader';
import Supports from './supports';

export default function Panel() {
	const { isLoading, settings } = useSelect( ( select ) => {
		const store = select( SETTINGS_STORE );

		return {
			isLoading: STATUS_LOADING === store.getStatus(),
			settings: store.getItem(),
		};
	}, [] );

	const { updateItem } = useDispatch( SETTINGS_STORE );

	/**
	 * Handle changes on settings.
	 *
	 * @param {string} key Name of the settings.
	 * @param {any} value New value for this settings.
	 */
	function handleOnChange( key, value ) {
		updateItem( key, value );
	}

	return (
		<div className="bmfbe-settings-panel">
			{ isLoading && (
				<Loader label={ __( 'Loading settings…', 'bmfbe' ) } />
			) }
			{ ! isLoading &&
				bmfbeAdminGlobal.settingsSections.map( ( section ) => (
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
									let props = {};

									if ( 'supports' === field.name ) {
										props = {
											label: field.label,
											value:
												settings[ field.name ] ?? false,
											disabled: ! settings.supports_override,
											onChange: ( value ) =>
												handleOnChange(
													field.name,
													value
												),
										};

										return (
											<Supports
												key={ field.name }
												{ ...props }
											/>
										);
									}

									props = {
										label: field.label,
										checked:
											settings[ field.name ] ?? false,
										onChange: ( { checked } ) =>
											handleOnChange(
												field.name,
												checked
											),
									};

									return (
										<IndeterminateToggleControl
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
