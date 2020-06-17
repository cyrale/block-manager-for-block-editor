import { map, merge } from 'lodash';

import { __ } from '@wordpress/i18n';

import Toggle from './toggle';

/**
 * Supported values for alignment.
 *
 * @constant {({label: string, value: boolean}|{label: string, value: string})[]}
 * @since 1.0.0
 */
const alignValues = [
	{
		label: __( 'Disable', 'bmfbe' ),
		value: false,
	},
	{
		label: __( 'Enable', 'bmfbe' ),
		value: true,
	},
	{
		label: __( 'Left', 'bmfbe' ),
		value: 'left',
	},
	{
		label: __( 'Center', 'bmfbe' ),
		value: 'center',
	},
	{
		label: __( 'Right', 'bmfbe' ),
		value: 'right',
	},
	{
		label: __( 'Wide', 'bmfbe' ),
		value: 'wide',
	},
	{
		label: __( 'Full', 'bmfbe' ),
		value: 'full',
	},
];

export default function Supports( {
	disabled = false,
	onChange = () => {},
	value = {},
} ) {
	/**
	 * Handle changes on align supports.
	 *
	 * @param {boolean|string[]} align New align values.
	 * @since 1.0.0
	 */
	function handleOnAlignChange( align ) {
		let newAlignValue;

		if ( 'boolean' === typeof align ) {
			newAlignValue = align;
		} else {
			newAlignValue = ! Array.isArray( value.align.value )
				? []
				: [ ...value.align.value ];

			if ( ! newAlignValue.includes( align ) ) {
				newAlignValue.push( align );
			} else {
				newAlignValue = newAlignValue.filter( ( v ) => v !== align );
			}
		}

		onChange( {
			...value,
			align: { ...value.align, value: newAlignValue },
		} );
	}

	/**
	 * Handle changes on other supports settings.
	 *
	 * @param {string} key Name of the supports.
	 * @param {Object} change New value for the supports.
	 */
	function handleOnChange( key, change ) {
		onChange( merge( {}, value, { [ key ]: change } ) );
	}

	return (
		<div className="bmfbe-supports">
			{ map( value, ( val, key ) => {
				if ( 'align' === key ) {
					return (
						<div
							key={ key }
							className="bmfbe-supports-row bmfbe-supports-row--align"
						>
							<Toggle
								label={ key }
								value={ val.isActive }
								disabled={ disabled }
								onChange={ ( checked ) =>
									handleOnChange( key, { isActive: checked } )
								}
							>
								{ alignValues.map(
									( { label, value: alignValue } ) => (
										<Toggle
											key={ label }
											label={ label }
											value={
												val.value === alignValue ||
												( Array.isArray( val.value ) &&
													val.value.includes(
														alignValue
													) )
											}
											disabled={
												disabled || ! val.isActive
											}
											onChange={ () =>
												handleOnAlignChange(
													alignValue
												)
											}
										/>
									)
								) }
							</Toggle>
						</div>
					);
				}

				return (
					<div key={ key } className="bmfbe-supports-row">
						<Toggle
							label={ key }
							checked={ val.isActive }
							disabled={ disabled }
							onChange={ ( checked ) =>
								handleOnChange( key, { isActive: checked } )
							}
						>
							<Toggle
								label={ __( 'Enable', 'bmfbe' ) }
								checked={ val.value }
								disabled={ disabled || ! val.isActive }
								onChange={ ( checked ) =>
									handleOnChange( key, { value: checked } )
								}
							/>
						</Toggle>
					</div>
				);
			} ) }
		</div>
	);
}
