import Toggle from './toggle';

const {
	i18n: { __ },
} = wp;

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

export default function Supports( { disabled, onChange, value } ) {
	value = value ?? {};

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

		return (
			onChange &&
			onChange( {
				...value,
				align: { ...value.align, value: newAlignValue },
			} )
		);
	}

	function handleOnChange( key, field, v ) {
		return (
			onChange &&
			onChange( { ...value, [ key ]: { ...value[ key ], [ field ]: v } } )
		);
	}

	return (
		<div className="bmfbe-supports">
			{ Object.entries( value ).map( ( [ key, val ] ) => {
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
								onChange={ ( v ) =>
									handleOnChange( key, 'isActive', v )
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
							value={ val.isActive }
							disabled={ disabled }
							onChange={ ( v ) =>
								handleOnChange( key, 'isActive', v )
							}
						>
							<Toggle
								label={ __( 'Enable', 'bmfbe' ) }
								value={ val.value }
								disabled={ disabled || ! val.isActive }
								onChange={ ( v ) =>
									handleOnChange( key, 'value', v )
								}
							/>
						</Toggle>
					</div>
				);
			} ) }
		</div>
	);
}
